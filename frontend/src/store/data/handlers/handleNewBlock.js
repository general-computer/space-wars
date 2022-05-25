import gameContractStore from "../../../contract/gameContractStore";
import loadFullState from "../scripts/loadFullState";

const handleNewBlock = (function () {
  let _gameStartTime, _lastSyncedDay;

  function gameStartedAt(time) {
    _gameStartTime = time;
  }

  function _syncDay(newIntDay) {
    _lastSyncedDay = newIntDay;
  }

  function _calcIntDay(time) {
    return Math.floor((time - _gameStartTime) / (60 * 60 * 24));
  }

  async function gotStateAt(blockNum) {
    const gameContract = gameContractStore.getContract();
    const getStateTime = (await gameContract.provider.getBlock(blockNum))
      .timestamp;
    const getStateIntDays = _calcIntDay(getStateTime);
    _syncDay(getStateIntDays);
  }

  async function on(blockNum) {
    console.log("New block number:", blockNum);

    const gameContract = gameContractStore.getContract();
    const newTimestamp = (await gameContract.provider.getBlock(blockNum))
      .timestamp;
    console.log("New block timestamp:", newTimestamp);

    /**
     * !!! gameStartTime should never change in real contract, but for testing purpose it may move back
     * !!! Comment these out if not testing
     */
    const newGameStartTime = await gameContract.s_gameStartTime();
    gameStartedAt(newGameStartTime);

    /** Check if one day has passed */
    const newIntDays = _calcIntDay(newTimestamp);
    console.log("Game day:", newIntDays);

    const dayPassed = newIntDays - _lastSyncedDay;
    if (dayPassed <= 0) {
      return;
    } else {
      console.log("More than one day has passed since last synced");
      // TODO: do not call getState again (inside loadFullstate); instead, utilise newIntDays to update the Redux state
      await loadFullState();
      // Record after syncing (if not already done in loadFullState)
      _syncDay(newIntDays);
    }
  }

  return {
    gameStartedAt,
    gotStateAt,
    on,
  };
})();

export default handleNewBlock;
