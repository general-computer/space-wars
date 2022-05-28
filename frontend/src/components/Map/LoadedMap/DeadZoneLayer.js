import { useSelector } from "react-redux";
import styled from "styled-components/macro";
import Grid from "../components/Grid";

const DeadZone = styled.div`
  background-color: rgb(204 21 21 / 33%);
`;

const DeadZone1 = styled(DeadZone)`
  grid-column: 1 / -1;
  grid-row: 1 / span ${(props) => props.deadZoneWidth};
`;
const DeadZone2A = styled(DeadZone)`
  grid-column: 1 / span ${(props) => props.deadZoneWidth};
  grid-row: ${(props) => props.deadZoneWidth + 1} / -${(props) => props.deadZoneWidth + 1};
`;
const DeadZone2B = styled(DeadZone)`
  grid-column: -${(props) => props.deadZoneWidth + 1} / -1;
  grid-row: ${(props) => props.deadZoneWidth + 1} / -${(props) => props.deadZoneWidth + 1};
`;
const DeadZone3 = styled(DeadZone)`
  grid-column: 1 / -1;
  grid-row: -${(props) => props.deadZoneWidth + 1} / -1;
`;

export default function DeadZoneLayer({ zIndex }) {
  const mapLength = useSelector((state) => state.data.mapLength);
  const zoneLength = useSelector((state) => state.data.zoneLength);

  const deadZoneWidth = (mapLength - zoneLength) / 2;

  return (
    // if no dead zone exist yet, renders nothing
    zoneLength < mapLength && (
      <Grid zIndex={zIndex}>
        <DeadZone1 deadZoneWidth={deadZoneWidth} />
        <DeadZone2A deadZoneWidth={deadZoneWidth} />
        <DeadZone2B deadZoneWidth={deadZoneWidth} />
        <DeadZone3 deadZoneWidth={deadZoneWidth} />
      </Grid>
    )
  );
}
