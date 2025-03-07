import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TokenPools from "../../components/stake/TokenPools";
import StakeSteps from "../../components/stake/StakeSteps";
import HowToStake from "../../components/stake/HowToStake";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import StakingCard from "components/stake/StakingCard";
import Web3 from "web3";

const unstakeTitle = "Unstake $ELO tokens";
const unstakeDescription =
  "Unstake your $ELO tokens from the staking pool. You can unstake any amount up to your total staked balance.";
const claimRewardsTitle = "Claim $ELO Rewards";
const claimRewardsDescription =
  "Claim your earned $ELO rewards from staking. Your rewards will be sent to your wallet.";
const stakingPoolData = [
  { label: "APR", value: "0.000%" },
  { label: "Wallet Balance", value: "0.0 $" },
  { label: "Staked", value: "0.0 $" },
  { label: "Earned", value: "0.0000 $" },
];
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function Stake() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography
          color="text.primary"
          variant="h4"
          sx={{ fontWeight: "bold", mb: 1, color: "primary.main" }}
          component="div"
        >
          Staking
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Stake $ELO to earn more $ELO. You can stake $ELO tokens in the staking
          pools to earn high APR as a return for holding $ELO tokens.
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="Stake" {...a11yProps(0)} />
            <Tab label="Unstake" {...a11yProps(1)} />
            <Tab label="Claim Rewards" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <StakeSteps />
          <HowToStake />
          <TokenPools stakingPoolData={stakingPoolData} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <StakingCard title={unstakeTitle} description={unstakeDescription} />
          <TokenPools stakingPoolData={stakingPoolData} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <StakingCard
            title={claimRewardsTitle}
            description={claimRewardsDescription}
          />
          <TokenPools stakingPoolData={stakingPoolData} />
        </CustomTabPanel>
      </Box>
    </Container>
  );
}
