import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LayersWrapper from "../components/LayersWrapper";
import DeadZoneLayer from "./DeadZoneLayer";
import AvatarLayer from "./AvatarLayer";
import ShootingRangeLayer from "./ShootingRangeLayer";
import ClickableLayer from "./ClickableLayer";
import MovableRangeLayer from "./MovableRangeLayer";
import cl from "./LoadedMap.module.css";

export default function LoadedMap() {
  // Data fetching
  const shipDataArray = useSelector((state) => state.data.shipDataArray);
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const menuType = useSelector((state) => state.sideMenu.menuType);

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
    transformWrapperRef.current.zoomToElement(
      `cell-${x}-${y}`,
      // retain the current zooming scale
      transformWrapperRef.current.state.scale,
      1
    );

    // Update lastClickedShip
    lastClickedShip.current = clickedShipIndex;
  }, [clickedShipIndex, menuType]);

  return (
    <TransformWrapper
      minScale={0.7}
      maxScale={999}
      /* This enables the map to be navigated anywhere regardless of the TransformComponent width and height */
      limitToBounds={false}
      ref={transformWrapperRef}
    >
      {/** wrapperStyle needed to be defined to override the default `fit-content` behaviour of the wrapper
       *  - `contentClass` can also be defined but it does not have any effect
       * This is necessary to make the content responsive to the parent's dimension and be fully responsive, e.g. when the sideMenu pops up */}
      <TransformComponent
        wrapperClass={cl.wrapperClass}
        contentClass={cl.contentClass}
      >
        <LayersWrapper>
          <ClickableLayer zIndex={100} />
          {clickedShipIndex !== null && (
            <>
              <ShootingRangeLayer zIndex={70} />
              <MovableRangeLayer zIndex={50} />
            </>
          )}
          <AvatarLayer zIndex={30} />
          <DeadZoneLayer zIndex={10} />
        </LayersWrapper>
      </TransformComponent>
    </TransformWrapper>
  );
}
