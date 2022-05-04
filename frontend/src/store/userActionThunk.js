import walletSlice from "./walletSlice";

export default function userAction({ type }) {
  return async (dispatch, getState) => {
    switch (type) {
      case "CONNECT":
        if (window?.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          dispatch(
            walletSlice.actions.changeWalletStatus({
              isConnected: true,
              addr: accounts[0],
            })
          );
        } else alert("Ethereum is not enabled in the browser.");
        break;
      default:
        throw new Error(`userAction(): unknown action type`);
    }
  };
}
