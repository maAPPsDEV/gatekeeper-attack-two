const GatekeeperTwo = artifacts.require("GatekeeperTwo");

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(GatekeeperTwo);
};
