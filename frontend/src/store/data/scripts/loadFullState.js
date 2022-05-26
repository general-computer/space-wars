import store from "../../mainStore";
import dataSlice from "../dataSlice";
import gameContractStore from "../../../contract/gameContractStore";
import { processGameState } from "../utils/processGameState";
import handleEventStore from "../handlers/handleEventsStore";
import handleNewBlock from "../handlers/handleNewBlock";
import loadFakeData from "../loadFakeDataThunk";

export default async function loadFullState() {
  /**
   * Load game state
   */
  const gameContract = gameContractStore.getContract();
  // Calling all functions that determines the initial state from a specific block
  // - As contract functions calls below are asynchronous, this is to synchronise the initial state to that of a single block
  const currBlockNum = (await gameContract.provider.getBlock()).number;
  console.log("Loaded state blockNum:", currBlockNum);

  // !!! allow editing the rawGameState later by doing shallow copy
  const rawGameState = {
    ...(await gameContract.getState({
      // !!! Wallet like Metamask will do gas fee estimation but it is both unnecesarry for read-only functions,
      // and will throw for "Transaction run out of gas". So just hard-code it here.
      gasLimit: "999999999999999",
      blockTag: currBlockNum,
    })),
  };
  // Add owner details & playfieldSize to rawGameState
  let tokenIdToOwner = {};
  let playfieldSize;
  const ownerReq = rawGameState.allUnits.map(
    // !!! tokenId HAPPENS to be the same as the indexes in rawGameState.allUnits
    async (unit, tokenId) => {
      let owner;
      try {
        owner = await gameContract.ownerOf(tokenId, {
          blockTag: currBlockNum,
        });
      } catch (err) {
        // Allow a token to have no owner, just give warnings
        console.warn(
          `initThunk: cannot get owner of tokenId ${tokenId}, is it minted and still has an owner?`
        );
        owner = "";
      }
      tokenIdToOwner[tokenId] = owner;
    }
  );
  const playfieldSizeReq = (async () => {
    // playfieldSize = +(await gameContract.getPlayfieldSize());
    // Hard-code it for now
    playfieldSize = 100;
  })();
  await Promise.all([...ownerReq, playfieldSizeReq]);

  rawGameState.tokenIdToOwner = tokenIdToOwner;
  rawGameState.playfieldSize = playfieldSize;

  console.log(`Raw game state:`, rawGameState);

  /**
   * Process Game state
   */
  const processedGameState = processGameState(rawGameState);
  console.log(`Processed game state:`, processedGameState);

  store.dispatch(dataSlice.actions.showData(processedGameState));
  /** Alternatively, use loadFakeData() for faking the data loaded */
  // await dispatch(loadFakeData());

  // Tell handlers that we have the latest state
  handleEventStore.gotStateAt(currBlockNum);
  handleNewBlock.gotStateAt(currBlockNum);
  // And log the gameStartTime
  handleNewBlock.gameStartedAt(processedGameState.gameStartTime);
}
