import { Box, Button, TextField, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useStakeContract } from "../../hooks/useContract";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pid } from '../../utils/config';
import { formatEther, parseEther } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWalletClient } from 'wagmi';
import { toast } from "react-toastify";
import { waitForTransactionReceipt } from "viem/actions";

type UserData = {
    stakeAmount: string,
    withdrawAmount: string,
    withdrawPendingAmount: string
}

const initUserData: UserData = {
    stakeAmount: '0',
    withdrawAmount: '0',
    withdrawPendingAmount: '0.0000'
}

const Withdrawal: NextPage = () => {
    const stakeContract = useStakeContract()
    const [amount, setAmount] = useState('')
    const [userData, setUserData] = useState<UserData>(initUserData)
    const [unstakeLoading, setUnstakeLoading] = useState(false)
    const [withdrawLoading, setWithdrawLoading] = useState(false)
    const { address, isConnected } = useAccount()
    const { data: wallet } = useWalletClient()

    // 取币状态
    const isWithdrawable = useMemo(() => {
        return Number(userData.withdrawAmount) > 0 && isConnected
    }, [userData, isConnected])

    // 获取用户信息
    const getUserData = async() => {
        if (!stakeContract || !address) return
        const stake = await stakeContract.read.stakingBalance([Pid, address])
        //@ts-ignore
        const [requestAmount, pendingWithdrawAmount] = await stakeContract.read.withdrawAmount([Pid, address])
        const rA = Number(formatEther(requestAmount)) // 全部金额
        const pA = Number(formatEther(pendingWithdrawAmount)) // 可提取金额
        const dA = (rA - pA).toFixed(4) // 待解锁金额
        setUserData({
            stakeAmount: formatEther(stake as bigint),
            withdrawAmount: pA.toString(),
            withdrawPendingAmount: dA
        })
    }

    // 解质押
    const unstake = async() => {
        if (!stakeContract || !wallet) return
        // if (parseFloat(amount) > parseFloat(userData.withdrawAmount)) {
        //     toast.error('Amount cannot be greater than current balance')
        //     return
        // }
        try {
            setUnstakeLoading(true)
            const tx = await stakeContract.write.unstake([Pid, parseEther(amount)])
            const res = await waitForTransactionReceipt(wallet, { hash: tx })
            setUnstakeLoading(false)
            toast.success('Transaction receipt !')
        } catch(err) {
            setUnstakeLoading(false)
            toast.error('unstake error')
        }
    }

    // 取代币
    const withdraw = async() => {
        if (!stakeContract || !wallet) return
        try {
            setWithdrawLoading(true)
            const tx = await stakeContract.write.withdraw([Pid])
            const res = await waitForTransactionReceipt(wallet, { hash: tx})
            setWithdrawLoading(false)
            toast.success('Transaction receipt !')
        } catch(err) {
            setWithdrawLoading(false)
            toast.error('withdraw error')
        }
    }

    useEffect(() => {
        getUserData()
    }, [stakeContract, address])

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography sx={{fontSize: '30px', lineHeight: '40px', color: '#333', fontWeight: 700}}>Rcc Stake</Typography>
            <Typography>Stake ETH to earn tokens.</Typography>
            <Box 
                sx={{
                    width: '600px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    mt: '15px',
                    p: '20px;'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}
                >
                    <Box sx={{textAlign: 'center'}}>
                        <span>Staked Amount:</span>
                        <h3>{ userData.stakeAmount }ETH</h3>
                    </Box>
                    <Box sx={{textAlign: 'center'}}>
                        <span>Withdraw Amount:</span>
                        <h3>{ userData.withdrawAmount }ETH</h3>
                    </Box>
                    <Box sx={{textAlign: 'center'}}>
                        <span>WithdrawPending Amount:</span>
                        <h3>{ userData.withdrawPendingAmount }ETH</h3>
                    </Box>
                </Box>
                <TextField sx={{width: '300px', mt: '20px'}} label="Amount" variant="outlined" onChange={e => setAmount(e.target.value)} />
                <Box mt='30px'>
                    {
                        !isConnected ? 
                        <ConnectButton /> : 
                        <Button 
                            variant='contained' 
                            loading={unstakeLoading} 
                            onClick={unstake}
                        >
                            UnStake
                        </Button>
                    }
                </Box>
                <Box sx={{ fontSize: '20px', mb: '10px', mt: '40px' }}>Withdraw</Box>
                <Box> Ready Amount: {userData.withdrawAmount} </Box>
                <Typography fontSize={'14px'} color={'#888'}>After unstaking, you need to wait 20 minutes to withdraw.</Typography>
                <Button 
                    variant='contained'
                    disabled={!isWithdrawable}
                    loading={withdrawLoading} 
                    onClick={withdraw}
                >
                    Withdraw
                </Button>
            </Box>
        </Box>
    )
}

export default Withdrawal;