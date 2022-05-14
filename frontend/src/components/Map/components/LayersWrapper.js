import styled from "styled-components/macro";

export default styled.div`
  /* background-color: black; */
  border: 0.05rem white solid;

  /* Make the whole grid fits its FullSizeWrapper parent */
  width: min(var(--map-width), var(--map-height));
  height: min(var(--map-width), var(--map-height));

  /* enables position: absolute for children layers*/
  position: relative;
`;
