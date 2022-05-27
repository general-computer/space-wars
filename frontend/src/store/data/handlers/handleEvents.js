import loadFullState from "../scripts/loadFullState";
import handleEventsStore from "./handleEventsStore";
import store from "../../mainStore";
import dataSlice from "../dataSlice";

const handleEvents = (function () {
  async function on(eventObj) {
    const getStateBlockNum = handleEventsStore.getStateBlockNum();
    // Filter blockNum
    if (eventObj.blockNumber <= getStateBlockNum) {
      console.log(
        `Event captured but from block ${eventObj.blockNumber}, ignored`
      );
      return;
    }
    console.log(eventObj);

    const eventName = eventObj?.event;
    const args = eventObj?.args;
    try {
      switch (eventName) {
        case "UnitMoved":
          const { tokenId, x, y } = args;
          store.dispatch(
            dataSlice.actions.mapEvent({
              actionType: "move",
              tokenId: +tokenId,
              x: +x,
              y: +y,
            })
          );
          break;
        default:
          throw new Error(
            `handleEvents: unrecognised Solidity event ${eventName}`
          );
      }
    } catch (error) {
      console.error(error.message);
      console.warn("Event mapping unsucessful, loading full state again...");
      await loadFullState();
    }

    // TODO: Filter event names (including those without names)
    // !!! TODO: do NOT use getState again here (inside loadFullState)
  }

  return {
    on,
  };
})();

export default handleEvents;
