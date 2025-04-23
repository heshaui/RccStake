import { sepolia } from 'viem/chains';
import { PublicClient, createPublicClient, http } from 'viem';

interface clientsType {
	[key: number]: PublicClient
}
const url = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
export const viemClients = (chainId: number) => {
	const clients: clientsType = {
		[sepolia.id] : createPublicClient({
			chain: sepolia,
			transport: http(url)
		})
	}
	return clients[chainId]
}