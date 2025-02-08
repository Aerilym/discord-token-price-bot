// biome-ignore lint/style/noNonNullAssertion: This is fine
const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not set');

// biome-ignore lint/style/noNonNullAssertion: This is fine
const BOT_APP_ID = process.env.BOT_APP_ID!;
if (!BOT_APP_ID) throw new Error('BOT_APP_ID is not set');

const IGNORE_INVALID_COMMANDS = process.env.IGNORE_INVALID_COMMANDS;

const PRICE_API_URL = process.env.PRICE_API_URL;
if (!PRICE_API_URL) console.warn('PRICE_API_URL is not set, price commands will not work');

const PRICE_TOKEN_SYMBOL = process.env.PRICE_TOKEN_SYMBOL;
if (!PRICE_TOKEN_SYMBOL)
  console.warn('PRICE_TOKEN_SYMBOL is not set, price commands will not work');

const PRICE_SOURCE_DISCLAIMER = process.env.PRICE_SOURCE_DISCLAIMER;

export {
  BOT_TOKEN,
  BOT_APP_ID,
  IGNORE_INVALID_COMMANDS,
  PRICE_API_URL,
  PRICE_TOKEN_SYMBOL,
  PRICE_SOURCE_DISCLAIMER,
};
