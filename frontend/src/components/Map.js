import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import styled from "styled-components";

import { Spinner } from "react-bootstrap";
import Cell from "./Map/Cell";

import cl from "./Map.module.css";

/* The <Grid> need special care on styling with CSS-in-JS */
const Grid = styled.div`
  /* "gap" doesn't work well when dimension of the map is large */
  /* gap: 0.1rem; */
  grid-template-columns: repeat(${({ len }) => len}, 1fr);
  grid-template-rows: repeat(${({ len }) => len}, 1fr);
`;

export default function Map() {
  // Data fetching
  const { isDataLoaded, mapLength, zoneLength, shipDataArray } = useSelector(
    (state) => state.data
  );
  const { walletAddress } = useSelector((state) => state.wallet);

  // Calculate the dead zone boudaries
  const deadZoneWidth = (mapLength - zoneLength) / 2;
  const liveZoneBoundary = {
    lower: deadZoneWidth,
    upper: mapLength - deadZoneWidth,
  };
  function isDying(x, y) {
    if (
      x < liveZoneBoundary.lower ||
      x > liveZoneBoundary.upper ||
      y < liveZoneBoundary.lower ||
      y > liveZoneBoundary.upper
    )
      return true;
    else return false;
  }

  // An empty len*len array for rendering the map
  const cellArray = (function () {
    const yxArray = [];
    for (let y = 0; y < mapLength; y++) {
      const yArray = [];
      for (let x = 0; x < mapLength; x++) {
        yArray.push(null);
      }
      yxArray.push(yArray);
    }
    return yxArray;
  })();
  // Filling in cellArray with spaceship data
  // If a cell has a spaceship, store the shipDataArray's INDEX of the ship in cellArray
  for (let i = 0; i < shipDataArray.length; i++) {
    const { posX: x, posY: y } = shipDataArray[i];
    /********* Highlight the first spaceship in the spaceshipXYPos as 2, faking the owner's ship; otherwise assign 0. Modify this logic later !!! */
    // Only blink when wallet is connected (thus possible to see if it owns a spaceship)
    // cellArray[y][x] = i === 0 && isConnected ? 2 : 1;
    //
    cellArray[y][x] = i;
  }

  // For accessing TransformWrapper's handlers
  const transformWrapperRef = useRef(null);
  console.log(transformWrapperRef);
  useEffect(() => {
    /* ***** SHould I just disable the connect button until data is loaded? */
    if (walletAddress !== "" && isDataLoaded) {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(Math.random() * 100);
      console.log(`cell-${x}-${y}`);
      transformWrapperRef.current.zoomToElement(
        `cell-${x}-${y}`,
        10,
        2000,
        "linear"
      );
    }
  }, [walletAddress]);

  // setTransform(x, y, scale, animationTime, animationType)
  /*   if (setTransform && walletAddress !== "") {
    console.log(setTransform);
    setTransform(Math.random() * 100 - 100, Math.random() * 100 - 100, 3, 2000);
  } */

  return (
    <section className={cl.map}>
      {/* Show map only when data is loaded */}
      {isDataLoaded ? (
        <TransformWrapper maxScale={999} ref={transformWrapperRef}>
          <TransformComponent>
            <div className={cl.fullSizeWrapper}>
              <Grid len={mapLength} className={cl.grid}>
                {cellArray.map((yArray, y) =>
                  yArray.map((shipIndex, x) => (
                    <Cell
                      isDying={isDying(x, y)}
                      shipIndex={shipIndex}
                      id={`cell-${x}-${y}`}
                      key={`${x},${y}`}
                    />
                  ))
                )}
              </Grid>
            </div>
          </TransformComponent>
        </TransformWrapper>
      ) : (
        /* Otherwise, show "Loading..." */
        <div className={cl.fullSizeWrapper}>
          <span className={`h3 text-light ${cl.loadingText}`}>
            Map Loading...
          </span>
          <Spinner animation="border" role="status" variant="light">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </section>
  );
}
