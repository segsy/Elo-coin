import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useWalletConnector, setNet } from "./WalletConnector.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { EthereumLogo, BinanceLogo } from "../ui/NetworkLogos";
import { MetamaskLogo, WalletConnectLogo } from "../ui/WalletLogos";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import DoneIcon from "@mui/icons-material/Done";
import { green } from "@mui/material/colors";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const networks = [
  { label: "Ethereum", value: "eth", icon: <EthereumLogo width={60} /> },
  { label: "Binance", value: "bsc", icon: <BinanceLogo width={60} /> },
  {
    label: "Binance Testnet",
    value: "bsc_testnet",
    icon: <BinanceLogo width={60} />,
  },
];

const wallets = [
  { label: "Metamask", value: "injected", icon: <MetamaskLogo width={60} /> },
  {
    label: "Wallet Connect",
    value: "walletconnect",
    icon: <WalletConnectLogo width={60} />,
  },
];

const setWalletProvider = (wallet) => {
  localStorage.setItem("wallet", wallet);
};

const NetworkWalletProviders = ({
  walletProvidersDialogOpen,
  handleWalletProvidersDialogToggle,
}) => {
  const { library, account } = useWeb3React();
  const { loginMetamask, loginWalletConnect } = useWalletConnector();
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [error, setError] = useState(null);

  const handleSelectNetwork = (network) => {
    setSelectedNetwork(network);
    setError(null); // Clear error when network is selected
  };

  const handleSelectWallet = (wallet) => {
    setSelectedWallet(wallet);
    setError(null); // Clear error when wallet is selected
  };

  useEffect(() => {
    if (library && account) {
      handleWalletProvidersDialogToggle(); // Close the modal if connected
    }
  }, [library, account, handleWalletProvidersDialogToggle]);

  const handleConnectWallet = async () => {
    if (!selectedWallet || !selectedNetwork) {
      setError("Please select a network and wallet.");
      return;
    }

    const walletprovider = `${selectedWallet}_${selectedNetwork}`;
    try {
      await connectWallet(walletprovider);
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
      console.error("Wallet connection error:", err);
    }
  };

  const connectWallet = async (walletprovider) => {
    localStorage.setItem("connected", true);

    switch (walletprovider) {
      case "injected_eth":
        setWalletProvider("injected_eth");
        setNet(0); // 0 for Ethereum
        await loginMetamask("eth");
        break;
      case "walletconnect_eth":
        setWalletProvider("walletconnect_eth");
        setNet(0); // 0 for Ethereum
        await loginWalletConnect("eth");
        break;
      case "injected_bsc":
        setWalletProvider("injected_bsc");
        setNet(1); // 1 for Binance Smart Chain
        await loginMetamask("bsc");
        break;
      case "walletconnect_bsc":
        setWalletProvider("walletconnect_bsc");
        setNet(1); // 1 for Binance Smart Chain
        await loginWalletConnect("bsc");
        break;
      case "injected_bsc_testnet":
        setWalletProvider("injected_bsc_testnet");
        setNet(1); // 1 for Binance Smart Chain
        await loginMetamask("bsc_testnet");
        break;
      case "walletconnect_bsc_testnet":
        setWalletProvider("walletconnect_bsc_testnet");
        setNet(1); // 1 for Binance Smart Chain
        await loginWalletConnect("bsc_testnet");
        break;
      default:
        throw new Error("Invalid wallet provider or network.");
    }
  };

  useEffect(() => {
    const savedWallet = localStorage.getItem("wallet");
    if (localStorage.getItem("connected") && savedWallet) {
      connectWallet(savedWallet).catch((err) => {
        console.error("Auto-connect error:", err);
        localStorage.removeItem("connected");
        localStorage.removeItem("wallet");
      });
    }
  }, []);

  return (
    <Dialog
      open={walletProvidersDialogOpen}
      onClose={handleWalletProvidersDialogToggle}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      BackdropProps={{
        style: {
          backgroundColor: "rgba(111, 126, 140, 0.2)",
          backdropFilter: "blur(2px)",
        },
      }}
      PaperProps={{
        style: { borderRadius: 25, boxShadow: "none" },
      }}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="alert-dialog-title" sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Connect Wallet
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={handleWalletProvidersDialogToggle}
              aria-label="close"
              sx={{ bgcolor: "grey.100" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar sx={{ width: 24, height: 24, fontSize: "0.9rem" }}>1</Avatar>
          <Typography sx={{ fontWeight: 500 }}>Choose Network</Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={5}
          alignItems="center"
          mb={4}
          justifyContent="space-evenly"
        >
          {networks.map((network) => (
            <Stack
              component={Button}
              color="inherit"
              spacing={1}
              key={network.value}
              onClick={() => handleSelectNetwork(network.value)}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  selectedNetwork === network.value ? (
                    <SmallAvatar sx={{ bgcolor: green[500] }}>
                      <DoneIcon sx={{ fontSize: 15 }} color="inherit" />
                    </SmallAvatar>
                  ) : null
                }
              >
                <Avatar sx={{ width: 60, height: 60 }}>{network.icon}</Avatar>
              </Badge>
              <Typography
                variant="caption"
                display="block"
                sx={{ fontWeight: 500 }}
              >
                {network.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar sx={{ width: 24, height: 24, fontSize: "0.9rem" }}>2</Avatar>
          <Typography sx={{ fontWeight: 500 }}>Choose Wallet</Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          justifyContent="space-evenly"
        >
          {wallets.map((wallet) => (
            <Stack
              component={Button}
              color="inherit"
              spacing={1}
              key={wallet.value}
              onClick={() => handleSelectWallet(wallet.value)}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  selectedWallet === wallet.value ? (
                    <SmallAvatar sx={{ bgcolor: green[500] }}>
                      <DoneIcon sx={{ fontSize: 15 }} color="inherit" />
                    </SmallAvatar>
                  ) : null
                }
              >
                <Avatar sx={{ width: 60, height: 60 }}>{wallet.icon}</Avatar>
              </Badge>
              <Typography
                variant="caption"
                display="block"
                sx={{ fontWeight: 500 }}
              >
                {wallet.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          onClick={handleConnectWallet}
          disabled={!selectedNetwork || !selectedWallet}
        >
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NetworkWalletProviders;
