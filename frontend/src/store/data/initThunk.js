import userInfoSlice from "../userInfo/userInfoSlice";
import gameContractStore from "../../contract/gameContractStore";
import loadFullState from "./scripts/loadFullState";

import handleEvents from "./handlers/handleEvents";
import handleNewBlock from "./handlers/handleNewBlock";
import config, { chainNames } from "../../contract/config";

export default function init() {
  return async (dispatch, getState) => {
    const { TARGET_CHAIN } = config;
    /********************************************************
     * Connecting to wallet; no wallet address needed at the moment
     *********************************************************/
    // Check: the window object must have ethereum injected
    if (window?.ethereum === undefined) {
      alert(
        "Have an Ethereum wallet (like Metamask) installed and enabled in the browser to use this app!"
      );
      throw new Error("initThunk: window.ethereum does not exist");
    }
    // Check: the chain ID is correct. Note: this is a HEX string
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    console.log(`Chain ID: ${chainId}`);
    if (chainId !== TARGET_CHAIN) {
      alert(
        `You are now on ${
          chainNames[chainId] || "a network with an unrecognised chain ID"
        }. Switch to ${chainNames[TARGET_CHAIN]} in your wallet to use the app.`
      );
      throw new Error("initThunk: incorrect chain ID");
    }

    /********************************************************
     * Connecting to contract (read-only possible if no wallet address available)
     *******************************************************/
    const gameContract = await gameContractStore.init();

    /***************************
     * Load game state
     **************************/

    await loadFullState();

    /*********************************************************
     * Set up event listeners
     *********************************************************/
    /**
     * Listen to address changes in the wallet
     */
    window.ethereum.on("accountsChanged", async (accounts) => {
      await gameContractStore.init();
      dispatch(userInfoSlice.actions.changeUserAddr(accounts[0] ?? ""));
    });
    /**
     * Listen to new blocks
     */
    // *** TODO: May add some new UI changes when a new block/events arrive
    gameContract.provider.on("block", handleNewBlock.on);
    /**
     * Listen to all contract events
     * - !!!! ethers.js + Hardhat Network has a weird behaviour that on initial listener set up, ...
     * ... it will query the events from the latest block + the last block as well
     *    - So, remember to put a filter in the callback for blockNum
     *    - This behaviour may be useful though , as it let us check for events missed out between our initial call and setting up the event listeners
     * - You may also want to use contract.queryFilter as a safe check
     */
    gameContract.on(
      // If use a string eventName here (the event specified in the ABI), ...
      // ... then the callback will receive all the params specified in the ABI + the event object
      // If using "*" to match any events, only the event object will be passed
      // - filter specifications: https://docs.ethers.io/v5/api/providers/types/#providers-Filter
      "*",
      (event) => {
        handleEvents.on(event);
      }
    );

    /******
     * TODO: Check: the provider is connected
     */
    // console.log(window.ethereum.isConnected());
    // if (!window.ethereum.isConnected()) {
    //   alert(
    //     `Your wallet is disconnected from the chain. Re-connect to reload the page.`
    //   );
    //   throw new Error("initThunk: ethereum.isConnected() returns false");
    // }
  };
}
