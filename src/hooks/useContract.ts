import { useMemo } from 'react';
import {
    Abi, Address, PublicClient,
    Chain,
    WalletClient,
    GetContractReturnType
} from 'viem';
import { useChainId, useWalletClient } from 'wagmi';
import { getContract } from '../utils/contractHelper';
import { StakeContractAddress } from "../utils/config"
import stakeAbi from '../abis/stake'

type UseContractOptions = {
    chainId?: number
}

export const useContract = <TAbi extends Abi>(
    addressOrAddressMap?: Address | { [chainId: number]: Address },
    abi?: TAbi,
    options?: UseContractOptions,
) => {
    const currentChainId = useChainId();
    const chainId = options?.chainId || currentChainId;
    const { data: walletClient } = useWalletClient();
  
    return useMemo(() => {
      console.log(addressOrAddressMap)
      if (!addressOrAddressMap || !abi || !chainId) return null;
      const address =
        typeof addressOrAddressMap === 'string'
          ? addressOrAddressMap
          : addressOrAddressMap[chainId];
      if (!address) return null;
      try {
        return getContract({
          abi,
          address,
          chainId,
          signer: walletClient ?? undefined,
        });
      } catch (error) {
        console.error('Failed to get contract', error);
        return null;
      }
    }, [addressOrAddressMap, abi, options, walletClient]);
};

export const useStakeContract = () => {
    return useContract(StakeContractAddress, stakeAbi as Abi)
  }

