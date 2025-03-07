const Stake = artifacts.require("Stake");

contract("Stake", (accounts) => {
  let stakeInstance;

  before(async () => {
    stakeInstance = await Stake.deployed();
  });

  it("should allow a user to stake tokens", async () => {
    const amount = web3.utils.toWei("1", "ether"); // 1 Token
    await stakeInstance.stakeTokens(amount, { from: accounts[0] });

    const balance = await stakeInstance.stakedBalance(accounts[0]);
    assert.equal(balance.toString(), amount, "Stake balance is incorrect");
  });

  it("should allow a user to withdraw staked tokens", async () => {
    await stakeInstance.withdrawTokens({ from: accounts[0] });

    const balance = await stakeInstance.stakedBalance(accounts[0]);
    assert.equal(balance.toString(), "0", "Stake balance should be 0 after withdrawal");
  });
});