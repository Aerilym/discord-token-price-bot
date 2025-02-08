import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { priceCommand } from './commands/price.ts';
import { BOT_APP_ID, BOT_TOKEN, IGNORE_INVALID_COMMANDS } from './env.ts';
import type { Command, CommandInfo } from './types.ts';

const parseCommandInfo = (command: Command): CommandInfo => {
  return {
    name: command.name,
    description: command.description,
  };
};

const commandToLoad = [priceCommand];
const commandDetails = [];
const commands: Record<string, Command> = {};

for (const command of commandToLoad) {
  commands[command.name] = command;
  commandDetails.push(parseCommandInfo(command));
}

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');
  console.log(`Reloading commands: ${Object.keys(commands).join(', ')}`);

  await rest.put(Routes.applicationCommands(BOT_APP_ID), { body: commandDetails });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands[interaction.commandName];
  if (!command) {
    if (IGNORE_INVALID_COMMANDS) {
      return;
    }
    await interaction.reply('Unknown command');
    return;
  }

  return command.handler(interaction);
});

client.login(BOT_TOKEN);
