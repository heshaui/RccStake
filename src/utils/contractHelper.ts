import { Abi, Address, GetContractReturnType, PublicClient, WalletClient, getContract as viemGetContract } from 'viem';
import { defaultChainId } from './wagmi';
import { viemClients } from "./viem";

type GetContractFn = <
  TAbi extends Abi | readonly unknown[],
  TWalletClient extends WalletClient
>(params: {
  abi: TAbi
  address: Address
  chainId?: number
  signer?: TWalletClient
}) => GetContractReturnType<TAbi, PublicClient, Address> & {
  account: TWalletClient['account'] | undefined
  chain: TWalletClient['chain'] | undefined
}

export const getContract: GetContractFn = ({
	abi,
	address,
	chainId = defaultChainId,
	signer,
}) => {
	const c = viemGetContract({
		abi,
		address,
		client: {
			public: viemClients(chainId),
			wallet: signer
		}
	}) as unknown as GetContractReturnType<typeof abi, PublicClient, Address>

	return {
		...c,
		account: signer?.account,
		chain: signer?.chain
	}

}