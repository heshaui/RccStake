import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box, Typography } from "@mui/material";
import Link from "next/link"
import { usePathname } from "next/navigation"
const Header = () => {
    const links = [
        {path: '/', name: 'Stake'},
        {path: '/Withdrawal', name: 'Withdrawal'}
    ]
    const pathname = usePathname()
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                px: '20px'
            }}
        >
            <h3>RCC Stake</h3>
            <Box display="flex" alignItems="center">
                {
                    links.map(link => {
                        const active = (pathname === link.path || pathname === link.path + '/');
                        return (
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    color: active ? '#333' : '#333',
                                    fontWeight: active ? 700 : 500,
                                    mx: '20px'
                                }}
                            >
                                <Link href={link.path}>{link.name}</Link>
                            </Typography>
                        )
                    })
                }
                <ConnectButton />
            </Box>
        </Box>
    )
}

export default Header;