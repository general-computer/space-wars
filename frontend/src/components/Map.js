import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from "styled-components";
import cl from "./Map.module.css";

const Grid = styled.div`
  background-color: white;
  border: 0.05rem white solid;

  /* Make the whole grid fits its .fullSizeWrapper parent */
  width: min(70vw, 70vh);
  height: min(70vw, 70vh);

  display: grid;
  /* "gap" doesn't work well when dimension of the map is large */
  /* gap: 0.1rem; */
  grid-template-columns: repeat(${({ len }) => len}, 1fr);
  grid-template-rows: repeat(${({ len }) => len}, 1fr);
`;

export default function Map({ data, len }) {
  // An empty len*len array for rendering the map
  const cellArray = (function () {
    const yxArray = [];
    for (let y = 0; y < len; y++) {
      const yArray = [];
      for (let x = 0; x < len; x++) {
        yArray.push(0);
      }
      yxArray.push(yArray);
    }
    return yxArray;
  })();

  // Filling in cellArray with data
  for (const spaceship of data) {
    const [x, y] = spaceship;
    console.log(x, y);
    cellArray[y][x] = 1;
  }

  return (
    <div className={cl.map}>
      <TransformWrapper>
        <TransformComponent>
          <div className={cl.fullSizeWrapper}>
            <Grid len={len}>
              {cellArray.map((yArray) =>
                yArray.map((data, id) => (
                  <div
                    className={`${cl.cell} ${data === 1 ? cl.hasTank : ""}`}
                    key={id}
                  ></div>
                ))
              )}
            </Grid>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
