import loadFakeData from "./loadFakeDataThunk";
import dataSlice from "./dataSlice";
import userInfoSlice from "../userInfo/userInfoSlice";
import gameContractStore from "../../contract/gameContractStore";
import { processGameState } from "./processGameState";

const chainNames = {
  "0x1": "the Mainnet",
  "0x4": "Rinkeby Testnet",
  "0x7a69": "Hardhat Network",
};

const targetChain = "0x7a69"; // Hardhat

export default function init() {
  return async (dispatch, getState) => {
    /**
     * Connecting to wallet; no wallet address needed at the moment
     */
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
    if (chainId !== targetChain) {
      alert(
        `You are now on ${
          chainNames[chainId] || "a network with an unrecognised chain ID"
        }. Switch to ${chainNames[targetChain]} in your wallet to use the app.`
      );
      throw new Error("initThunk: incorrect chain ID");
    }

    /**
     * Connecting to contract (read-only possible if no wallet address available)
     */
    const gameContract = await gameContractStore.init();

    /**
     * Load game state
     */
    // !!! allow editing the rawGameState later by doing shallow copy
    const rawGameState = {
      ...(await gameContract.getState({
        // !!! Wallet like Metamask will do gas fee estimation but it is both unnecesarry for read-only functions,
        // and will throw for "Transaction run out of gas". So just hard-code it here.
        gasLimit: "999999999999999",
      })),
    };
    // Add owner details & playfieldSize to rawGameState
    let tokenIdToOwner = {};
    const ownerReq = rawGameState.allUnits.map(
      // !!! tokenId HAPPENS to be the same as the indexes in rawGameState.allUnits
      async (unit, tokenId) => {
        let owner;
        try {
          owner = await gameContract.ownerOf(tokenId);
        } catch (err) {
          // Allow a token to have no owner
          console.warn(
            `initThunk: cannot get owner of tokenId ${tokenId}, is it minted and still has an owner?`
          );
          owner = "";
        }
        tokenIdToOwner[tokenId] = owner;
      }
    );
    await Promise.allSettled(ownerReq);
    const playfieldSize = await gameContract.getPlayfieldSize();
    rawGameState.tokenIdToOwner = tokenIdToOwner;
    rawGameState.playfieldSize = playfieldSize;

    console.log(`Raw game state:`, rawGameState);

    /**
     * Process Game state
     */
    const processedGameState = processGameState(rawGameState);
    console.log(`Processed game state:`, processedGameState);

    /** Alternatively, use loadFakeData() for faking the data loaded */
    dispatch(dataSlice.actions.showData(processedGameState));
    // await dispatch(loadFakeData());

    // Listen to address changes in the wallet in the future
    window.ethereum.on("accountsChanged", async (accounts) => {
      await gameContractStore.init();
      dispatch(userInfoSlice.actions.changeUserAddr(accounts[0] ?? ""));
    });
  };
  // ****** (Only on disconnection) Check: the provider is connected
  /* console.log(window.ethereum.isConnected());
  if (!window.ethereum.isConnected()) {
    alert(
      `Your wallet is disconnected from the chain. Re-connect to reload the page.`
    );
    throw new Error("initThunk: ethereum.isConnected() returns false");
  } */
}
