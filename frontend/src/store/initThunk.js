import loadData from "./loadDataThunk";
import walletSlice from "./walletSlice";

export default function init() {
  return async (dispatch) => {
    try {
      const { changeWalletStatus } = walletSlice.actions;

      // Check: the window object must have ethereum injected
      if (!window?.ethereum) {
        alert(
          "Have an Ethereum wallet (like Metamask) installed and enabled in the browser to use this app!"
        );
        dispatch(changeWalletStatus({ addr: "No wallet!" }));
        throw new Error("Spaceship: window.ethereum does not exist");
      }
      // Listen to account changes in wallet
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts[0] !== undefined) {
          dispatch(changeWalletStatus({ addr: accounts[0] }));
        } else {
          dispatch(changeWalletStatus({ addr: "" }));
        }
      });

      dispatch(loadData());
    } catch (error) {
      console.error(error.message);
    }
  };
}
