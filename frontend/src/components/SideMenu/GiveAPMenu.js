import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";
import confirmAction from "../../store/sideMenu/confirmActionThunk";

import styled from "styled-components/macro";
import { Button } from "react-bootstrap";

import actionPtSvg from "../../img/actionPt.svg";

import MenuContainer from "./components/MenuContainer";
import MenuHeader from "./components/MenuHeader";
import ImgContainer from "./components/ImgContainer";
import InfoContainer, {
  SubInfo,
  SubInfoProp,
  SubInfoSvgValue,
} from "./components/InfoContainer";
import ActionBtnsContainer from "./components/ActionBtnsContainer";

const StyledMenuContainer = styled(MenuContainer)`
  background-color: rgb(28 155 46);
  color: white;
`;

export default function GiveAPMenu() {
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const mockAPIncr = useSelector((state) => state.sideMenu.mockAPIncr);
  const {
    avatarString,
    tokenId: targetTokenId,
    actionPoints: targetAP,
  } = useSelector((state) => state.data.shipDataArray[clickedShipIndex]);
  const { tokenId: ocsTokenId, actionPoints: ownerChosenShipAP } = useSelector(
    (state) => state.data.shipDataArray[ownerChosenShip]
  );
  const dispatch = useDispatch();

  /**
   * Data processing
   */
  const mockOwnerFinalAP = ownerChosenShipAP - mockAPIncr;

  const tryGiveAP = () => {
    dispatch(sideMenuSlice.actions.tryGiveAP());
  };
  const tryRevertGiveAP = () => {
    dispatch(sideMenuSlice.actions.tryRevertGiveAP());
  };

  const goBack = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("info"));
  };

  const confirm = () => {
    dispatch(
      confirmAction("giveAP", {
        from: ocsTokenId,
        to: targetTokenId,
        amount: mockAPIncr,
      })
    );
  };

  return (
    <StyledMenuContainer>
      <MenuHeader>Teleport</MenuHeader>
      <ImgContainer src={avatarString}></ImgContainer>
      <InfoContainer>
        <SubInfo>
          <SubInfoProp>TARGET SHIP</SubInfoProp>
          <SubInfoSvgValue repeats={targetAP + mockAPIncr} url={actionPtSvg} />
        </SubInfo>
        <SubInfo>
          <SubInfoProp style={{ color: "black" }}>YOUR SHIP</SubInfoProp>
          <SubInfoSvgValue repeats={mockOwnerFinalAP} url={actionPtSvg} />
        </SubInfo>
      </InfoContainer>

      <Button
        variant="warning"
        disabled={mockOwnerFinalAP <= 0}
        onClick={tryGiveAP}
      >
        <span className="h3">Give Dark Matter</span>
      </Button>
      <Button
        variant="outline-light"
        disabled={mockAPIncr <= 0}
        onClick={tryRevertGiveAP}
      >
        <span className="h3">Revert</span>
      </Button>

      <ActionBtnsContainer>
        <Button variant="outline-light" onClick={goBack}>
          <span className="h5">Back to Ship Info</span>
        </Button>
        <Button
          variant="secondary"
          disabled={mockAPIncr <= 0}
          onClick={confirm}
        >
          <span className="h4">Confirm Teleportation</span>
        </Button>
      </ActionBtnsContainer>
    </StyledMenuContainer>
  );
}
