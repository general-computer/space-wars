import styled from "styled-components/macro";
import { useSelector } from "react-redux";

const StyledFullSizeWrapper = styled.div`
  /** 
  * Not ideal to set a fixed content height.
  * Unfortunately the TransformWrapper & TransformComponent always uses "fit-content" so will be hard-coded here
  */
  --map-width: ${(props) => (props.isMenuOpen ? 50 : 80)}vw;
  // **** Alternative way to set map width; still on testing
  /* --map-width: calc(${() => window.mapWidth} - 5vw); */
  --map-height: 80vh;

  width: var(--map-width);
  height: var(--map-height);

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function FullSizeWrapper({ children }) {
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  return (
    <StyledFullSizeWrapper isMenuOpen={clickedShipIndex !== null}>
      {children}
    </StyledFullSizeWrapper>
  );
}
