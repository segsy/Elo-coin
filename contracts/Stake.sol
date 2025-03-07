// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// ERC-20 Interface
interface IERC20 {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);
}

contract Stake {
    IERC20 public token;
    uint256 public rewardRate;
    uint256 public apr;
    uint256 public constant SECONDS_IN_YEAR = 31536000; // 365 * 24 * 60 * 60
    // Creating a data structure for each user's staked balance
    struct StakingDetails {
        uint256 stakedBalance;
        uint256 stakingStartTime;
        uint256 rewardsEarned;
        uint256 lastRewardCalculationTime;
    }

    mapping(address => StakingDetails) public stakers;

    // Creating events to send the updates to frontend
    event Staked(address indexed user, uint256 _rewardRate);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsClaimed(address indexed user, uint256 rewards);

    // Constructor to initialize the token contract address and reward rate
    constructor() {
        token = IERC20(msg.sender);
        StakingDetails storage user = stakers[msg.sender];
        rewardRate = (user.stakedBalance * apr / 10000) / SECONDS_IN_YEAR;
    }

    function updateRewardRate() external {
        StakingDetails storage user = stakers[msg.sender];
        require(user.stakedBalance > 0, "No tokens staked");
        rewardRate = (user.stakedBalance * apr / 10000) / SECONDS_IN_YEAR;
    }

    // To accept token deposits
    function stake(uint256 amount) external {
        // To check if the user's amount is greater than 0 to deposit
        require(amount > 0, "Amount must be greater than 0");

        // Transfer token from the user to the contract
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        // Update the user's staking details
        StakingDetails storage user = stakers[msg.sender];
        user.stakedBalance += amount;
        user.stakingStartTime = block.timestamp;
        user.lastRewardCalculationTime = block.timestamp;

        emit Staked(msg.sender, amount);
    }

    // To calculate user staking rewards
    function calculateRewards(
        address userAddress
    ) public view returns (uint256) {
        StakingDetails storage user = stakers[userAddress];
        uint256 timeElapsed = block.timestamp - user.lastRewardCalculationTime;
        uint256 rewards = (user.stakedBalance * rewardRate * timeElapsed) /
            1e18;
        return rewards;
    }

    function unstake() external {
        StakingDetails storage user = stakers[msg.sender];
        require(user.stakedBalance > 0, "No tokens staked");

        // Calculate rewards
        uint256 rewards = calculateRewards(msg.sender);
        user.rewardsEarned += rewards;

        // Transfer staked tokens and rewards to the user
        token.transfer(msg.sender, user.stakedBalance + user.rewardsEarned);

        user.stakedBalance = 0;
        user.rewardsEarned = 0;
        user.stakingStartTime = 0;
        user.lastRewardCalculationTime = 0;

        emit Unstaked(msg.sender, user.stakedBalance, rewards);
    }

    // To claim rewards without unstake
    function claimRewards() external {
        StakingDetails storage user = stakers[msg.sender];
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");

        user.rewardsEarned += rewards;
        user.lastRewardCalculationTime = block.timestamp;

        bool success = token.transfer(msg.sender, rewards);
        require(success, "Token transfer failed");

        emit RewardsClaimed(msg.sender, rewards);
    }
}
