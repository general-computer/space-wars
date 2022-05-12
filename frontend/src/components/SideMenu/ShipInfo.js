import { useDispatch, useSelector } from "react-redux";
import { isDying } from "../../utils/deadzone";
import shipInfoSlice from "../../store/shipInfo/shipInfoSlice";

import cl from "./ShipInfo.module.css";
import heartSvg from "../../img/heart-optimised.svg";
import lightningSvg from "../../img/lightning-optimised.svg";
import swordPtSvg from "../../img/sword-optimised.svg";

import { Button } from "react-bootstrap";
import MenuContainer from "./components/MenuContainer";
import MenuHeader from "./components/MenuHeader";
import ImgContainer from "./components/ImgContainer";
import InfoContainer, {
  SubInfo,
  SubInfoValue,
  SubInfoProp,
  SubInfoSvgValue,
} from "./components/InfoContainer";
import ActionBtnsContainer from "./components/ActionBtnsContainer";

const SvgRepeats = ({ repeats, url }) => {
  return (
    <span className={cl.svgWrapper}>
      {Array(repeats)
        .fill("")
        .map((item, index) => (
          <img src={url} alt="" className={cl.ptsSvg} key={index} />
        ))}
    </span>
  );
};

export default (function () {
  const clickedShipIndex = useSelector(
    (state) => state.shipInfo.clickedShipIndex
  );
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
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const mapLength = useSelector((state) => state.data.mapLength);
  const zoneLength = useSelector((state) => state.data.zoneLength);
  const dispatch = useDispatch();

  const isShipDying = isDying(posX, posY, mapLength, zoneLength);

  // "rangeLevel" here is +1 of "level" from the contract
  const rangeLevel = level + 1;

  const chooseMove = () => {
    dispatch(shipInfoSlice.actions.chooseAction("move"));
  };

  const chooseUpgrade = () => {
    dispatch(shipInfoSlice.actions.chooseAction("upgrade"));
  };

  return (
    <MenuContainer>
      <MenuHeader>Ship Info</MenuHeader>
      <ImgContainer src={avatarString} />
      <InfoContainer>
        <SubInfo>
          <SubInfoProp>ID</SubInfoProp>
          <SubInfoValue>{tokenId}</SubInfoValue>
        </SubInfo>
        <SubInfo>
          <SubInfoProp className={cl.addr}>CAPTAIN</SubInfoProp>
          <SubInfoValue className={cl.clipOverflow}>{owner}</SubInfoValue>
        </SubInfo>
        {health <= 0 ? (
          <SubInfo>
            <SubInfoProp className={cl.warningText}>
              This ship has been destroyed
            </SubInfoProp>
          </SubInfo>
        ) : (
          <>
            <SubInfo>
              <SubInfoProp>COORDINATES</SubInfoProp>
              <SubInfoValue>
                ({posX}, {posY})
              </SubInfoValue>
            </SubInfo>
            <SubInfo>
              <SubInfoProp>IMPULSE HORIZON</SubInfoProp>
              <SubInfoSvgValue repeats={rangeLevel} url={swordPtSvg} />
            </SubInfo>
            <SubInfo>
              <SubInfoProp>DARK MATTER</SubInfoProp>
              <SubInfoSvgValue repeats={actionPoints} url={lightningSvg} />
            </SubInfo>
            <SubInfo className={isShipDying ? cl.isDying : ""}>
              <SubInfoProp>STABILIZER</SubInfoProp>
              <SubInfoSvgValue repeats={health} url={heartSvg} />
            </SubInfo>
          </>
        )}
      </InfoContainer>

      {ownerChosenShip === clickedShipIndex && health > 0 && (
        <ActionBtnsContainer>
          <Button>
            <span className="h3" onClick={chooseMove}>
              Move
            </span>
          </Button>
          <Button variant="success" onClick={chooseUpgrade}>
            <span className="h5">Expand Impulse Horizon</span>
          </Button>
        </ActionBtnsContainer>
      )}
    </MenuContainer>
  );
});
