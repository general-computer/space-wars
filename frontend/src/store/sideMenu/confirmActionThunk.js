import config from "../../contract/config";
import gameContractStore from "../../contract/gameContractStore";
import sideMenuSlice from "./sideMenuSlice";

export default function confirmAction(type, payload) {
  return async (dispatch, getState) => {
    const contract = gameContractStore.getContract();

    const successMsgs = {
      move: "1 move completed!",
      upgrade: "Impulse horizon expanded!",
      giveAP: "Dark matter tranfer sucessful!",
      attack: "Destabilized!",
    };

    let tx;
    switch (type) {
      case "move":
        tx = await contract.move(
          // unit
          payload.tokenId,
          // x
          payload.translatedX,
          // y
          payload.translatedY
        );
        break;
      case "upgrade":
        tx = await contract.upgrade(payload.tokenId, payload.mockRangeIncr);
        break;
      case "giveAP":
        tx = await contract.givePoints(
          payload.from,
          payload.to,
          payload.amount
        );
        break;
      case "attack":
        tx = await contract.shoot(
          payload.attId,
          payload.victId,
          payload.damage
        );
        break;
      default:
        throw new Error("confirmActionThunk: unrecognised action type");
    }

    await tx.wait(config.BLOCK_CONFIRMATIONS);

    // **** For testing only
    alert(successMsgs[type]);

    // Go back to info menu
    dispatch(sideMenuSlice.actions.chooseMenuType("info"));
  };
}
