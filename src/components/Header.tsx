import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box } from "@mui/material";

function Header() {
    return (
        <div className="flex">
            <div>RCC Stake</div>
            <div></div>
            <ConnectButton />
        </div>
    )
}

export default Header;