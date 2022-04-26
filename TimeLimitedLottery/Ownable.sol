// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/* For access control: only allow certain functions to be accessed by contract owner */
contract Ownable {
    address private _owner;
    // Store owner's address on construction; this will be inherited as well if its descedent does not define its own constructor
    constructor() internal {
        _owner = msg.sender;
    }

    // modifier for limiting access to owner only
    modifier onlyOwner() {
        require(msg.sender == _owner, "Access denied: only the contract's owner have access to this function");
        _;
    }
}