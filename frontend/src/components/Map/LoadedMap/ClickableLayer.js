import { useSelector, useDispatch } from "react-redux";
import sideMenuSlice from "../../../store/sideMenu/sideMenuSlice";

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

  const clickedShipData = shipDataArray[clickedShipIndex];

  const handleClickInfo = (shipIndex) => {
    dispatch(sideMenuSlice.actions.clickShip(shipIndex));
  };

  return (
    <Grid zIndex={zIndex}>
      {shipDataArray.map(
        (shipData, shipIndex) =>
          // Not showing dead ships!
          shipData.health > 0 && (
            <DummyAvatar
              x={shipData.posX}
              y={shipData.posY}
              id={`cell-${shipData.posX}-${shipData.posY}`}
              onClick={() => {
                handleClickInfo(shipIndex);
              }}
              key={shipIndex}
            />
          )
      )}
      {clickedShipIndex !== null && (
        <ClickedAvatar
          src={clickedShipData.avatarString}
          x={clickedShipData.posX}
          y={clickedShipData.posY}
          isBlink={ownerChosenShip === clickedShipIndex}
          id={`cell-${clickedShipData.posX}-${clickedShipData.posY}`}
        />
      )}
    </Grid>
  );
}
