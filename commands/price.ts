import { PRICE_API_URL, PRICE_SOURCE_DISCLAIMER, PRICE_TOKEN_SYMBOL } from '../env.ts';
import type { Command } from '../types.ts';

type PriceData = { t_price: number; t_stale: number; usd: number; usd_market_cap: number };

type PriceApiResponse = {
  price: PriceData;
  t: number;
};

let lastPriceData: PriceData | null = null;

async function getPriceData() {
  if (!PRICE_API_URL) {
    console.warn('PRICE_API_URL is not set, price commands will not work');
    return;
  }

  const now = Date.now();
  if (!lastPriceData || lastPriceData.t_stale * 1000 < now) {
    const response = await fetch(PRICE_API_URL);
    const json = (await response.json()) as PriceApiResponse;
    lastPriceData = json.price;
  }

  return lastPriceData;
}

export const priceCommand = {
  name: 'price',
  description: `Get the price info for ${PRICE_TOKEN_SYMBOL}`,
  handler: async (interaction) => {
    const priceData = await getPriceData();
    if (!priceData) {
      await interaction.reply('Failed to get price data');
      return;
    }

    const tokenPrice = priceData.usd.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const marketCap = priceData.usd_market_cap.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const minutesSinceUpdate = Math.trunc((priceData.t_price - Date.now() / 1000) / 60);

    const relativeTimeSinceLastUpdate = new Intl.RelativeTimeFormat('en-US', {
      numeric: 'auto',
      style: 'narrow',
    }).format(minutesSinceUpdate, 'minutes');

    await interaction.reply({
      embeds: [
        {
          title: `${PRICE_TOKEN_SYMBOL} Price Information`,
          color: 0x00f782,
          fields: [
            {
              name: 'Price (USD)',
              value: tokenPrice,
              inline: true,
            },
            {
              name: 'Market Cap (USD)',
              value: marketCap,
              inline: true,
            },
          ],
          footer: {
            text: `Price data provided by ${PRICE_SOURCE_DISCLAIMER} ${relativeTimeSinceLastUpdate}`,
          },
        },
      ],
    });
  },
} satisfies Command;
