import userInfoSlice from "./userInfoSlice";

const changeUserAddr = userInfoSlice.actions.changeUserAddr;

export default function connect() {
  return async (dispatch) => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length === 0) {
      alert(
        "No addresses detected in your wallet. Please try connecting again."
      );
      console.error(
        `connectThunk: "eth_requestAccounts" returns zero-length accounts array`
      );
      return;
    }
    dispatch(changeUserAddr(accounts[0]));
  };
}
