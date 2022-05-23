import gameContractStore from "../../contract/gameContractStore";
import { moveCheck } from "../../utils/moveCheck";

export default function confirmMove() {
  return async (dispatch, getState) => {
    const state = getState();
    const clickedShipIndex = state.sideMenu.clickedShipIndex;
    const mapLength = state.data.mapLength;
    const shipDataArray = state.data.shipDataArray;
    const { transX, transY } = state.sideMenu.mockMoves;
    // Another safegurard to ensure the move is possible
    const { moves, translatedX, translatedY, isMoveAllowed } = moveCheck({
      shipDataArray,
      clickedShipIndex,
      transX,
      transY,
      mapLength,
    });
    if (isMoveAllowed) {
      alert(`Hmmm you can't make this move ... please try again :(`);
      throw new Error("confirmMove: move not allowed");
    }

    // **** Dispatch single transaction for multiple move steps later!
    if (moves > 1) {
      alert(
        "Need multiple transactions for moves containing more than one step, please be patient:)"
      );
    }
    const contract = gameContractStore.getContract();

    const tx = await contract.move(
      // unit
      shipDataArray[clickedShipIndex].tokenId,
      // x
      translatedX,
      // y
      translatedY
    );
    await tx.wait(1);

    // For testing only
    alert("Move completed!");
  };
}
