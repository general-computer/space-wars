import { useSelector } from "react-redux";

import styled from "styled-components/macro";
import Grid from "../components/Grid";

const RangeBlock = styled.div`
  background-color: rgb(13 152 253 / 53%);
  grid-column: ${(props) => props.xGutters.min} /
    ${(props) => props.xGutters.max};
  grid-row: ${(props) => props.yGutters.min} / ${(props) => props.yGutters.max};
`;

export default function MovableRangeLayer({ zIndex }) {
  const mapLength = useSelector((state) => state.data.mapLength);
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const shipData = useSelector(
    (state) => state.data.shipDataArray[clickedShipIndex]
  );

  /**
   * Data Processing
   */
  const { actionPoints, posX, posY } = shipData;

  // CSS grid's gutter starts from 1. Also, the shooting zone cannot lie out of the CSS grid. Need some calculations.
  const xGutters = {
    min: Math.max(posX - actionPoints + 1, 1),
    max: Math.min(posX + actionPoints + 2, mapLength + 1),
  };
  const yGutters = {
    min: Math.max(posY - actionPoints + 1, 1),
    max: Math.min(posY + actionPoints + 2, mapLength + 1),
  };

  return (
    shipData.health > 0 && (
      <Grid zIndex={zIndex}>
        <RangeBlock xGutters={xGutters} yGutters={yGutters} />
      </Grid>
    )
  );
}
