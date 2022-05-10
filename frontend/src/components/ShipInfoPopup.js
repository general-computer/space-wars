import { useDispatch, useSelector } from "react-redux";
import mapSlice from "../store/map/mapSlice";
import { isDying } from "../utils/deadzone";

import CloseButton from "./CloseButton";
import cl from "./ShipInfoPopup.module.css";
import heartSvg from "../img/heart-optimised.svg";
import lightningSvg from "../img/lightning-optimised.svg";
import swordPtSvg from "../img/sword-optimised.svg";

const SvgRepeats = ({ repeats, url }) => {
  return (
    <>
      {Array(repeats)
        .fill("")
        .map((item, index) => (
          <img src={url} alt="" className={cl.ptsSvg} key={index} />
        ))}
    </>
  );
};

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
  const mapLength = useSelector((state) => state.data.mapLength);
  const zoneLength = useSelector((state) => state.data.zoneLength);
  const dispatch = useDispatch();

  const isShipDying = isDying(posX, posY, mapLength, zoneLength);

  // "rangeLevel" here is +1 of "level" from the contract
  const rangeLevel = level + 1;

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
          <p className={cl.addrText + " h3"}>Owner: {owner}</p>
          {health <= 0 ? (
            <p className={cl.warningText + " h3"}>
              This ship has been destroyed
            </p>
          ) : (
            <>
              <p className="h3">
                Coordinate: ({posX}, {posY})
              </p>
              <p className={cl.pointsCtn + " h3"}>
                Level:
                <SvgRepeats repeats={rangeLevel} url={swordPtSvg} />
              </p>
              <p className={cl.pointsCtn + " h3"}>
                Energy points:
                <SvgRepeats repeats={actionPoints} url={lightningSvg} />
              </p>
              <p
                className={[
                  cl.pointsCtn,
                  isShipDying ? cl.isDying : "",
                  "h3",
                ].join(" ")}
              >
                Shield:
                <SvgRepeats repeats={health} url={heartSvg} />
              </p>
              {isShipDying && (
                <p className={cl.warningText + " h3"}>
                  Being attacked by magnetosonic wave
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
});
