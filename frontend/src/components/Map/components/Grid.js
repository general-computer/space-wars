import { useSelector } from "react-redux";
import styled from "styled-components/macro";

const Grid = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: ${(props) => props.zIndex};

  display: grid;
  /* "gap" doesn't work well when dimension of the map is large */
  /* gap: 0.1rem; */
  grid-template-columns: repeat(${(props) => props.len}, 1fr);
  grid-template-rows: repeat(${(props) => props.len}, 1fr);
`;

export default (function ({ children, zIndex, ...attr }) {
  const mapLength = useSelector((state) => state.data.mapLength);

  return (
    <Grid len={mapLength} zIndex={zIndex} {...attr}>
      {children}
    </Grid>
  );
});
