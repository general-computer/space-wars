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
  const mockRangeIncr = useSelector((state) => state.sideMenu.mockRangeIncr);
  const mockAPIncr = useSelector((state) => state.sideMenu.mockAPIncr);
  const shipData = useSelector(
    (state) => state.data.shipDataArray[clickedShipIndex]
  );

  /**
   * Data Processing
   */
  const { actionPoints, posX, posY } = shipData;
  // When mocking range upgrade, the AP usable for moves should decrease
  const usableAP = (() => {
    if (mockRangeIncr !== 0) return actionPoints - mockRangeIncr;
    else if (mockAPIncr !== 0) return actionPoints + mockAPIncr;
    else return actionPoints;
  })();
  // CSS grid's gutter starts from 1. Also, the shooting zone cannot lie out of the CSS grid. Need some calculations.
  const xGutters = {
    min: Math.max(posX - usableAP + 1, 1),
    max: Math.min(posX + usableAP + 2, mapLength + 1),
  };
  const yGutters = {
    min: Math.max(posY - usableAP + 1, 1),
    max: Math.min(posY + usableAP + 2, mapLength + 1),
  };

  return (
    shipData.health > 0 && (
      <Grid zIndex={zIndex}>
        <RangeBlock xGutters={xGutters} yGutters={yGutters} />
      </Grid>
    )
  );
}
