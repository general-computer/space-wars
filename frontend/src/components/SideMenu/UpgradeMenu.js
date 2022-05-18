import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";

import styled from "styled-components/macro";
import { Button } from "react-bootstrap";

import rangeSvg from "../../img/range.svg";

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
  background-color: rgb(255 200 0);
`;

export default function UpgradeMenu() {
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const mockRangeIncr = useSelector((state) => state.sideMenu.mockRangeIncr);
  const {
    avatarString,
    range: currRange,
    actionPoints,
  } = useSelector((state) => state.data.shipDataArray[clickedShipIndex]);
  const dispatch = useDispatch();

  const tryUpgrade = () => {
    dispatch(sideMenuSlice.actions.tryUpgrade({ currRange }));
  };
  const tryRevertUpgrade = () => {
    dispatch(sideMenuSlice.actions.tryRevertUpgrade());
  };

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
          <SubInfoSvgValue repeats={currRange + mockRangeIncr} url={rangeSvg} />
        </SubInfo>
        <SubInfo>
          <SubInfoProp>DARK MATTER</SubInfoProp>
          <SubInfoSvgValue
            repeats={actionPoints - mockRangeIncr}
            url={actionPtSvg}
          />
        </SubInfo>
      </InfoContainer>

      <Button
        variant="dark"
        disabled={currRange + mockRangeIncr >= 3}
        onClick={tryUpgrade}
      >
        <span className="h3">Expand</span>
      </Button>
      <Button
        variant="light"
        disabled={mockRangeIncr <= 0}
        onClick={tryRevertUpgrade}
      >
        <span className="h3">Revert</span>
      </Button>

      <ActionBtnsContainer>
        <Button variant="outline-dark" onClick={goBack}>
          <span className="h5">Back to Ship Info</span>
        </Button>
        <Button variant="dark" disabled={mockRangeIncr <= 0}>
          <span className="h4">Confirm Expansion</span>
        </Button>
      </ActionBtnsContainer>
    </StyledMenuContainer>
  );
}
