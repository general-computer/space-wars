import loadData from "./loadDataThunk";
import userInfoSlice from "../userInfo/userInfoSlice";
import gameContractStore from "../../contract/gameContractStore";

export default function init() {
  return async (dispatch, getState) => {
    try {
      /**
       * Connecting to wallet; no wallet address needed at the moment
       */
      // Check: the window object must have ethereum injected
      if (window?.ethereum === undefined)
        throw new Error("Ethereuem not enabled in browser", {
          cause: "NO-ETHEREUM",
        });
      // Listen to address changes in the wallet in the future
      window.ethereum.on("accountsChanged", async (accounts) => {
        await gameContractStore.init();
        dispatch(userInfoSlice.actions.changeUserAddr(accounts[0] ?? ""));
      });

      /**
       * Connecting to contract (read-only possible if no wallet address available)
       */
      const gameContract = await gameContractStore.init();
      const gameState = await gameContract.getState({
        // !!! Wallet like Metamask will do gas fee estimation but it is both unnecesarry for read-only functions,
        // and will throw for "Transaction run out of gas". So just hard-code it here.
        gasLimit: "999999999999999",
      });
      console.log(`Got state`);
      console.log(gameState);

      /*************** Data is now loaded in the code like above. Change loadData() acoordingly */
      await dispatch(loadData());
    } catch (error) {
      switch (error.cause) {
        case "NO-ETHEREUM":
          alert(
            "Have an Ethereum wallet (like Metamask) installed and enabled in the browser to use this app!"
          );
          console.error("initThunk: window.ethereum does not exist");
          break;
        /* case "NO-ADDRESS":
          alert(`Press "Connect" to connect an Ethereum address to this app.`);
          break; */
        default:
          throw error;
      }
    }
  };
}
