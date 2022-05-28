export function filterAliveShips(allShipsData) {
  const aliveShipsData = [];
  allShipsData.forEach((shipData, shipIndex) => {
    if (shipData.health > 0) aliveShipsData.push({ ...shipData, shipIndex });
  });
  return aliveShipsData;
}
