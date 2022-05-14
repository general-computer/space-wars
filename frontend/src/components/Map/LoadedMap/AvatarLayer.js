import { useSelector, useDispatch } from "react-redux";
import shipInfoSlice from "../../../store/shipInfo/shipInfoSlice";

import styled from "styled-components/macro";
import Grid from "../components/Grid";

const Avatar = styled.div`
  /***** background-color is for testing only; will change when real spacehip avatars are available */
  background-color: black;
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  grid-column: ${(props) => props.x + 1};
  grid-row: ${(props) => props.y + 1};

  cursor: pointer;

  animation: ${(props) =>
    props.isOwnerChosen ? "blinkShip 2s steps(1) infinite" : "none"};

  @keyframes blinkShip {
    from {
      filter: none;
    }
    50% {
      filter: invert(100%);
    }
  }
`;

export default (function ({ zIndex }) {
  const shipDataArray = useSelector((state) => state.data.shipDataArray);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );
  const dispatch = useDispatch();

  const handleClickInfo = (shipIndex) => {
    dispatch(shipInfoSlice.actions.clickShip(shipIndex));
  };

  return (
    <Grid zIndex={zIndex}>
      {shipDataArray.map(
        (shipData, shipIndex) =>
          // Not showing dead ships!
          shipData.health > 0 && (
            <Avatar
              src={shipData.avatarString}
              x={shipData.posX}
              y={shipData.posY}
              id={`cell-${shipData.posX}-${shipData.posY}`}
              isOwnerChosen={ownerChosenShip === shipIndex}
              onClick={() => {
                handleClickInfo(shipIndex);
              }}
              key={shipIndex}
            />
          )
      )}
    </Grid>
  );
});
