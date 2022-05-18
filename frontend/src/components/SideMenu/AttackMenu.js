import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";

import styled from "styled-components/macro";
import { Button } from "react-bootstrap";

import actionPtSvg from "../../img/actionPt.svg";
import healthSvg from "../../img/health.svg";

import MenuContainer from "./components/MenuContainer";
import MenuHeader from "./components/MenuHeader";
import ImgContainer from "./components/ImgContainer";
import InfoContainer, {
  SubInfo,
  SubInfoProp,
  SubInfoValue,
  SubInfoSvgValue,
} from "./components/InfoContainer";
import ActionBtnsContainer, {
  DimmableSpan,
} from "./components/ActionBtnsContainer";

const StyledMenuContainer = styled(MenuContainer)`
  background-color: rgb(210 49 49);
  color: white;
`;

export default function AttackMenu() {
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const mockHits = useSelector((state) => state.sideMenu.mockHits);
  const {
    avatarString,
    tokenId,
    owner,
    health: targetHealth,
  } = useSelector((state) => state.data.shipDataArray[clickedShipIndex]);
  const { actionPoints: ownerChosenShipAP } = useSelector(
    (state) => state.data.shipDataArray[ownerChosenShip]
  );
  const dispatch = useDispatch();

  /**
   * Data processing
   */
  const mockTargetFinalHealth = targetHealth - mockHits;
  const ownerRemainingAP = ownerChosenShipAP - mockHits;

  const tryHit = () => {
    dispatch(sideMenuSlice.actions.tryHit());
  };
  const tryRevertHit = () => {
    dispatch(sideMenuSlice.actions.tryRevertHit());
  };

  const goBack = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("info"));
  };

  return (
    <StyledMenuContainer>
      <MenuHeader>Destabilize</MenuHeader>
      <ImgContainer src={avatarString}></ImgContainer>
      <InfoContainer>
        <SubInfo>
          <SubInfoProp>ID</SubInfoProp>
          <SubInfoValue>{tokenId}</SubInfoValue>
        </SubInfo>
        <SubInfo>
          <SubInfoProp>CAPTAIN</SubInfoProp>
          <SubInfoValue clipOverflow>{owner}</SubInfoValue>
        </SubInfo>
        <SubInfo>
          <SubInfoProp>TARGET'S STABILIZERS</SubInfoProp>
          <SubInfoSvgValue repeats={mockTargetFinalHealth} url={healthSvg} />
        </SubInfo>
        <SubInfo>
          <SubInfoProp style={{ color: "black" }}>YOUR DARK MATTER</SubInfoProp>
          <SubInfoSvgValue repeats={ownerRemainingAP} url={actionPtSvg} />
        </SubInfo>
      </InfoContainer>

      <Button
        variant="dark"
        disabled={mockTargetFinalHealth <= 0 || ownerRemainingAP <= 0}
        onClick={tryHit}
      >
        <span className="h3">Destabilize</span>
      </Button>
      <Button
        variant="outline-light"
        disabled={mockHits <= 0}
        onClick={tryRevertHit}
      >
        <span className="h3">Revert</span>
      </Button>

      <ActionBtnsContainer>
        <Button variant="outline-light" onClick={goBack}>
          <span className="h5">Back to Ship Info</span>
        </Button>
        <Button variant="light" disabled={mockHits <= 0}>
          <DimmableSpan className="h4" dim={mockHits <= 0}>
            Confirm Destabilization
          </DimmableSpan>
        </Button>
      </ActionBtnsContainer>
    </StyledMenuContainer>
  );
}
