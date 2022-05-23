import gameContractStore from "../../contract/gameContractStore";
import sideMenuSlice from "./sideMenuSlice";

export default function confirmUpgrade({ tokenId, mockRangeIncr }) {
  return async (dispatch, getState) => {
    const contract = gameContractStore.getContract();
    const tx = await contract.upgrade(tokenId, mockRangeIncr);
    await tx.wait(1);

    // **** For testing only
    alert("Ship upgraded!");

    // Go back to info menu
    dispatch(sideMenuSlice.actions.chooseMenuType("info"));
  };
}
