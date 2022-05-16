import styled from "styled-components/macro";

export default styled.div`
  /* border: 0.05rem white solid; */

  /* Make the grid area a square that is always contained by its FullSizeWrapper parent */
  width: min(var(--map-width), var(--map-height));
  height: min(var(--map-width), var(--map-height));

  /* enables position: absolute for children layers*/
  position: relative;
`;
