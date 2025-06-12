import type { AutocompleteInteraction, CacheType, ChatInputCommandInteraction } from 'discord.js';

export type CommandInfo = {
  name: string;
  description: string;
};

export type CommandHandler = (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
export type AutocompleteHandler = (
  interaction: AutocompleteInteraction<CacheType>,
) => Promise<void>;

export type Command = {
  name: string;
  description: string;
  handler: CommandHandler;
  handleAutocomplete?: AutocompleteHandler;
  stringOptions?: Array<{ description: string; autocomplete?: boolean }>;
};
