import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import init from "./store/thunks/initThunk";

import Headbar from "./components/Headbar";
import Map from "./components/Map";
import ShipInfoPopup from "./components/ShipInfoPopup";

import cl from "./App.module.css";

function App() {
  useEffect(() => {
    dispatch(init());
  }, []);

  const dispatch = useDispatch();
  const { clickedShipIndex } = useSelector((state) => state.ui);

  return (
    <div className={cl.App}>
      <Headbar />
      <main className={cl.main}>
        <Map />
      </main>
      {clickedShipIndex !== null && <ShipInfoPopup />}
    </div>
  );
}

export default App;
