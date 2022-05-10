import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import init from "./store/data/initThunk";

import Headbar from "./components/Headbar";
import Map from "./components/Map/Map";
import ShipInfoPopup from "./components/ShipInfoPopup";
import ShipMenu from "./components/ShipMenu";

import cl from "./App.module.css";

function App() {
  const dispatch = useDispatch();
  const clickedShipIndex = useSelector((state) => state.map.clickedShipIndex);

  // Initialisation code
  useEffect(() => {
    dispatch(init());
  }, []);

  return (
    <div className={cl.App}>
      <Headbar />
      <main className={cl.main}>
        <Map />
      </main>
      {clickedShipIndex !== null && <ShipInfoPopup />}
      <ShipMenu />
    </div>
  );
}

export default App;
