import loadData from "./loadDataThunk";
import userInfoSlice from "../userInfo/userInfoSlice";

export default function init() {
  return async (dispatch, getState) => {
    try {
      // Check: the window object must have ethereum injected
      if (!window?.ethereum) {
        alert(
          "Have an Ethereum wallet (like Metamask) installed and enabled in the browser to use this app!"
        );
        dispatch(userInfoSlice.actions.changeUserAddr(""));
        throw new Error(null, { cause: "NO-ETHEREUM" });
      }

      dispatch(loadData());

      // Listen to account changes in the wallet in the future
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts[0] !== undefined) {
          dispatch(userInfoSlice.actions.changeUserAddr(accounts[0]));
        } else {
          dispatch(userInfoSlice.actions.changeUserAddr(""));
        }
      });
    } catch (error) {
      if (error.cause === "NO-ETHEREUM")
        console.error("initThunk: window.ethereum does not exist");
      else throw error;
    }
  };
}
