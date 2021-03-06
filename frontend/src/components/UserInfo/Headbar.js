import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import connect from "../../store/userInfo/connectThunk";
import userInfoSlice from "../../store/userInfo/userInfoSlice";
import cl from "./Headbar.module.css";

export default function Headbar() {
  const { walletAddress, ownerChosenShip } = useSelector(
    (state) => state.userInfo
  );
  const isDataLoaded = useSelector((state) => state.data.isDataLoaded);
  const chosenShipData = useSelector(
    (state) => state.data.shipDataArray[ownerChosenShip]
  );
  const dispatch = useDispatch();

  // Allow connection after data loaded (to prevent error loading the ChossingShip menu), but disable again when an address is connected
  const isConnectable = isDataLoaded && walletAddress === "";

  const handleConnect = () => {
    dispatch(connect());
  };

  const handleChooseShip = () => {
    dispatch(userInfoSlice.actions.chooseShip());
  };

  return (
    <header className={[cl.headbar, "text-light retro-font"].join(" ")}>
      <Button
        variant="dark border"
        onClick={handleConnect}
        disabled={!isConnectable}
      >
        <span className="h3">
          {walletAddress === "" ? "Connect Wallet" : "Connected"}
        </span>
      </Button>

      <Button
        className={cl.shipBtn + " btn-dark"}
        onClick={handleChooseShip}
        disabled={walletAddress === ""}
      >
        {walletAddress !== "" &&
          (ownerChosenShip === null ? (
            <span className={`h1`}>?</span>
          ) : (
            <img src={chosenShipData.avatarString} alt="" />
          ))}
      </Button>

      <span className={`h3 m-0 ${cl.address}`}>{walletAddress}</span>
    </header>
  );
}
