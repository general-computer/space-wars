import { useSelector } from "react-redux";
import styled from "styled-components/macro";

import LoadingMap from "./LoadingMap";
import LoadedMap from "./LoadedMap/LoadedMap";
import { useRef } from "react";

const StyledMap = styled.main`
  flex-grow: 1;
  border: 0.1rem cyan solid;
  margin: min(5vw, 5vh);

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Map() {
  const isDataLoaded = useSelector((state) => state.data.isDataLoaded);

  // **** Alternative way to set map width; still on testing
  const mapRef = useRef(null);
  /* if (mapRef.current !== null)
    window.mapWidth = getComputedStyle(mapRef.current).width; */

  return (
    <StyledMap ref={mapRef}>
      {isDataLoaded ? <LoadedMap /> : <LoadingMap />}
    </StyledMap>
  );
}
