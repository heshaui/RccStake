import { Box, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useAccount, useBalance, useWalletClient } from 'wagmi'
const Home = () => {
    const [amount, setAmount] = useState('0')
    const [stakeAmount, setStakeAmount] = useState('0')
    const [loading, setLoading] = useState(false)
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({
        address,
    });
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
                <Box sx={{fontSize: '20px', color: '#333', lineHeight: '30px'}}>
                    Staked Amount: {stakeAmount} ETH
                </Box>
                <TextField label="Amount" variant="outlined" onChange={e => setAmount(e.target.value)} />
                <Button sx={{display: 'inline-block', mt: '20px'}} variant="contained">Stake</Button>
            </Box>
        </Box>
    )
}

export default Home;