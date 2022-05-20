import styled from "styled-components/macro";

const LayersWrapper = styled.div`
  border: 1px white solid;
  box-sizing: content-box;

  /* Make the grid area a square inside the TransformComponent */
  /* !!! Setting width & height to % units will drastically slow down zooming */
  /* !!! Setting width & height to big values will push everything outside the page */
  /* !!! If it is too small, or does not yield an integer after divided by "mapLength" then the cells may look distorted */
  --grid-length: 70vmin;
  width: var(--grid-length);
  height: var(--grid-length);

  /* enables position: absolute for children layers*/
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LayersWrapper;
