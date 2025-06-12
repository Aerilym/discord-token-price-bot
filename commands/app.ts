import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import type { Command } from '../types.ts';

export const appCommand = {
  name: 'app',
  description: 'Session Messenger app information',
  handler: async (interaction) => {
    const button = new ButtonBuilder()
      .setLabel('Download')
      .setURL('https://getsession.org/download')
      .setStyle(5);

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    const embed = new EmbedBuilder()
      .setTitle('Session Messenger')
      .setDescription('Send Messages, Not Metadata.')
      .setImage('https://getsession.org/_next/image?url=%2Fassets%2Fimages%2Fhero.png&w=3840&q=75')
      .setColor(0x00f782);

    await interaction.reply({
      components: [actionRow],
      embeds: [embed],
    });
  },
} satisfies Command;
