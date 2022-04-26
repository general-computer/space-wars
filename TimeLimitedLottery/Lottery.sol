// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./SecureBank.sol";

// A Lottery that take a small amount of fund and deposit into an account randomly

contract Lottery is SecureBank {
    constructor() payable public {}

    // set a max. bet amount to prevent player's depleting the pool quickly
    uint maxBetAmount = 10000 wei;

    // This is intended to only allow derived Lottery's to run it
    function placeBet(uint _betAmount) internal returns(string memory){
        // Can't place a bet more than the maxBetAmount
        require (_betAmount <= maxBetAmount, "Bet amount exceeded the max. allowed limit. Try a smaller bet.");
        // Can't place a bet if not enough fund in its account
        require( _accounts[msg.sender] >= _betAmount, "Not enough fund in your account!");

        // Deduct the bet amount from its account
        _accountDebit(_betAmount);

        // Lottery process
        // *Trying* to use an updated block.timestamp to ensure randomness (this is never really secure though)
        bytes32 rand = keccak256(abi.encodePacked(uint24(msg.sender) + block.timestamp));
        // Decide winning or not by simply testing odd or even:
        if (uint(rand) % 2 == 1) {
            // Reward is double the _betAmount so the (statistical) expected change of the bank's pool == 0
            _accountCredit(_betAmount * 2);
            return "Won!";
        }
        else return "Lost...";
    }
}
