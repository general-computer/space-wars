import { useDispatch, useSelector } from "react-redux";
import mapSlice from "../../store/map/mapSlice";
import cl from "./Cell.module.css";

export default function Cell({ shipIndex, isDying, x, y }) {
  const dispatch = useDispatch();
  const shipData = useSelector((state) => state.data.shipDataArray[shipIndex]);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const walletAddr = useSelector((state) => state.userInfo.walletAddress);

  // Props processing
  const hasShip = shipIndex !== null;
  const isOwnerChosenShip =
    walletAddr !== "" && hasShip && ownerChosenShip === shipIndex;

  const handleClickInfo = () => {
    if (shipIndex !== null) dispatch(mapSlice.actions.clickShip(shipIndex));
  };

  return (
    <div
      className={[
        cl.cell,
        hasShip ? cl.hasShip : "",
        isOwnerChosenShip ? cl.isActiveShip : "",
      ].join(" ")}
      id={`cell-${x}-${y}`}
      onClick={handleClickInfo}
    >
      {/* Only render an img when there is a spaceship */}
      {hasShip && (
        <img className={cl.shipImg} src={shipData.avatarString} alt="" />
      )}
      {/* Only render red shadow if the cell is in the dying zone */}
      {isDying && <div className={cl.isDying}></div>}
    </div>
  );
}
