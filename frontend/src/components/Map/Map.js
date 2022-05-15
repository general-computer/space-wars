import { useSelector } from "react-redux";
import styled from "styled-components/macro";

import LoadingMap from "./LoadingMap";
import LoadedMap from "./LoadedMap/LoadedMap";

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

  return <StyledMap>{isDataLoaded ? <LoadedMap /> : <LoadingMap />}</StyledMap>;
}
