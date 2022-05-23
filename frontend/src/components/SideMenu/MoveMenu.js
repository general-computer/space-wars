import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";
import { moveCheck } from "../../utils/moveCheck";
import confirmAction from "../../store/sideMenu/confirmActionThunk";

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
    moves,
    translatedX,
    translatedY,
    outOfAP,
    outOfMap,
    clashEnemyShips,
    isMoveAllowed,
  } = moveCheck({
    shipDataArray,
    clickedShipIndex,
    transX,
    transY,
    mapLength,
  });
  const { avatarString, actionPoints, tokenId } =
    shipDataArray[clickedShipIndex];

  const goBack = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("info"));
  };

  const confirm = () => {
    // **** Dispatch single transaction for multiple move steps later!
    if (moves > 1) {
      alert(
        "Mulitple moves in one go is disabled for now. Please make moves of one block each time."
      );
      throw new Error("confirmMove: multiple moves not allowed at the moment");
    }
    dispatch(confirmAction("move", { tokenId, translatedX, translatedY }));
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
        <Button variant="light" disabled={isMoveAllowed} onClick={confirm}>
          <span
            className={[isMoveAllowed ? cl.disabledText : "", "h3"].join(" ")}
          >
            Confirm Move
          </span>
        </Button>
      </ActionBtnsContainer>
    </MenuContainer>
  );
});
