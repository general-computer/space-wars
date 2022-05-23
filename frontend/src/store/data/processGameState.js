export const processGameState = (rawState) => {
  const {
    allUnits,
    images,
    currentZoneRadius,
    s_gameStartTime,
    tokenIdToOwner,
    playfieldSize,
  } = rawState;

  const shipDataArray = allUnits.map((ship, index) => {
    const { x, y, level, points, lives, lastSimulatedDay } = ship;
    // tokenId HAPPENS to be exactly the same as the index in both `allUnits` and `images`
    const tokenId = index;
    return {
      /// Some numbers are returned as BigNumber so use unary plus here (toString --> number)
      avatarString: images[index],
      tokenId: index,
      owner: tokenIdToOwner[tokenId],
      posX: +x,
      posY: +y,
      /// Note: `level` in the contract is in the range 0 ~ 2
      range: +level + 1,
      actionPoints: +points,
      health: +lives,
      lastSimulatedDay: +lastSimulatedDay,
    };
  });

  return {
    mapLength: +playfieldSize,
    zoneLength: +currentZoneRadius * 2,
    gameStartTime: +s_gameStartTime,
    shipDataArray,
  };
};

/* 
{
      avatarString: SHIPS[genRandomNum(NUM_OF_SPACESHIPS) - 1],
      tokenId: genRandomNum(10000).toString(),
      owner: SAMPLE_OWNERS[genRandomNum(2)],
      posX: genRandomNum(MAP_LENGTH - 1),
      posY: genRandomNum(MAP_LENGTH - 1),
      /// Note: range = level + 1
      range: genRandomNum(2) + 1,
      actionPoints: genRandomNum(10),
      health: genRandomNum(3),
    };

*/
