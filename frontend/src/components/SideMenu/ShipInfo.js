import { useDispatch, useSelector } from "react-redux";
import { isDying } from "../../utils/deadzone";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";

import cl from "./ShipInfo.module.css";
import healthSvg from "../../img/health.svg";
import rangeSvg from "../../img/range.svg";
import actionPtSvg from "../../img/actionPt.svg";

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
import ActionBtnsContainer, {
  DimmableSpan,
} from "./components/ActionBtnsContainer";

export default (function () {
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const {
    avatarString,
    tokenId,
    owner,
    posX: clickedShipX,
    posY: clickedShipY,
    range: clickedShipRange,
    actionPoints,
    health,
  } = useSelector((state) =>
    clickedShipIndex ? state.data.shipDataArray[clickedShipIndex] : {}
  );
  const {
    range: ownerChosenShipRange,
    posX: ownerChosenShipX,
    posY: ownerChosenShipY,
    actionPoints: ownerChosenShipAP,
  } = useSelector((state) =>
    ownerChosenShip !== null ? state.data.shipDataArray[ownerChosenShip] : {}
  );
  const mapLength = useSelector((state) => state.data.mapLength);
  const zoneLength = useSelector((state) => state.data.zoneLength);
  const dispatch = useDispatch();

  /**
   * Data processing
   */
  const isShipDying = isDying(
    clickedShipX,
    clickedShipY,
    mapLength,
    zoneLength
  );
  const isShipAttackable = (function () {
    if (ownerChosenShip === null) return undefined;
    if (ownerChosenShip === clickedShipIndex) return false;
    return (
      Math.abs(clickedShipX - ownerChosenShipX) <= ownerChosenShipRange &&
      Math.abs(clickedShipY - ownerChosenShipY) <= ownerChosenShipRange
    );
  })();

  const chooseMove = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("move"));
  };

  const chooseUpgrade = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("upgrade"));
  };

  const chooseGiveAP = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("giveAP"));
  };

  const chooseAttack = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("attack"));
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
          <SubInfoProp>CAPTAIN</SubInfoProp>
          <SubInfoValue>{owner}</SubInfoValue>
        </SubInfo>
        {health > 0 ? (
          <>
            <SubInfo>
              <SubInfoProp>COORDINATES</SubInfoProp>
              <SubInfoValue>
                ({clickedShipX}, {clickedShipY})
              </SubInfoValue>
            </SubInfo>
            <SubInfo>
              <SubInfoProp>IMPULSE HORIZON</SubInfoProp>
              <SubInfoSvgValue repeats={clickedShipRange} url={rangeSvg} />
            </SubInfo>
            <SubInfo>
              <SubInfoProp>DARK MATTER</SubInfoProp>
              <SubInfoSvgValue repeats={actionPoints} url={actionPtSvg} />
            </SubInfo>
            <SubInfo className={isShipDying ? cl.isDying : ""}>
              <SubInfoProp warning={isShipDying}>STABILIZERS</SubInfoProp>
              <SubInfoSvgValue repeats={health} url={healthSvg} />
            </SubInfo>
          </>
        ) : (
          <SubInfo>
            <SubInfoProp warning>This ship has been destroyed</SubInfoProp>
          </SubInfo>
        )}
      </InfoContainer>

      {health > 0 &&
        ownerChosenShip !== null &&
        (ownerChosenShip === clickedShipIndex ? (
          <ActionBtnsContainer>
            <Button disabled={actionPoints <= 0} onClick={chooseMove}>
              <span className="h3">Move</span>
            </Button>
            <Button
              variant="warning"
              disabled={actionPoints <= 0 || clickedShipRange >= 3}
              onClick={chooseUpgrade}
            >
              <DimmableSpan
                className="h5"
                dim={actionPoints <= 0 || clickedShipRange >= 3}
              >
                Expand Impulse Horizon
              </DimmableSpan>
            </Button>
          </ActionBtnsContainer>
        ) : (
          <ActionBtnsContainer>
            <Button
              variant="success"
              disabled={ownerChosenShipAP <= 0}
              onClick={chooseGiveAP}
            >
              <span className="h4">Teleport Dark Matter</span>
            </Button>
            <Button
              variant="danger"
              disabled={ownerChosenShipAP <= 0 || !isShipAttackable}
              onClick={chooseAttack}
            >
              <span className="h3">Destabilize</span>
            </Button>
          </ActionBtnsContainer>
        ))}
    </MenuContainer>
  );
});
