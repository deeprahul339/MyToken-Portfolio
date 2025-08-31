import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Box } from "@mui/material";

import walletIcon from "../assets/svg/wallet-icon.svg";

import AppButton from "../components/common/AppButton";

export default function WalletSection() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openAccountModal,
        openChainModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Wallet connect button */}
            <AppButton
              label={
                !connected
                  ? "Connect Wallet"
                  : chain.unsupported
                  ? "Wrong Network"
                  : account.displayName
              }
              icon={walletIcon}
              bgColor="#A9E851"
              textColor="black"
              onClick={
                !connected
                  ? openConnectModal
                  : chain.unsupported
                  ? openChainModal
                  : openAccountModal
              }
            />
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
}
