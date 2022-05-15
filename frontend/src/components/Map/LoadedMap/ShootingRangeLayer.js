import { useSelector } from "react-redux";

import styled from "styled-components/macro";
import Grid from "../components/Grid";
import { Avatar } from "../components/Avatar";

const RangeBlock = styled.div`
  background-color: rgb(13 110 253 / 62%);
  grid-column: ${(props) => props.x - props.range + 1} / span
    ${(props) => props.range * 2 + 1};
  grid-row: ${(props) => props.y - props.range + 1} / span
    ${(props) => props.range * 2 + 1};
`;

export default function ShootingRangeLayer({ zIndex }) {
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const shipData = useSelector(
    (state) => state.data.shipDataArray[clickedShipIndex]
  );
  const { range, posX, posY } = shipData;

  return (
    <Grid zIndex={zIndex}>
      <RangeBlock x={posX} y={posY} range={range} />
    </Grid>
  );
}
