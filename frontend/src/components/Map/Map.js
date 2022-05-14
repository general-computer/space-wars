import { useSelector } from "react-redux";
import styled from "styled-components/macro";

import LoadingMap from "./LoadingMap";
import LoadedMap from "./LoadedMap/LoadedMap";

const Map = styled.section`
  --map-width: 90vw;
  --map-height: 75vh;
  border: 0.1rem cyan solid;
  width: var(--map-width);
  height: var(--map-height);
  margin: 5vh 0;
  /* To make the grid inside not overflowing */
  box-sizing: content-box;
`;

export default (function () {
  const isDataLoaded = useSelector((state) => state.data.isDataLoaded);

  return <Map>{isDataLoaded ? <LoadedMap /> : <LoadingMap />}</Map>;
});
