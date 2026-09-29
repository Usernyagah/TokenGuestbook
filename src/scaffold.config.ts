// Network is driven by NEXT_PUBLIC_NETWORK env var.
import { StacksTestnet, StacksMainnet, StacksDevnet, type StacksNetwork } from '@stacks/network';

type ScaffoldNetwork = 'devnet' | 'testnet' | 'mainnet';

function resolveNetwork(value: string | undefined): ScaffoldNetwork {
  const network = value ?? 'testnet';
  if (network === 'devnet' || network === 'testnet' || network === 'mainnet') {
    return network;
  }
  return 'testnet';
}

const network = resolveNetwork(process.env.NEXT_PUBLIC_NETWORK);

const nodeUrl =
  network === 'mainnet'
    ? (process.env.NEXT_PUBLIC_STACKS_NODE_URL ?? 'https://api.hiro.so')
    : network === 'testnet'
    ? (process.env.NEXT_PUBLIC_STACKS_NODE_URL ?? 'https://api.testnet.hiro.so')
    : (process.env.NEXT_PUBLIC_STACKS_NODE_URL ?? 'http://localhost:3999');

export const scaffoldConfig = {
  network,
  requestNetwork: network === 'devnet' ? 'testnet' : network,
  targetNetwork: network === 'devnet' ? 'testnet' : network,
  nodeUrl,
  hiroApiKey: process.env.NEXT_PUBLIC_HIRO_API_KEY ?? '',
  explorerBaseUrl: 'https://explorer.hiro.so/txid/',
  explorerChainQuery: network === 'mainnet' ? '?chain=mainnet' : '?chain=testnet',
  isDevnet:  network === 'devnet',
  isTestnet: network === 'testnet',
  isMainnet: network === 'mainnet',
} as const;

export function getReadOnlyNetwork(): StacksNetwork {
  if (scaffoldConfig.isMainnet) {
    return new StacksMainnet({ url: scaffoldConfig.nodeUrl });
  }
  if (scaffoldConfig.isDevnet) {
    return new StacksDevnet({ url: scaffoldConfig.nodeUrl });
  }
  return new StacksTestnet({ url: scaffoldConfig.nodeUrl });
}
