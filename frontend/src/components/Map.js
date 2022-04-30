import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import cl from "./Map.module.css";

export default function Map({ data }) {
  return (
    <div className={cl.map}>
      <TransformWrapper>
        <TransformComponent>
          <div className={cl.fullSizeWrapper}>
            <div className={cl.grid}>
              {data.map((data) => (
                <div className={`${cl.cell} ${data ? cl.hasTank : ""}`}></div>
              ))}
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
