import config from "../../contract/config";
import gameContractStore from "../../contract/gameContractStore";
import sideMenuSlice from "./sideMenuSlice";

const successMsgs = {
  move: "1 move completed!",
  upgrade: "Impulse horizon expanded!",
  giveAP: "Dark matter tranfer sucessful!",
  attack: "Destabilized!",
};

export default function confirmAction(type, payload) {
  return async (dispatch, getState) => {
    try {
      const contract = gameContractStore.getContract();

      let tx;
      switch (type) {
        case "move":
          tx = await contract.move(
            // unit
            payload.tokenId,
            // x
            payload.translatedX,
            // y
            payload.translatedY,
            // tax
            {value: gameContractStore.getBaseFee()}
          );
          break;
        case "upgrade":
          tx = await contract.upgrade(payload.tokenId, payload.mockRangeIncr, {value: gameContractStore.getBaseFee()});
          break;
        case "giveAP":
          tx = await contract.givePoints(
            payload.from,
            payload.to,
            payload.amount,
            // tax
            {value: gameContractStore.getBaseFee()}
          );
          break;
        case "attack":
          tx = await contract.shoot(
            payload.attId,
            payload.victId,
            payload.damage,
            // tax
            {value: gameContractStore.getBaseFee()}
          );
          break;
        default:
          throw new Error("confirmActionThunk: unrecognised action type");
      }

      await tx.wait(config.BLOCK_CONFIRMATIONS);

      // Success message
      alert(successMsgs[type]);

      // Go back to info menu
      dispatch(sideMenuSlice.actions.chooseMenuType("info"));
    } catch (err) {
      alert("Your transaction was unsuccessful ... please try again.");
      throw err;
    }
  };
}
