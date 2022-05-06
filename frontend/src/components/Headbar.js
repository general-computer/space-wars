import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import userAction from "../store/thunks/userActionThunk";
import cl from "./Headbar.module.css";

export default function Headbar() {
  const { isConnected, walletAddress } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  const connect = () => {
    dispatch(userAction({ type: "CONNECT" }));
  };

  return (
    <header className={[cl.headbar, "text-light"].join(" ")}>
      <Button variant="dark border" onClick={connect} disabled={isConnected}>
        <span className="retro-font h3">Connect Wallet</span>
      </Button>
      <span className={`retro-font h3 m-0 ${cl.address}`}>{walletAddress}</span>
    </header>
  );
}
