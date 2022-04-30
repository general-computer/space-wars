import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import styled from "styled-components";
import cl from "./Map.module.css";

const Grid = styled.div`
  background-color: white;
  border: 0.05rem white solid;

  /* Make the whole grid fits its .fuldimWrapper parent */
  width: min(70vw, 70vh);
  height: min(70vw, 70vh);

  display: grid;
  /* "gap" doesn't work well when dimension of the map is large */
  /* gap: 0.1rem; */
  grid-template-columns: repeat(${({ dim }) => dim}, 1fr);
  grid-template-rows: repeat(${({ dim }) => dim}, 1fr);
`;

export default function Map({ data, dim }) {
  return (
    <div className={cl.map}>
      <TransformWrapper>
        <TransformComponent>
          <div className={cl.fuldimWrapper}>
            <Grid dim={dim}>
              {data.map((data, id) => (
                <div
                  className={`${cl.cell} ${data ? cl.hasTank : ""}`}
                  key={id}
                ></div>
              ))}
            </Grid>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
