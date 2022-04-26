// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

// Get ETH/USD exchange rate from Chainlink Rinkeby price feed
// !!! Deploy this contract to Rinkeby to test!

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract PriceFeed {
    // Choose the ETH/USD address on Rinkeby
    AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);

    // Returns the price in USD/(10^18 ETH)
    function getPrice() internal view returns(uint) {
        (
            /* uint80 roundId */,
            int256 answer,
            /* uint256 startedAt */,
            /* uint256 updatedAt */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData() ;

        // Return in USD/(10^18 ETH); Remember the "answer" above may be either 10 ** 8 or 18 so need to convert:
        return uint256(answer) * (10 ** (18 - uint256(priceFeed.decimals())));
    }
}