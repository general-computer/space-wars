import { filterAliveShips } from "./shipFilters";

export function moveCheck({
  shipDataArray,
  clickedShipIndex,
  transX,
  transY,
  mapLength,
}) {
  const {
    actionPoints,
    posX: clickedShipX,
    posY: clickedShipY,
  } = shipDataArray[clickedShipIndex];
  const aliveShipsData = filterAliveShips(shipDataArray);
  // Calculate how many moves it takes to translate
  const moves = Math.max(Math.abs(transX), Math.abs(transY));
  // Final (mock) X & Y positions
  const translatedX = clickedShipX + transX;
  const translatedY = clickedShipY + transY;
  const inRangeEnemyShipsXY = aliveShipsData
    .filter((shipData) => shipData.shipIndex !== clickedShipIndex)
    .filter(
      (enemyShipData) =>
        Math.abs(enemyShipData.posX - clickedShipX) <= actionPoints &&
        Math.abs(enemyShipData.posY - clickedShipY) <= actionPoints
    )
    .map((inRangeShipData) => ({
      x: inRangeShipData.posX,
      y: inRangeShipData.posY,
    }));
  // Criteria that disables moves
  const outOfAP = moves > actionPoints;
  const outOfMap =
    translatedX < 0 ||
    translatedY < 0 ||
    translatedX > mapLength - 1 ||
    translatedY > mapLength - 1;
  const clashEnemyShips = inRangeEnemyShipsXY.some(
    (enemyXY) => enemyXY.x === translatedX && enemyXY.y === translatedY
  );
  const isMoveAllowed =
    (transX === 0 && transY === 0) || outOfAP || outOfMap || clashEnemyShips;

  return {
    moves,
    translatedX,
    translatedY,
    outOfAP,
    outOfMap,
    clashEnemyShips,
    isMoveAllowed,
  };
}
