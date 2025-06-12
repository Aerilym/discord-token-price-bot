// biome-ignore lint/style/noNonNullAssertion: This is fine
const BOT_TOKEN = process.env.BOT_TOKEN!;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not set');

// biome-ignore lint/style/noNonNullAssertion: This is fine
const BOT_APP_ID = process.env.BOT_APP_ID!;
if (!BOT_APP_ID) throw new Error('BOT_APP_ID is not set');

const IGNORE_INVALID_COMMANDS = process.env.IGNORE_INVALID_COMMANDS;

const SESSION_NETWORK_API_URL = process.env.SESSION_NETWORK_API_URL!;
if (!SESSION_NETWORK_API_URL)
  console.warn('SESSION_NETWORK_API_URL is not set, network api commands will not work');

const SESSION_STAKING_PORTAL_URL = process.env.SESSION_STAKING_PORTAL_URL!;
if (!SESSION_STAKING_PORTAL_URL) throw new Error('SESSION_STAKING_PORTAL_URL is not set');

const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL!;
if (!TOKEN_SYMBOL) throw new Error('TOKEN_SYMBOL is not set');

const PRICE_SOURCE_DISCLAIMER = process.env.PRICE_SOURCE_DISCLAIMER;

export {
  BOT_TOKEN,
  BOT_APP_ID,
  IGNORE_INVALID_COMMANDS,
  SESSION_NETWORK_API_URL,
  SESSION_STAKING_PORTAL_URL,
  TOKEN_SYMBOL,
  PRICE_SOURCE_DISCLAIMER,
};
