import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";

import styled from "styled-components/macro";
import { Button } from "react-bootstrap";

import swordPtSvg from "../../img/sword-optimised.svg";
import lightningSvg from "../../img/lightning-optimised.svg";

import MenuContainer from "./components/MenuContainer";
import MenuHeader from "./components/MenuHeader";
import ImgContainer from "./components/ImgContainer";
import InfoContainer, {
  SubInfo,
  SubInfoProp,
  SubInfoValue,
  SubInfoSvgValue,
} from "./components/InfoContainer";
import ActionBtnsContainer from "./components/ActionBtnsContainer";

const StyledMenuContainer = styled(MenuContainer)`
  background-color: rgb(35 144 71);
  color: white;
`;

export default function UpgradeMenu() {
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const { avatarString, range, actionPoints } = useSelector(
    (state) => state.data.shipDataArray[clickedShipIndex]
  );
  const dispatch = useDispatch();

  const goBack = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("info"));
  };

  return (
    <StyledMenuContainer>
      <MenuHeader>Expand</MenuHeader>
      <ImgContainer src={avatarString}></ImgContainer>
      <InfoContainer>
        <SubInfo>
          <SubInfoProp>IMPULSE HORIZON</SubInfoProp>
          <SubInfoSvgValue repeats={range} url={swordPtSvg} />
        </SubInfo>
        <SubInfo>
          <SubInfoProp>DARK MATTER</SubInfoProp>
          <SubInfoSvgValue repeats={actionPoints} url={lightningSvg} />
        </SubInfo>
      </InfoContainer>
      <ActionBtnsContainer>
        <Button variant="outline-light" onClick={goBack}>
          <span className="h5">Back to Ship Info</span>
        </Button>
        <Button variant="light">
          <span className="h4">Confirm Expansion</span>
        </Button>
      </ActionBtnsContainer>
    </StyledMenuContainer>
  );
}
