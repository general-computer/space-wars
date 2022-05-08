import { useDispatch, useSelector } from "react-redux";
import mapSlice from "../store/map/mapSlice";

import { CloseButton } from "react-bootstrap";
import cl from "./ShipInfoPopup.module.css";
import heartSvg from "../img/noun-heart-pixel-2651784.svg";
import actionPtSvg from "../img/lightning-optimised.svg";

export default (function () {
  const clickedShipIndex = useSelector((state) => state.map.clickedShipIndex);
  const { avatarString, tokenId, owner, posX, posY, actionPoints, health } =
    useSelector((state) => state.data.shipDataArray[clickedShipIndex]);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(mapSlice.actions.clickShip(null));
  };

  return (
    <section className={cl.popup + " retro-font"}>
      <h1>Ship Info</h1>
      <CloseButton className={cl.closeBtn + " p-3"} onClick={handleClose} />
      <div className={cl.imgContainer}>
        <img src={avatarString} alt="" />
      </div>
      <div className={cl.infoContainer}>
        <p className="h3">Token Id: {tokenId}</p>
        <p className="h3">Owner: {owner}</p>
        <p className="h3">
          Coordinate: ({posX}, {posY})
        </p>
        <p className={cl.actionPt + " h3"}>
          Action points:
          {Array(actionPoints)
            .fill("")
            .map((item, index) => (
              <img
                src={actionPtSvg}
                alt=""
                className={cl.actionPtSvg}
                key={index}
              />
            ))}
        </p>

        <p className={cl.health + " h3"}>
          Health:
          {Array(health)
            .fill("")
            .map((item, index) => (
              <img src={heartSvg} className={cl.healthSvg} key={index} />
            ))}
        </p>
      </div>
    </section>
  );
});
