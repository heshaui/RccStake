import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''
const url = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
export const config = getDefaultConfig({
  appName: 'Rcc Stake',
  projectId,
  chains: [
    sepolia
  ],
  transports: {
    [sepolia.id]: http(url)
  },
  ssr: true,
});

export const defaultChainId: number = sepolia.id;
