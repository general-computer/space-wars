import loadFullState from "./loadFullState";
import handleEventsStore from "./handleEventsStore";

const handleEvents = (function () {
  async function on(event) {
    const getStateBlockNum = handleEventsStore.getStateBlockNum();
    // Filter blockNum
    if (event.blockNumber <= getStateBlockNum) {
      return;
    }
    console.log(event);

    // TODO: Filter event names (including those without names)
    // !!! TODO: do NOT use getState again here (inside loadFullState)
    await loadFullState();
  }

  return {
    on,
  };
})();

export default handleEvents;
