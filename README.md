# Solidity Game - Gatekeeper Attack

_Inspired by OpenZeppelin's [Ethernaut](https://ethernaut.openzeppelin.com), Gatekeeper Two Level_

⚠️Do not try on mainnet!

## Task

This gatekeeper introduces a few new challenges. Register as an entrant to pass this game.

_Hint:_

1. Remember what you've learned from getting past the [first gatekeeper](https://github.com/maAPPsDEV/gatekeeper-attack-one) - the first gate is the same.
2. The `assembly` keyword in the second gate allows a contract to access functionality that is not native to vanilla Solidity. See [here](http://solidity.readthedocs.io/en/v0.4.23/assembly.html) for more information. The `extcodesize` call in this gate will get the size of a contract's code at a given address - you can learn more about how and when this is set in section 7 of the [yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf).
3. The `^` character in the third gate is a bitwise operation (XOR), and is used here to apply another common bitwise operation (see [here](http://solidity.readthedocs.io/en/v0.4.23/miscellaneous.html#cheatsheet)). The Coin Flip level is also a good place to start when approaching this challenge.

## What will you learn?

1. `CODESIZE` vs `EXTCODESIZE`
2. Bitwise Operations

## What is the most difficult challenge?

### Deep dive into "contract creation"

The yellow paper formally denotes contract creation as:

![gate1](https://user-images.githubusercontent.com/78368735/124302281-ff1cfb00-db2e-11eb-97f6-4d8bdd004d5c.png)

**Here’s a simplified flow of how contracts are created and what these variables mean:**

1. First, a transaction to create a contract is sent to the Ethereum network. This transaction contains input variables, notably:

- **Sender (s)**: this is the address of the immediate contract or external wallet that wants to create a new contract.
- **Original transactor (o)**: this is the original external wallet (a user) who created the contract. Notice that `o != s` if the user used a factory contract to create more contracts!
- **Available gas (g)**: this is the user specified, total gas allocated for contract creation.
- **Gas price (p)**: this is the market rate for a unit of gas, which converts the transaction cost into Ethers.
- **Endowment (v)**: this is the `value` (in Wei) that’s being transferred to seed this new contract. The default value is zero.
- **Initialization EVM code (i)**: this is everything inside your new contract’s `constructor` function and the initialization variables, in bytecode format.

2. Second, based on just the transaction’s input data, the new contract’s designated address is (pre)calculated. At this stage, the input state values are modified, but the new contract’s state is still empty.
3. Third, the initialization code kickstarts in the EVM and creates an actual contract.
4. During the process, state variables are changed, data is stored, and gas is consumed and deducted.
5. Once the contract finishes initializing, it stores its own code in association with its (pre)calculated address.
6. Finally, the remaining gas and a success/failure message is asynchronously returned to the sender `s`.

> **Hint**: Notice that up until step 5, no code previously existed at the new contract’s address!

In the footnote of the yellow paper:

> During initialization code execution, EXTCODESIZE on the address should return zero, which is the length of the code of the account while CODESIZE should return the length of the initialization code (as defined in H.2)

**Put simply**, if you try to check for a smart contract’s code size before or during contract construction, you will get an empty value. This is because the smart contract hasn’t been made yet, and thus cannot be self cognizant of its own code size.

### Bitwise Operations

Solidity supports the following logic gate operations:

- `&`: and(x, y) **bitwise** and of x and y; where `1010 & 1111 == 1010`
- `|`: or(x, y) **bitwise** or of x and y; where `1010 | 1111 == 1111`
- `^`: xor(x, y) **bitwise** xor of x and y; where `1010 ^ 1111 == 0101`
- `~`: not(x) **bitwise** not of x; where `~1010 == 0101`

**Notice**

- If `A xor B = C`, then `A xor C = B`
- In Solidity, exponentiation is handled by `**`, not `^`

## Source Code

⚠️This contract contains a bug or risk. Do not use on mainnet!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.6.5 <0.9.0;

contract GatekeeperTwo {
  address public entrant;

  modifier gateOne() {
    require(msg.sender != tx.origin);
    _;
  }

  modifier gateTwo() {
    uint256 x;
    assembly {
      x := extcodesize(caller())
    }
    require(x == 0);
    _;
  }

  modifier gateThree(bytes8 _gateKey) {
    require(uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == uint64(0) - 1);
    _;
  }

  function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
    entrant = tx.origin;
    return true;
  }
}

```

## Configuration

### Install Truffle cli

_Skip if you have already installed._

```
npm install -g truffle
```

### Install Dependencies

```
yarn install
```

## Test and Attack!💥

### Run Tests

```
truffle develop
test
```

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: Hacker
    √ should enter (470ms)


  1 passing (559ms)

```
