import { CACHE_KEY, cache } from './cache.ts';
import { SESSION_STAKING_PORTAL_URL } from './env.ts';

export enum CONTRIBUTION_CONTRACT_STATUS {
  WaitForOperatorContrib = 0,
  OpenForPublicContrib = 1,
  WaitForFinalized = 2,
  Finalized = 3,
}

type Contributor = {
  address: string;
  amount: number;
  beneficiary_address: string;
  reserved: number;
};

export type ContributionContract = {
  address: string;
  contributors: Array<Contributor>;
  fee: number;
  manual_finalize: boolean;
  operator_address: string;
  pubkey_bls: string;
  service_node_pubkey: string;
  events: Array<unknown>;
  status: CONTRIBUTION_CONTRACT_STATUS;
};

type OpenNodesData = {
  ids: Array<string>;
  nodes: Array<ContributionContract>;
};

export async function getOpenNodes() {
  const cachedData = cache.get<OpenNodesData>(CACHE_KEY.OPEN_NODES);

  if (cachedData) {
    return cachedData;
  }
  const url = `${SESSION_STAKING_PORTAL_URL}/api/ssb/contract/contribution`;

  const response = await fetch(url);
  const jsonResult = await response.json();

  const openNodes = [];
  if (jsonResult && Array.isArray(jsonResult.contracts)) {
    const contractsArray = jsonResult.contracts as Array<ContributionContract>;

    for (const item of contractsArray) {
      if (item.status === CONTRIBUTION_CONTRACT_STATUS.OpenForPublicContrib) {
        openNodes.push(item);
      }
    }
  }
  const ids = openNodes.map((node) => node.service_node_pubkey);

  const data = {
    ids,
    nodes: openNodes,
  };

  cache.set(CACHE_KEY.OPEN_NODES, data, 30_000);

  return data;
}
