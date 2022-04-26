// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Lottery.sol";
import "./Ownable.sol";

// A lottery that does not allow placing bet consecutively until a certain period of time.
contract TimeLimitedLottery is Lottery {
    constructor() payable public {}

    // To keep track of the list of addresses that have placed a bet
    address[] addrList;

    /* 
     * Time-limited bets 
    */
    // Storing the time when the address last placed a bet
    mapping (address => uint) addrLastBetTime;
    // The "cool-down" period before the next bet can be placed
    uint timeLimit = 30 seconds;
    // A helper function to check if an address is ready to bet
    function isReadytoBet(address _addr) internal view returns(bool) {
        return (block.timestamp >= addrLastBetTime[_addr] + timeLimit);
    }
    // the main function to place a bet
    function placeTimeLimitedBet(uint _betAmount) public {
        require( isReadytoBet(msg.sender), "Wait for a while after your last bet!");
        placeBet(_betAmount);
        // Update the array: push into the list of addresses (if address never placed a bet)
        if (addrLastBetTime[msg.sender] == 0) {
            addrList.push(msg.sender);
        }
        // Update the the last bet time for this address
        addrLastBetTime[msg.sender] = now;
    }

    /*
     * View the addresses that are not ready for betting; returns an array and the number of items returned
    */
    // !!! This can only be called by the contract creator
    function ownerCheckUnreadyAddr() onlyOwner public view returns(address[] memory, uint){
        address[] memory unreadyAddresses = new address[](addrList.length);

        uint counter = 0;
        for (uint i = 0; i < addrList.length; i++) {
            address loopedAddr = addrList[i];
            if (!isReadytoBet(loopedAddr)) {
              unreadyAddresses[counter] = loopedAddr;
              counter++;
            } 
        }
        return (unreadyAddresses, counter);
    }
}