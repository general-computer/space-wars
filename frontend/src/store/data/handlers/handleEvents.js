import loadFullState from "../scripts/loadFullState";
import handleEventsStore from "./handleEventsStore";
import store from "../../mainStore";
import dataSlice from "../dataSlice";

const handleEvents = (function () {
  async function on(eventObj) {
    try {
      const getStateBlockNum = handleEventsStore.getStateBlockNum();
      // Filter blockNum, ignore any blocks on/before getState() was called to prevent replaying events
      if (eventObj.blockNumber <= getStateBlockNum) {
        console.log(
          `Event captured but from block ${eventObj.blockNumber}, ignored`
        );
        return;
      }

      console.log(eventObj);
      const eventName =
        eventObj?.event ??
        (() => {
          throw new Error(
            `handleEvents.on: "eventName" undefined for the event`
          );
        })();
      const args =
        eventObj?.args ??
        (() => {
          throw new Error(`handleEvents.on: "args" undefined for the event`);
        })();
      switch (eventName) {
        case "UnitMoved":
          (() => {
            const { tokenId, x, y } = args;
            store.dispatch(
              dataSlice.actions.mapEvent({
                actionType: "move",
                tokenId: +tokenId,
                x: +x,
                y: +y,
              })
            );
          })();
          break;
        case "UnitUpgraded":
          (() => {
            const { tokenId, level } = args;
            store.dispatch(
              dataSlice.actions.mapEvent({
                actionType: "upgrade",
                tokenId: +tokenId,
                level: +level,
              })
            );
          })();
          break;
        case "UnitGavePoints":
          (() => {
            const { fromTokenId, toTokenId, amount } = args;
            store.dispatch(
              dataSlice.actions.mapEvent({
                actionType: "giveAP",
                fromTokenId: +fromTokenId,
                toTokenId: +toTokenId,
                amount: +amount,
              })
            );
          })();
          break;
        case "UnitShot":
          (() => {
            const { attId, victId, damage } = args;
            store.dispatch(
              dataSlice.actions.mapEvent({
                actionType: "shoot",
                attId: +attId,
                victId: +victId,
                damage: +damage,
              })
            );
          })();
          break;
        default:
          throw new Error(
            `handleEvents.on: unrecognised Solidity event ${eventName}`
          );
      }
    } catch (error) {
      console.error(error.message);
      console.warn("Event mapping unsucessful, loading full state again...");
      await loadFullState();
    }
  }

  return {
    on,
  };
})();

export default handleEvents;
