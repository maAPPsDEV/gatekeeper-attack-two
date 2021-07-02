const Hacker = artifacts.require("Hacker");
const GatekeeperTwo = artifacts.require("GatekeeperTwo");
const { expect } = require("chai");
const { BN } = require("@openzeppelin/test-helpers");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Hacker", function ([_owner, _hacker]) {
  it("should enter", async function () {
    const targetContract = await GatekeeperTwo.new();
    const hackerContract = await Hacker.new(targetContract.address, { from: _hacker });
    expect(await targetContract.entrant()).to.be.equal(_hacker);
  });
});
