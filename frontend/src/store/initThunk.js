import loadData from "./loadDataThunk";
import walletSlice from "./walletSlice";

export default function init() {
  return async (dispatch) => {
    // Listen to account changes in wallet
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts[0] !== undefined) {
        dispatch(walletSlice.actions.changeWalletStatus({ addr: accounts[0] }));
      } else {
        dispatch(walletSlice.actions.changeWalletStatus({ addr: "" }));
      }
    });

    dispatch(loadData());
  };
}
