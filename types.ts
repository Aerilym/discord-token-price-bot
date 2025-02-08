import type { CacheType, ChatInputCommandInteraction } from 'discord.js';

export type CommandInfo = {
  name: string;
  description: string;
};

export type CommandHandler = (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;

export type Command = {
  name: string;
  description: string;
  handler: CommandHandler;
};
