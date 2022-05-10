import { useDispatch, useSelector } from "react-redux";
import mapSlice from "../store/map/mapSlice";

import CloseButton from "./CloseButton";
import cl from "./ShipInfoPopup.module.css";
import heartSvg from "../img/heart-optimised.svg";
import lightningSvg from "../img/lightning-optimised.svg";
import swordPtSvg from "../img/sword-optimised.svg";

export default (function () {
  const clickedShipIndex = useSelector((state) => state.map.clickedShipIndex);
  const {
    avatarString,
    tokenId,
    owner,
    posX,
    posY,
    level,
    actionPoints,
    health,
  } = useSelector((state) => state.data.shipDataArray[clickedShipIndex]);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(mapSlice.actions.clickShip(null));
  };

  return (
    <section className={cl.popup + " retro-font"}>
      <CloseButton className={cl.closeBtn} onClick={handleClose} />
      <h1>Ship Info</h1>
      <div className={cl.popupBody}>
        <div className={cl.imgContainer}>
          <img src={avatarString} alt="" />
        </div>
        <div className={cl.infoContainer}>
          <p className="h3">Token Id: {tokenId}</p>
          <p className="h3">Owner: {owner}</p>
          <p className="h3">
            Coordinate: ({posX}, {posY})
          </p>
          <p className={cl.pointsCtn + " h3"}>
            Level:
            {Array(level)
              .fill("")
              .map((item, index) => (
                <img
                  src={swordPtSvg}
                  alt=""
                  className={cl.ptsSvg}
                  key={index}
                />
              ))}
          </p>
          <p className={cl.pointsCtn + " h3"}>
            Action points:
            {Array(actionPoints)
              .fill("")
              .map((item, index) => (
                <img
                  src={lightningSvg}
                  alt=""
                  className={cl.ptsSvg}
                  key={index}
                />
              ))}
          </p>

          <p className={cl.pointsCtn + " h3"}>
            Health:
            {Array(health)
              .fill("")
              .map((item, index) => (
                <img src={heartSvg} alt="" className={cl.ptsSvg} key={index} />
              ))}
          </p>
        </div>
      </div>
    </section>
  );
});
