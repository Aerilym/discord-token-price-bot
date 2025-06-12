import { getNetworkApiData, getPriceData } from '../api.ts';
import { TOKEN_SYMBOL } from '../env.ts';
import type { Command } from '../types.ts';

async function getFormattedNetworkData() {
  const res = await getNetworkApiData();
  if (!res) {
    return null;
  }

  const stakedUSD = res.network.network_staked_usd.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const stakedTokens = `${res.network.network_staked_tokens.toLocaleString('en-US', {
    roundingMode: 'trunc',
  })} ${TOKEN_SYMBOL}`;

  const rewardPoolTokens = `${res.token.staking_reward_pool.toLocaleString('en-US', {
    roundingMode: 'trunc',
  })} ${TOKEN_SYMBOL}`;

  const networkSize = res.network.network_size.toLocaleString('en-US');

  return {
    stakedUSD,
    stakedTokens,
    rewardPoolTokens,
    networkSize,
  };
}

export const networkCommand = {
  name: 'network',
  description: 'Get Session network info',
  handler: async (interaction) => {
    const data = await getFormattedNetworkData();
    if (!data) {
      await interaction.reply('Failed to get network data');
      return;
    }

    await interaction.reply({
      embeds: [
        {
          title: 'Session Network Information',
          color: 0x00f782,
          fields: [
            {
              name: 'Nodes',
              value: data.networkSize,
              inline: true,
            },
            {
              name: 'Reward Pool',
              value: data.rewardPoolTokens,
              inline: true,
            },
            {
              name: `Staked ${TOKEN_SYMBOL}`,
              value: data.stakedTokens,
              inline: true,
            },
            {
              name: `Staked ${TOKEN_SYMBOL} (USD)`,
              value: data.stakedUSD,
              inline: true,
            },
          ],
        },
      ],
    });
  },
} satisfies Command;
