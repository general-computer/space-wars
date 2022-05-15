import { useSelector } from "react-redux";

import Grid from "../components/Grid";
import { BlinkableAvatar } from "../components/BlinkableAvatar";

export default function AvatarLayer({ zIndex }) {
  const shipDataArray = useSelector((state) => state.data.shipDataArray);
  const ownerChosenShip = useSelector(
    (state) => state.userInfo.ownerChosenShip
  );

  return (
    <Grid zIndex={zIndex}>
      {shipDataArray.map(
        (shipData, shipIndex) =>
          // Not showing dead ships!
          shipData.health > 0 && (
            <BlinkableAvatar
              src={shipData.avatarString}
              x={shipData.posX}
              y={shipData.posY}
              isBlink={ownerChosenShip === shipIndex}
              key={shipIndex}
            />
          )
      )}
    </Grid>
  );
}
