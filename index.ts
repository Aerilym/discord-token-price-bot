import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { appCommand } from './commands/app.ts';
import { githubCommand } from './commands/github.ts';
import { networkCommand } from './commands/network.ts';
import { createOpenContractMessage, openNodeCommand } from './commands/open.ts';
import { priceCommand } from './commands/price.ts';
import { BOT_APP_ID, BOT_TOKEN, IGNORE_INVALID_COMMANDS } from './env.ts';
import { getOpenNodes } from './portal.ts';
import type { Command, CommandInfo } from './types.ts';

const parseCommandInfo = (command: Command): CommandInfo => {
  return {
    name: command.name,
    description: command.description,
  };
};

const commandToLoad = [priceCommand, networkCommand, appCommand, githubCommand];
const commandDetails: Array<CommandInfo> = [];
const commands: Record<string, Command> = {};

for (const command of commandToLoad) {
  commands[command.name] = command;
  commandDetails.push(parseCommandInfo(command));
}

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');
  console.log(`Reloading commands: ${Object.keys(commands).join(', ')}`);

  const cmd = new SlashCommandBuilder()
    .setName(openNodeCommand.name)
    .setDescription(openNodeCommand.description)
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('Open Node Ed25519 Key (ID)')
        .setAutocomplete(true)
        .setRequired(true),
    );

  commandDetails.push(cmd.toJSON());
  commands[openNodeCommand.name] = openNodeCommand;

  await rest.put(Routes.applicationCommands(BOT_APP_ID), { body: commandDetails });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);

  if (client.user) {
    const stakingActivity = {
      name: 'Staking SESH',
      type: 5,
      application_id: '379286085710381999',
      state: 'Securing the network at the SESH',
      timestamps: { start: Date.now() },
      party: {
        id: '9dd6594e-81b3-49f6-a6b5-a679e6a060d3',
        size: [2, 2],
      },
    };
    client.user.setPresence({ activities: [stakingActivity], status: 'online' });
  }
});

// client.on(Events.MessageCreate, async (message) => {});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands[interaction.commandName];
    if (!command) {
      if (IGNORE_INVALID_COMMANDS) {
        return;
      }
      await interaction.reply('Unknown command');
      return;
    }

    return command.handler(interaction);
  }

  if (interaction.isAutocomplete()) {
    const command = commands[interaction.commandName];
    if (!command || !('handleAutocomplete' in command) || !command.handleAutocomplete) {
      return;
    }
    try {
      await command.handleAutocomplete(interaction);
    } catch (error) {
      console.error(error);
    }
  }
});

client.login(BOT_TOKEN);

const GUILD_ID = '1366728801815629826';
const CHANNEL_ID = '1380399036020035624';

const sentNodes = new Set<string>();

client.once(Events.ClientReady, async (readyClient) => {
  try {
    // 1. Fetch the guild by ID
    const guild = await readyClient.guilds.fetch(GUILD_ID);
    if (!guild) {
      console.error(`❌ Could not find guild ${GUILD_ID}`);
      return;
    }

    // 2. Fetch the channel by ID (cast to TextChannel)
    const channel = await guild.channels.fetch(CHANNEL_ID);
    if (!channel || !(channel instanceof TextChannel)) {
      console.error(`❌ Could not find text channel ${CHANNEL_ID} in guild ${GUILD_ID}`);
      return;
    }

    // 3. Immediately send a message, then schedule every 10 minutes
    const sendMessage = async () => {
      const { nodes } = await getOpenNodes();

      const newNodes = [];
      for (const node of nodes) {
        if (!sentNodes.has(node.address)) {
          newNodes.push(node);
          sentNodes.add(node.address);
        }
      }

      for (const node of newNodes) {
        const message = createOpenContractMessage(
          node,
          'A new multicontributor Session node is open for staking!',
        );
        channel.send(message).catch(console.error);
      }
    };

    // Schedule it to run every 1 minute
    setInterval(sendMessage, 60 * 1000);
  } catch (err) {
    console.error('Error setting up interval message:', err);
  }
});
