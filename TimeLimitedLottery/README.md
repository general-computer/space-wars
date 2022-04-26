# TimeLimitedLottery

A fair lottery that has a 30 seconds "cool-down" period between each bet.

## Deployment

The `TimeLimitedLottery` contract in `TimeLimitedLottery.sol` has been deployed to **Rinkeby testnet** at `0x893E95e4A02D56Af2B7Bfa4386D9B7F583C1C4B6`. To play with it in Remix:

- Upload all `.sol` files in this folder. Compile `TimeLimitedLottery.sol`.
- Deploy the `TimeLimitedLottery` contract in the **Rinkeby testnet** (choose the "At address" option and type in the address above)

  - **Note:** Every time you deploy the `SecureBank` contract (which the `TimeLimitedLottery` contract inherits), you need to pay **1 gwei** as inital fund to prevent the bank from going bankrupt when too many people win. Just use the deployed address above to save you some testnet ETH!

## Play!

After deployment you can start playing the lottery.

1. Deposit some fund with `playerDepositFund`. You need to put some ETH in the transaction "Value" to do this.
   - There are helper functions `usdToWei` and `WeitoUsd` to check real-time exchange rate on Chainlink's price feed
2. Check your account balance in `playerViewFund`.
3. Place a bet with `placeBet`! You will either earn _double_ of your bet, or lose all of it.
4. To withdraw fund from your account, call `playerWithdrawFund`.
5. If you are a philanthropist, you can also consider `donateToBank` by calling with ETH value. The amount will be stuck with the contract forever and is 100% guranteed not to be used for any good.

## Contract inheritance tree

```
Ownable------>SecureBank--->Lottery--->TimeLimitedLottery
PriceFeed_/
```

## Notes

- `maxBetAmount` in `Lottery.sol` has been limited to 10000 wei for testing purpose
- functions starting with the name `owner` only allows access to the _contract owner_ (== the contract creator in this case)
- The `Ownable` contract is not the one with full functionality (like transferring ownership) as in OpenZeppelin

## Knwon flaws

- The random number generation is based on `block.timestamp` and is not trully secure. Maybe use Chainlink VRF in the future!
