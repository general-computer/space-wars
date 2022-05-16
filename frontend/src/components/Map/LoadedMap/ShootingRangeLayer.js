import { useSelector } from "react-redux";

import styled from "styled-components/macro";
import Grid from "../components/Grid";
import { Avatar } from "../components/Avatar";

const RangeBlock = styled.div`
  background-color: rgb(35 144 71 / 65%);
  grid-column: ${(props) => props.xGutters.min} /
    ${(props) => props.xGutters.max};
  grid-row: ${(props) => props.yGutters.min} / ${(props) => props.yGutters.max};
`;

export default function ShootingRangeLayer({ zIndex }) {
  const mapLength = useSelector((state) => state.data.mapLength);
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const shipData = useSelector(
    (state) => state.data.shipDataArray[clickedShipIndex]
  );
  const { transX, transY } = useSelector((state) => state.sideMenu.mockMoves);

  /**
   * Data Processing
   */
  const { range, posX: origX, posY: origY, avatarString } = shipData;
  const translatedX = origX + transX;
  const translatedY = origY + transY;

  // CSS grid's gutter starts from 1. Also, the shooting zone cannot lie out of the CSS grid. Need some calculations.
  const xGutters = {
    min: Math.max(translatedX - range + 1, 1),
    max: Math.min(translatedX + range + 2, mapLength + 1),
  };
  const yGutters = {
    min: Math.max(translatedY - range + 1, 1),
    max: Math.min(translatedY + range + 2, mapLength + 1),
  };

  return (
    shipData.health > 0 && (
      <Grid zIndex={zIndex}>
        <RangeBlock xGutters={xGutters} yGutters={yGutters} />
        <Avatar src={avatarString} x={translatedX} y={translatedY} />
      </Grid>
    )
  );
}
