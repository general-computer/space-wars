import { useSelector } from "react-redux";
import styled from "styled-components/macro";

const StyledGrid = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: ${(props) => props.zIndex};

  display: grid;
  grid-template-columns: repeat(${(props) => props.len}, 1fr);
  grid-template-rows: repeat(${(props) => props.len}, 1fr);

  /**
  * Display grid mesh
  */
  /* "gap" doesn't work well when dimension of the map is large */
  /* gap: 0.1rem; */
  background-size: calc(
      min(var(--map-width), var(--map-height)) / ${(props) => props.len}
    )
    calc(min(var(--map-width), var(--map-height)) / ${(props) => props.len});
  background-image: linear-gradient(to right, grey 0.1px, transparent 0.1px),
    linear-gradient(to bottom, grey 0.1px, transparent 0.1px);
`;

export default function Grid({ children, zIndex, ...attr }) {
  const mapLength = useSelector((state) => state.data.mapLength);

  return (
    <StyledGrid len={mapLength} zIndex={zIndex} {...attr}>
      {children}
    </StyledGrid>
  );
}
