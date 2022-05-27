import { createSlice, current } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    // isDataLoaded: when the contract has replied with results
    isDataLoaded: false,
    mapLength: 0,
    zoneLength: 0,
    gameStartTime: 0,
    // The array below is has items with this structure:
    /* 
      {
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
      }
    */
    shipDataArray: [],
  },
  reducers: {
    showData(state, action) {
      const { mapLength, shipDataArray, zoneLength, gameStartTime } =
        action.payload;
      return {
        ...state,
        isDataLoaded: true,
        mapLength,
        zoneLength,
        gameStartTime,
        shipDataArray,
      };
    },
    mapEvent(state, action) {
      const { actionType } = action.payload;
      switch (actionType) {
        case "move":
          (() => {
            const { tokenId, x: newX, y: newY } = action.payload;
            const targetShipIndex = getShipIndexFromTokenId(
              tokenId,
              state.shipDataArray
            );
            if (!numsAreValid([newX, newY])) {
              throw new Error(
                `dataSlice.reducers.mapEvent: (${newX},${newY}) are not valid co-ordinates`
              );
            }
            // check the number of moves for dedecuting APs
            const {
              posX: origX,
              posY: origY,
              actionPoints: origAP,
            } = state.shipDataArray[targetShipIndex];
            const moves = Math.max(
              Math.abs(newX - origX),
              Math.abs(newY - origY)
            );
            const finalAP = getFinalAP(origAP, -moves);
            Object.assign(state.shipDataArray[targetShipIndex], {
              posX: newX,
              posY: newY,
              actionPoints: finalAP,
            });
          })();
          break;
        case "upgrade":
          (() => {
            const { tokenId, range: newRange } = action.payload;
            const targetShipIndex = getShipIndexFromTokenId(
              tokenId,
              state.shipDataArray
            );
            if (!numsAreValid([newRange])) {
              throw new Error(
                `dataSlice.reducers.mapEvent: ${newRange} is not a valid range`
              );
            }
            // Check how much the range has been increased for changing AP
            const { range: origRange, actionPoints: origAP } =
              state.shipDataArray[targetShipIndex];
            const rangeIncr = newRange - origRange;
            const finalAP = getFinalAP(origAP, -rangeIncr);
            Object.assign(state.shipDataArray[targetShipIndex], {
              range: newRange,
              actionPoints: finalAP,
            });
          })();
          break;
        case "giveAP":
          (() => {
            const { fromTokenId, toTokenId, amount } = action.payload;
            const fromShipIndex = getShipIndexFromTokenId(
              fromTokenId,
              state.shipDataArray
            );
            const toShipIndex = getShipIndexFromTokenId(
              toTokenId,
              state.shipDataArray
            );
            if (!numsAreValid([amount])) {
              throw new Error(
                `dataSlice.reducers.mapEvent: ${amount} is not a valid AP amount`
              );
            }
            // Assign final APs
            const { actionPoints: fromOrigAP } =
              state.shipDataArray[fromShipIndex];
            const { actionPoints: toOrigAP } = state.shipDataArray[toShipIndex];
            const fromFinalAP = getFinalAP(fromOrigAP, -amount);
            const toFinalAP = getFinalAP(toOrigAP, +amount);
            state.shipDataArray[fromShipIndex].actionPoints = fromFinalAP;
            state.shipDataArray[toShipIndex].actionPoints = toFinalAP;
          })();
          break;
        case "shoot":
          (() => {
            const { attId, victId, damage } = action.payload;
            const fromShipIndex = getShipIndexFromTokenId(
              attId,
              state.shipDataArray
            );
            const toShipIndex = getShipIndexFromTokenId(
              victId,
              state.shipDataArray
            );
            if (!numsAreValid([damage])) {
              throw new Error(
                `dataSlice.reducers.mapEvent: ${damage} is not a valid damage amount`
              );
            }
            // Assign final APs & health
            const { actionPoints: fromOrigAP } =
              state.shipDataArray[fromShipIndex];
            const { health: toOrigHealth } = state.shipDataArray[toShipIndex];
            const fromFinalAP = getFinalAP(fromOrigAP, -damage);
            const toFinalHealth = getFinalAP(toOrigHealth, -damage);
            state.shipDataArray[fromShipIndex].actionPoints = fromFinalAP;
            state.shipDataArray[toShipIndex].health = toFinalHealth;
          })();
          break;
        default:
          throw new Error(
            `dataSlice.reducers.mapEvent: unrecognised actionType "${actionType}"`
          );
      }
      console.log(`One "${actionType}" action successfully mapped`);
    },
  },
});

export default dataSlice;

const getShipIndexFromTokenId = (tokenId, shipDataArray) => {
  const targetShipIndex = shipDataArray.findIndex(
    (shipData) => shipData.tokenId === tokenId
  );
  if (targetShipIndex < 0) {
    throw new Error(
      `dataSlice.getShipIndexFromTokenId: tokenId ${tokenId} does not match any ships in state.data.shipDataArray`
    );
  }
  return targetShipIndex;
};

const numsAreValid = (numArr, extraTest) => {
  for (const num of numArr) {
    if (typeof num !== "number" || isNaN(num)) {
      return false;
    }
    if (typeof extraTest === "function") {
      if (!extraTest(num)) {
        return false;
      }
    }
  }
  return true;
};

const getFinalAP = (origAP, change) => {
  const finalAP = origAP + change;
  if (finalAP < 0) {
    throw new Error(
      `dataSlice.getFinalAP: finalAP < 0. origAP: ${origAP}, change: ${change}`
    );
  }
  return finalAP;
};
