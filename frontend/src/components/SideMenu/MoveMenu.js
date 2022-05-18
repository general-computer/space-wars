import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";
import { filterAliveShips } from "../../utils/shipFilters";

import cl from "./MoveMenu.module.css";
import actionPtSvg from "../../img/actionPt.svg";

import { Button } from "react-bootstrap";
import MenuContainer from "./components/MenuContainer";
import MenuHeader from "./components/MenuHeader";
import ImgContainer from "./components/ImgContainer";
import InfoContainer, {
  SubInfo,
  SubInfoProp,
  SubInfoSvgValue,
} from "./components/InfoContainer";
import ActionBtnsContainer from "./components/ActionBtnsContainer";
import NavigationPanel from "./components/NavigationPanel";

export default (function () {
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const mapLength = useSelector((state) => state.data.mapLength);
  const shipDataArray = useSelector((state) => state.data.shipDataArray);
  const { transX, transY } = useSelector((state) => state.sideMenu.mockMoves);
  const dispatch = useDispatch();

  /**
   * Data processing
   */
  const {
    avatarString,
    actionPoints,
    posX: clickedShipX,
    posY: clickedShipY,
  } = shipDataArray[clickedShipIndex];
  const aliveShipsData = filterAliveShips(shipDataArray);
  // Calculate how many moves it takes to translate
  const moves = Math.max(Math.abs(transX), Math.abs(transY));
  //
  const translatedX = clickedShipX + transX;
  const translatedY = clickedShipY + transY;
  const inRangeEnemyShipsXY = aliveShipsData
    .filter((shipData) => shipData.shipIndex !== clickedShipIndex)
    .filter(
      (enemyShipData) =>
        Math.abs(enemyShipData.posX - clickedShipX) <= actionPoints &&
        Math.abs(enemyShipData.posY - clickedShipY) <= actionPoints
    )
    .map((inRangeShipData) => ({
      x: inRangeShipData.posX,
      y: inRangeShipData.posY,
    }));
  // Criteria that disables moves
  const outOfAP = moves > actionPoints;
  const outOfMap =
    translatedX < 0 ||
    translatedY < 0 ||
    translatedX > mapLength - 1 ||
    translatedY > mapLength - 1;
  const clashEnemyShips = inRangeEnemyShipsXY.some(
    (enemyXY) => enemyXY.x === translatedX && enemyXY.y === translatedY
  );
  const isMoveDisabled =
    (transX === 0 && transY === 0) || outOfAP || outOfMap || clashEnemyShips;

  const goBack = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("info"));
  };

  return (
    <MenuContainer className={cl.moveMenu}>
      <MenuHeader>Move</MenuHeader>
      <ImgContainer src={avatarString}></ImgContainer>
      <InfoContainer>
        {outOfMap && (
          <SubInfo>
            <SubInfoProp className={cl.warningText}>
              Out of map boundary
            </SubInfoProp>
          </SubInfo>
        )}
        {clashEnemyShips && (
          <SubInfo>
            <SubInfoProp className={cl.warningText}>
              Can't move to existing ships
            </SubInfoProp>
          </SubInfo>
        )}
        {outOfAP ? (
          <SubInfo>
            <SubInfoProp className={cl.warningText}>
              Not enough dark matter
            </SubInfoProp>
          </SubInfo>
        ) : (
          <SubInfo>
            <SubInfoProp>DARK MATTER</SubInfoProp>
            <SubInfoSvgValue repeats={actionPoints - moves} url={actionPtSvg} />
          </SubInfo>
        )}
      </InfoContainer>
      <NavigationPanel />
      <ActionBtnsContainer>
        <Button variant="outline-light" onClick={goBack}>
          <span className="h5">Back to Ship Info</span>
        </Button>
        <Button variant="light" disabled={isMoveDisabled}>
          <span
            className={[isMoveDisabled ? cl.disabledText : "", "h3"].join(" ")}
          >
            Confirm Move
          </span>
        </Button>
      </ActionBtnsContainer>
    </MenuContainer>
  );
});
