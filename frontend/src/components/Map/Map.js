import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { isDying } from "../../utils/deadzone";

import { Spinner } from "react-bootstrap";
import Cell from "./Cell";

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
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );

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
  // Filling in cellArray with spaceship indexes
  // If a cell has a spaceship, store its shipDataArray's of the ship in cellArray
  for (let i = 0; i < shipDataArray.length; i++) {
    const { posX: x, posY: y, health } = shipDataArray[i];
    if (health > 0) {
      cellArray[y][x] = i;
    }
  }

  /*
   * Zoom to ship when new ship is chosen by the owner
   */
  // For accessing TransformWrapper's handlers
  const transformWrapperRef = useRef(null);
  useEffect(() => {
    if (
      // 1. data must be loaded to get the ship DOM node
      isDataLoaded &&
      // 2. a ship must be selected
      ownerChosenShip !== null &&
      // 3. The ship must be alive
      shipDataArray[ownerChosenShip].health > 0
    ) {
      const currShipData = shipDataArray[ownerChosenShip];
      const x = currShipData.posX;
      const y = currShipData.posY;
      // zoomToElement(node, scale, animationTime, animationType)
      transformWrapperRef.current.zoomToElement(`cell-${x}-${y}`, 10, 100);
    }
  }, [ownerChosenShip]);

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
                      isDying={isDying(x, y, mapLength, zoneLength)}
                      shipIndex={shipIndex}
                      x={x}
                      y={y}
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
          <span className={`h1 text-light ${cl.loadingText}`}>
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
