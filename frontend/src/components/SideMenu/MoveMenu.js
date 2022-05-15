import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../store/sideMenu/sideMenuSlice";

import cl from "./MoveMenu.module.css";
import lightningSvg from "../../img/lightning-optimised.svg";

import { Button } from "react-bootstrap";
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

export default (function () {
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
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
  const dispatch = useDispatch();

  const goBack = () => {
    dispatch(sideMenuSlice.actions.chooseMenuType("info"));
  };

  return (
    <MenuContainer className={cl.moveMenu}>
      <MenuHeader>Move</MenuHeader>
      <ImgContainer src={avatarString}></ImgContainer>
      <InfoContainer>
        <SubInfo>
          <SubInfoProp>COORDINATES</SubInfoProp>
          <SubInfoValue>
            ({posX}, {posY})
          </SubInfoValue>
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
      </ActionBtnsContainer>
    </MenuContainer>
  );
});
