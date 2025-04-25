import { StakeContractAddress } from "../utils/config"
import stakeAbi from '../abis/stake'
import { Pid } from "../utils/config";
import { formatEther, parseEther } from "viem";
import { toast } from "react-toastify";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt,useSimulateContract } from "wagmi"
import { useState, useEffect } from 'react'


export const useStake = (amount: string) => {
	const [isPreparing, setIsPreparing] = useState(false)
	const { data:config, error, isFetching } = useSimulateContract({
	  address: StakeContractAddress,
	  abi: stakeAbi,
	  functionName: 'depositETH',
	  args: [],
	  value: parseEther(amount || '0'),
	  query: {
		enabled: isPreparing,
		retry: false // 禁止自动重试
	  }
	})
  
	const { writeContractAsync, isPending } = useWriteContract()
  
	const stake = async () => {
	  setIsPreparing(true)
	}
  
	useEffect(() => {
	  if (!config?.request || isPending) return
	  
	  writeContractAsync(config.request)
		.finally(() => setIsPreparing(false))
	}, [config])
  
	return {
	  stake,
	  isLoading: isFetching || isPending,
	  error
	}
  }