import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import userAction from "../store/thunks/userActionThunk";
import cl from "./Headbar.module.css";

export default function Headbar() {
  const { walletAddress } = useSelector((state) => state.wallet);
  const { isDataLoaded } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const connect = () => {
    dispatch(userAction({ type: "CONNECT" }));
  };

  return (
    <header className={[cl.headbar, "text-light"].join(" ")}>
      <Button
        variant="dark border"
        onClick={connect}
        // Allow wallet connection after data loaded, but disable again when an address is already detected
        disabled={!isDataLoaded || walletAddress !== ""}
      >
        <span className="retro-font h3">Connect Wallet</span>
      </Button>
      <span className={`retro-font h3 m-0 ${cl.address}`}>{walletAddress}</span>
    </header>
  );
}
