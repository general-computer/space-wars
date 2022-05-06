import walletSlice from "../walletSlice";

export default function userAction({ type }) {
  return async (dispatch) => {
    switch (type) {
      case "CONNECT":
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        dispatch(
          walletSlice.actions.changeWalletStatus({
            addr: accounts[0],
          })
        );
        break;
      default:
        throw new Error(`userAction(): unknown action type`);
    }
  };
}
