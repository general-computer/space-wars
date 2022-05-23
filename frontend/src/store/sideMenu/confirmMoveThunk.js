import gameContractStore from "../../contract/gameContractStore";

export default function confirmMove({ tokenId, translatedX, translatedY }) {
  return async (dispatch, getState) => {
    const contract = gameContractStore.getContract();
    const tx = await contract.move(
      // unit
      tokenId,
      // x
      translatedX,
      // y
      translatedY
    );
    await tx.wait(1);

    // **** For testing only
    alert("1 move completed!");
  };
}
