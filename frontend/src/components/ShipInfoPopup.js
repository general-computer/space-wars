import { useDispatch, useSelector } from "react-redux";
import uiSlice from "../store/uiSlice";

import { Button } from "react-bootstrap";
import cl from "./ShipInfoPopup.module.css";
import heartSvg from "../img/noun-heart-pixel-2651784.svg";
import actionPtSvg from "../img/lightning-optimised.svg";

export default (function () {
  const { clickedShipIndex } = useSelector((state) => state.ui);
  const { shipDataArray } = useSelector((state) => state.data);
  const { avatarString, tokenId, owner, posX, posY, actionPoints, health } =
    shipDataArray[clickedShipIndex];
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(uiSlice.actions.clickShip(null));
  };

  return (
    <section className={cl.popup + " retro-font"}>
      <Button variant="light" className={cl.closeBtn} onClick={handleClose}>
        <i className="bi bi-x-lg"></i>
      </Button>
      <div className={cl.imgContainer}>
        <img src={avatarString} alt="" />
      </div>
      <div className={cl.infoContainer}>
        <p className="h3">Ship Id: {tokenId}</p>
        <p className="h3">Owner: {owner}</p>
        <p className="h3">
          Coordinate: ({posX}, {posY})
        </p>
        <p className={cl.actionPt + " h3"}>
          Action points:
          {Array(actionPoints)
            .fill("")
            .map((item, index) => (
              <img src={actionPtSvg} className={cl.actionPtSvg} key={index} />
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
