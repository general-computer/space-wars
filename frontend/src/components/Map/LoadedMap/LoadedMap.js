import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import FullSizeWrapper from "../components/FullSizeWrapper";
import LayersWrapper from "../components/LayersWrapper";
import DeadZoneLayer from "./DeadZoneLayer";
import AvatarLayer from "./AvatarLayer";

export default (function () {
  // Data fetching
  const { isDataLoaded, shipDataArray } = useSelector((state) => state.data);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );

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
    <TransformWrapper maxScale={999} ref={transformWrapperRef}>
      <TransformComponent>
        <FullSizeWrapper>
          <LayersWrapper>
            <DeadZoneLayer zIndex={10} />
            <AvatarLayer zIndex={50} />
          </LayersWrapper>
        </FullSizeWrapper>
      </TransformComponent>
    </TransformWrapper>
  );
});
