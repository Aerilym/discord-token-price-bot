import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types.ts';

const BASE_URL = 'https://github.com/';

export const githubCommand = {
  name: 'github',
  description: 'Github Repositories',
  handler: async (interaction) => {
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      new ButtonBuilder()
        .setLabel('Android')
        .setURL(`${BASE_URL}/session-foundation/session-android`)
        .setStyle(5),
      new ButtonBuilder()
        .setLabel('iOS')
        .setURL(`${BASE_URL}/session-foundation/session-ios`)
        .setStyle(5),
      new ButtonBuilder()
        .setLabel('Desktop')
        .setURL(`${BASE_URL}/session-foundation/session-desktop`)
        .setStyle(5),
      new ButtonBuilder()
        .setLabel('Session Node')
        .setURL(`${BASE_URL}/oxen-io/oxen-core`)
        .setStyle(5),
      new ButtonBuilder()
        .setLabel('Staking Portal')
        .setURL(`${BASE_URL}/session-foundation/websites`)
        .setStyle(5),
    ]);

    const embed = new EmbedBuilder()
      .setTitle('Session Github')
      .setDescription('Open Source Github Repositories')
      .setColor(0x00f782);

    await interaction.reply({
      components: [actionRow],
      embeds: [embed],
    });
  },
} satisfies Command;
