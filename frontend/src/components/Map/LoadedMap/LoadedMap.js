import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import FullSizeWrapper from "../components/FullSizeWrapper";
import LayersWrapper from "../components/LayersWrapper";
import DeadZoneLayer from "./DeadZoneLayer";
import AvatarLayer from "./AvatarLayer";
import ShootingRangeLayer from "./ShootingRangeLayer";
import ClickableLayer from "./ClickableLayer";

export default function LoadedMap() {
  // Data fetching
  const { isDataLoaded, shipDataArray } = useSelector((state) => state.data);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );

  /*
   * Zoom to ship when new ship is CLICKED
   * Note: a dead ship can also be "clicked" by choosing on the ChoosingShip component
   */
  // For accessing TransformWrapper's handlers
  const transformWrapperRef = useRef(null);
  const lastClickedShip = useRef(null);
  useEffect(() => {
    // Use clickedShipIndex, or lastClickedShip if available
    let targetShipIndex;
    if (clickedShipIndex === null) {
      if (lastClickedShip.current === null) return;
      else targetShipIndex = lastClickedShip.current;
    } else targetShipIndex = clickedShipIndex;

    // But no zoom if the target ship is dead
    if (shipDataArray[targetShipIndex].health <= 0) return;

    const targetShipData = shipDataArray[targetShipIndex];
    const x = targetShipData.posX;
    const y = targetShipData.posY;
    // Usage: zoomToElement(node, scale, animationTime, animationType)
    transformWrapperRef.current.zoomToElement(`cell-${x}-${y}`, 5, 1);

    // Store the last clicked ship
    lastClickedShip.current = clickedShipIndex;
  }, [clickedShipIndex]);

  return (
    <TransformWrapper minScale={0.8} maxScale={999} ref={transformWrapperRef}>
      <TransformComponent>
        <FullSizeWrapper>
          <LayersWrapper>
            <ClickableLayer zIndex={100} />
            {clickedShipIndex !== null && <ShootingRangeLayer zIndex={70} />}
            <AvatarLayer zIndex={30} />
            <DeadZoneLayer zIndex={10} />
          </LayersWrapper>
        </FullSizeWrapper>
      </TransformComponent>
    </TransformWrapper>
  );
}
