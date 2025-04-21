import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box } from "@mui/material";

function Header() {
    return (
        <Box>
            <div>RCC Stake</div>
            <div></div>
            <ConnectButton />
        </Box>
    )
}

export default Header;