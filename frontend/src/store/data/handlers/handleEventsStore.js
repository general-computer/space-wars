const handleEventsStore = (function () {
  let _getStateBlockNum;

  function gotStateAt(getStateBlockNum) {
    _getStateBlockNum = getStateBlockNum;
  }

  function getStateBlockNum() {
    return _getStateBlockNum;
  }
  return {
    gotStateAt,
    getStateBlockNum,
  };
})();
export default handleEventsStore;
