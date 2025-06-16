import { CACHE_KEY, cache } from './cache.ts';
import { SESSION_NETWORK_API_URL } from './env.ts';

type PriceData = { t_price: number; t_stale: number; usd: number; usd_market_cap: number };
type NetworkData = {
  network_size: number;
  network_staked_tokens: number;
  network_staked_usd: number;
};
type TokenData = {
  circulating_supply: number;
  contract_address: string;
  staking_requirement: number;
  staking_reward_pool: number;
};

type NetworkApiInfoResponse = {
  network: NetworkData;
  price: PriceData;
  token: TokenData;
  t: number;
};

export async function getNetworkApiData() {
  if (!SESSION_NETWORK_API_URL) {
    console.warn('SESSION_NETWORK_API_URL is not set, network api commands will not work');
    return;
  }

  // const cachedNetworkApiData = cache.get<NetworkApiInfoResponse>(CACHE_KEY.NETWORK_API_RESPONSE);
  // if (cachedNetworkApiData) {
  //   return cachedNetworkApiData;
  // }

  const response = await fetch(SESSION_NETWORK_API_URL);
  const json = (await response.json()) as NetworkApiInfoResponse;

  const staleTime = Math.min(Date.now() + 30_000, json.price.t_stale, 5_000);

  cache.set(CACHE_KEY.NETWORK_API_RESPONSE, json, staleTime);

  return json;
}

type PriceDataWithCirculatingSupply = PriceData & {
  circulating_supply: number;
};

export async function getPriceData() {
  // const cachedPriceData = cache.get<PriceDataWithCirculatingSupply>(CACHE_KEY.PRICE_DATA);
  // if (cachedPriceData) {
  //   return cachedPriceData;
  // }

  const networkApiInfoData = await getNetworkApiData();

  if (!networkApiInfoData) {
    console.warn('networkApiInfoDat not available!');
    return;
  }

  const priceData = {
    ...networkApiInfoData.price,
    circulating_supply: networkApiInfoData.token.circulating_supply,
  };

  cache.setWithExpireTime(CACHE_KEY.PRICE_DATA, priceData, priceData.t_stale * 1000);
  return priceData;
}
