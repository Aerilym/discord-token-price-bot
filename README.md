# Discord Token Price Bot

This is a Discord bot that provides information about the price of a crypto token.

## Usage

To start the bot, you need to set the following environment variables:

- `BOT_TOKEN`: The bot token. You can get it from the Discord Developer Portal.
- `BOT_APP_ID`: The bot application ID. You can get it from the Discord Developer Portal.
- `PRICE_API_URL`: The URL of the price API.
- `PRICE_TOKEN_SYMBOL`: The symbol of the token.
- `PRICE_SOURCE_DISCLAIMER`: The name of the source of the price data. eg: "CoinGecko"
- `IGNORE_INVALID_COMMANDS`: Set to `true` to ignore invalid commands, rather than despond with "Invalid Command".

## Commands

- `/price`: Get the price info for the token.

## Development

### Prerequisites

- [bun](https://bun.sh)

### Installation

To install dependencies:

```sh
bun install
```

To run:

```sh
bun start
```
