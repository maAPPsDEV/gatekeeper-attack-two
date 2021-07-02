const Hacker = artifacts.require("Hacker");
const GatekeeperTwo = artifacts.require("GatekeeperTwo");

module.exports = async function (_deployer, _network, _accounts) {
  const [owner, hacker] = _accounts;
  // Use deployer to state migration tasks.
  const targetContract = await GatekeeperTwo.deployed();
  await _deployer.deploy(Hacker, targetContract.address, { from: hacker });
};
