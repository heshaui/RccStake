import { Box, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useBalance, useWalletClient } from 'wagmi'
import { useStakeContract } from "../../hooks/useContract";
import { Pid } from "../../utils/config";
import { formatEther, parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { waitForTransactionReceipt } from "viem/actions";
import { useStake } from '../../hooks/useStakeContract'
import { NextPage } from "next";
const Home: NextPage = () => {
    const [amount, setAmount] = useState('0')
    const [stakeAmount, setStakeAmount] = useState('0')
    const [loading, setLoading] = useState(false)
    const { address, isConnected } = useAccount();
    const { data: wallet } = useWalletClient()
    const { data: balance } = useBalance({
        address,
    });

    //处理质押
    const stakeContract = useStakeContract()
    const handleStake = async() => {
        if (!stakeContract || !wallet) return
        console.log('wallet', balance, amount)
        if (parseFloat(amount) > parseFloat(balance!.formatted)) {
            toast.error('Amount cannot be greater than current balance')
            return
        }
        try {
            setLoading(true)
            const tx = await stakeContract.write.depositETH([], parseEther(amount))
            const res = await waitForTransactionReceipt(wallet, {hash: tx})
            toast.success('Transaction receipt !')
            setLoading(false)
            getStakeAmount()
        } catch (err) {
            setLoading(false)
            toast.error('stake error')
        }

    }
    // const { stake: handleStake, isLoading, error } = useStake(amount)

    // useEffect(() => {
    //     if (error) toast.error(error.message)
    // }, [error])
    const getStakeAmount = useCallback(async () => {
        if (stakeContract && address) {
            const amountRes = await stakeContract?.read.stakingBalance([Pid, address])
            setStakeAmount(formatEther(amountRes as bigint))
        }
    }, [stakeContract, address])

    useEffect(() => {
        if (stakeContract && address) getStakeAmount()
    }, [stakeContract, address])
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography sx={{fontSize: '30px', lineHeight: '40px', color: '#333', fontWeight: 700}}>Rcc Stake</Typography>
            <Typography>Stake ETH to earn tokens.</Typography>
            <Box 
                sx={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '5px', 
                    p: '30px', display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'cengter',
                    width: '600px',
                    mt: '30px'
                }}
            >
                <Box sx={{fontSize: '16px', color: '#333', lineHeight: '30px'}}>
                    Staked Amount: {stakeAmount} ETH
                </Box>
                <TextField sx={{width: '300px'}} label="Amount" variant="outlined" onChange={e => setAmount(e.target.value)} />
                <Box mt='30px'>
                    {
                        !isConnected ? 
                        <ConnectButton /> : 
                        <Button 
                            variant='contained' 
                            loading={loading} 
                            onClick={handleStake}
                        >
                            Stake
                        </Button>
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default Home;