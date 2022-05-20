import { useSelector } from "react-redux";
import styled from "styled-components/macro";

import LoadingMap from "./LoadingMap";
import LoadedMap from "./LoadedMap/LoadedMap";

// Map container
const MapCtn = styled.main`
  flex-grow: 1;
  padding: min(5vw, 5vh);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapInner = styled.div`
  border: 0.1rem cyan solid;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Map() {
  const isDataLoaded = useSelector((state) => state.data.isDataLoaded);

  return (
    <MapCtn>
      <MapInner>{isDataLoaded ? <LoadedMap /> : <LoadingMap />}</MapInner>
    </MapCtn>
  );
}
