import { useSelector } from "react-redux";
import styled from "styled-components/macro";

const StyledGrid = styled.div`
  position: absolute;
  /* width: 100%;
  height: 100%; */
  inset: 0;
  z-index: ${(props) => props.zIndex};

  display: grid;
  /** Calculate the needed track width by ourselves instead of fr + 100% width & height, as fr tends to create distorted cell length
   * This will make the grid tracks not using the native CSS responsive mechanism anymore
   */
  grid-template-columns: repeat(
    ${(props) => props.len},
    calc(var(--grid-length) / ${(props) => props.len})
  );
  grid-template-rows: repeat(
    ${(props) => props.len},
    calc(var(--grid-length) / ${(props) => props.len})
  );

  /**
  * Display grid mesh
  */
  /* !!! "gap" doesn't work well here, not for very large grid */
  background-size: calc(var(--grid-length) / ${(props) => props.len})
    calc(var(--grid-length) / ${(props) => props.len});
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
