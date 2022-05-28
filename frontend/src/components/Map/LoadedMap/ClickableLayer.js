import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../../store/sideMenu/sideMenuSlice";
import { filterAliveShips } from "../../../utils/shipFilters";

import styled from "styled-components/macro";
import Grid from "../components/Grid";
import { Avatar } from "../components/Avatar";
import { BlinkableAvatar } from "../components/BlinkableAvatar";

const DummyAvatar = styled(Avatar)`
  background-image: none;
  cursor: pointer;
`;

const ClickedAvatar = styled(BlinkableAvatar)`
  cursor: pointer;
`;

export default function ClickableLayer({ zIndex }) {
  const shipDataArray = useSelector((state) => state.data.shipDataArray);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const dispatch = useDispatch();

  const aliveShipsData = filterAliveShips(shipDataArray);

  const clickedShipData =
    clickedShipIndex === null
      ? []
      : aliveShipsData.filter(
          (shipData) => shipData.shipIndex === clickedShipIndex
        );

  const handleClickInfo = (shipIndex) => {
    dispatch(sideMenuSlice.actions.clickShip(shipIndex));
  };

  return (
    <Grid zIndex={zIndex}>
      {aliveShipsData.map((shipData) => (
        <DummyAvatar
          x={shipData.posX}
          y={shipData.posY}
          id={`cell-${shipData.posX}-${shipData.posY}`}
          onClick={() => {
            handleClickInfo(shipData.shipIndex);
          }}
          key={shipData.shipIndex}
        />
      ))}
      {clickedShipData.map((shipData) => (
        <ClickedAvatar
          src={shipData.avatarString}
          x={shipData.posX}
          y={shipData.posY}
          isBlink={ownerChosenShip === clickedShipIndex}
          id={`cell-${shipData.posX}-${shipData.posY}`}
          key={shipData.shipIndex}
        />
      ))}
    </Grid>
  );
}
