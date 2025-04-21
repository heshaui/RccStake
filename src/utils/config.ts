import { Address, zeroAddress } from 'viem'
import abi from '../abis/stake'

const StakeContractAddress = process.env.NEXT_PUBLIC_STAKE_ADDRESS as Address || zeroAddress;
const StakeAbi = abi;
const Pid = 0;

export {
    StakeContractAddress,
    StakeAbi,
    Pid
}
