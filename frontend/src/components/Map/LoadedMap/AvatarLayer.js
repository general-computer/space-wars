import { useSelector } from "react-redux";

import Grid from "../components/Grid";
import { BlinkableAvatar } from "../components/BlinkableAvatar";

export default function AvatarLayer({ zIndex }) {
  const shipDataArray = useSelector((state) => state.data.shipDataArray);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );

  const aliveShipsData = [];
  shipDataArray.forEach((shipData, shipIndex) => {
    if (shipData.health > 0) aliveShipsData.push({ ...shipData, shipIndex });
  });

  return (
    <Grid zIndex={zIndex}>
      {aliveShipsData.map((shipData) => (
        <BlinkableAvatar
          src={shipData.avatarString}
          x={shipData.posX}
          y={shipData.posY}
          isBlink={shipData.shipIndex === ownerChosenShip}
          key={shipData.shipIndex}
        />
      ))}
    </Grid>
  );
}
