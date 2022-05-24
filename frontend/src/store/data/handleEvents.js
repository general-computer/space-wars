import loadFullState from "./loadFullState";

const handleEvents = (function () {
  let _GETSTATE_BLOCKNUM;

  function gotStateAt(getStateBlockNum) {
    _GETSTATE_BLOCKNUM = getStateBlockNum;
  }

  async function on(event) {
    // Filter blockNum
    if (event.blockNumber <= _GETSTATE_BLOCKNUM) {
      return;
    }
    console.log(event);

    // TODO: Filter event names (including those without names)
    // !!! TODO: do NOT use getState again here (inside loadFullState)
    await loadFullState();
  }

  return {
    gotStateAt,
    on,
  };
})();

export default handleEvents;
