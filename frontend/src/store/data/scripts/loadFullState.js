import store from "../../mainStore";
import dataSlice from "../dataSlice";
import gameContractStore from "../../../contract/gameContractStore";
import { processGameState } from "../utils/processGameState";
import handleEventStore from "../handlers/handleEventsStore";
import handleNewBlock from "../handlers/handleNewBlock";
import loadFakeData from "../loadFakeDataThunk";

import { ethers } from "ethers";

function rand(seed) {
  return ethers.BigNumber.from(ethers.utils.keccak256(seed));
}

function randomRange(seed, max) {
  return rand(seed).mod(ethers.BigNumber.from(max));
}

function randHsl(seed) {
  return `"hsl(${randomRange(seed, 359).toNumber()} 100% ${randomRange(seed + 1, 40).toNumber() + 20}%)"`;
}

function renderShip(seed) {
  return `data:image/svg+xml;base64,` + btoa(`<svg width="500" height="500" version="1.1" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <!-- The frame/border -->
      <g fill=${randHsl(seed)}>
          <rect x="9" y="0" width="2" height="1"/>
          <rect x="8" y="1" width="1" height="1"/>
          <rect x="11" y="1" width="1" height="1"/>
          <rect x="1" y="2" width="1" height="1"/>
          <rect x="18" y="2" width="1" height="1"/>
          <rect x="7" y="2" width="1" height="14"/>
          <rect x="12" y="2" width="1" height="14"/>
          <rect x="0" y="3" width="1" height="13"/>
          <rect x="19" y="3" width="1" height="13"/>
          <rect x="2" y="3" width="1" height="5"/>
          <rect x="17" y="3" width="1" height="5"/>
          <rect x="9" y="3" width="2" height="1"/>
          <rect x="8" y="4" width="1" height="1"/>
          <rect x="11" y="4" width="1" height="1"/>
          <rect x="9" y="5" width="2" height="1"/>
          <rect x="3" y="8" width="1" height="5"/>
          <rect x="16" y="8" width="1" height="5"/>
          <rect x="4" y="9" width="2" height="1"/>
          <rect x="14" y="9" width="2" height="1"/>
          <rect x="6" y="8" width="1" height="1"/>
          <rect x="13" y="8" width="1" height="1"/>
          <rect x="2" y="13" width="3" height="1"/>
          <rect x="15" y="13" width="3" height="1"/>
          <rect x="1" y="14" width="1" height="1"/>
          <rect x="18" y="14" width="1" height="1"/>
          <rect x="5" y="14" width="1" height="2"/>
          <rect x="14" y="14" width="1" height="2"/>
          <rect x="6" y="16" width="3" height="1"/>
          <rect x="11" y="16" width="3" height="1"/>
          <rect x="8" y="17" width="1" height="1"/>
          <rect x="11" y="17" width="1" height="1"/>
          <rect x="7" y="18" width="1" height="1"/>
          <rect x="12" y="18" width="1" height="1"/>
          <rect x="7" y="19" width="6" height="1"/>
      </g>
      <!-- Both wings -->
      <g fill=${randHsl(seed + 2)}>
          <rect x="1" y="3" width="1" height="11"/>
          <rect x="2" y="8" width="1" height="5"/>
          <rect x="18" y="3" width="1" height="11"/>
          <rect x="17" y="8" width="1" height="5"/>
      </g>
      <!-- Ship body -->
      <g fill=${randHsl(seed + 4)}>
          <rect x="8" y="5" width="1" height="11"/>
          <rect x="11" y="5" width="1" height="11"/>
          <rect x="9" y="6" width="1" height="12"/>
          <rect x="10" y="6" width="1" height="12"/>
          <rect x="8" y="18" width="4" height="1"/>
      </g>
      <!-- Extension from body to the wings -->
      <g fill=${randHsl(seed + 6)}>
          <rect x="4" y="10" width="1" height="3"/>
          <rect x="15" y="10" width="1" height="3"/>
          <rect x="5" y="10" width="1" height="4"/>
          <rect x="14" y="10" width="1" height="4"/>
          <rect x="6" y="9" width="1" height="7"/>
          <rect x="13" y="9" width="1" height="7"/>
      </g>
      <!-- Cockpit window -->
      <g fill=${randHsl(seed + 8)}>
          <rect x="9" y="4" width="2" height="1"/>
      </g>
      <!-- Cockpit -->
      <g fill=${randHsl(seed + 10)}>
          <rect x="8" y="2" width="1" height="2"/>
          <rect x="9" y="1" width="2" height="2"/>
          <rect x="11" y="2" width="1" height="2"/>
      </g>
  </svg>`);
}

export default async function loadFullState() {
  /**
   * Load game state
   */
  const gameContract = gameContractStore.getContract();
  // Calling all functions that determines the initial state from a specific block
  // - As contract functions calls below are asynchronous, this is to synchronise the initial state to that of a single block
  const currBlockNum = (await gameContract.provider.getBlock()).number;
  console.log("Loaded state blockNum:", currBlockNum);

  // !!! allow editing the rawGameState later by doing shallow copy
  const rawGameState = {
    ...(await gameContract.getState({
      // !!! Wallet like Metamask will do gas fee estimation but it is both unnecesarry for read-only functions,
      // and will throw for "Transaction run out of gas". So just hard-code it here.
      gasLimit: "999999999999999",
      blockTag: currBlockNum,
    })),
  };
  // Add owner details & playfieldSize to rawGameState
  let tokenIdToOwner = {};
  let playfieldSize;
  const ownerReq = rawGameState.allUnits.map(
    // !!! tokenId HAPPENS to be the same as the indexes in rawGameState.allUnits
    async (unit, tokenId) => {
      let owner;
      try {
        owner = await gameContract.ownerOf(tokenId, {
          blockTag: currBlockNum,
        });
      } catch (err) {
        // Allow a token to have no owner, just give warnings
        console.warn(
          `initThunk: cannot get owner of tokenId ${tokenId}, is it minted and still has an owner?`
        );
        owner = "";
      }
      tokenIdToOwner[tokenId] = owner;
    }
  );
  const playfieldSizeReq = (async () => {
    playfieldSize = +(await gameContract.getPlayfieldSize());
  })();
  await Promise.all([...ownerReq, playfieldSizeReq]);

  rawGameState.tokenIdToOwner = tokenIdToOwner;
  rawGameState.playfieldSize = playfieldSize;

  rawGameState.images = rawGameState.allUnits.map(
    (unit, tokenId) => {
      return renderShip(unit.colorSeed);
    }
  );

  console.log(`Raw game state:`, rawGameState);

  /**
   * Process Game state
   */
  const processedGameState = processGameState(rawGameState);
  console.log(`Processed game state:`, processedGameState);

  store.dispatch(dataSlice.actions.showData(processedGameState));
  /** Alternatively, use loadFakeData() for faking the data loaded */
  // await dispatch(loadFakeData());

  // Tell handlers that we have the latest state
  handleEventStore.gotStateAt(currBlockNum);
  handleNewBlock.gotStateAt(currBlockNum);
  // And log the gameStartTime
  handleNewBlock.gameStartedAt(processedGameState.gameStartTime);
}
