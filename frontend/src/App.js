import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import init from "./store/data/initThunk";

import Headbar from "./components/UserInfo/Headbar";
import Map from "./components/Map/Map";
import SideMenu from "./components/SideMenu/SideMenu";
import ChooseShip from "./components/UserInfo/ChooseShip";

import cl from "./App.module.css";
import styled from "styled-components/macro";

const MainPage = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

function App() {
  const dispatch = useDispatch();
  const clickedShipIndex = useSelector(
    (state) => state.sideMenu.clickedShipIndex
  );
  const isChoosingShip = useSelector((state) => state.userInfo.isChoosingShip);

  // Initialisation code
  useEffect(() => {
    dispatch(init());
  }, []);

  return (
    <div className={cl.App}>
      <MainPage>
        <Headbar />
        <Map />
      </MainPage>
      {/* The pop-up menus are in below */}
      {clickedShipIndex !== null && <SideMenu />}
      {isChoosingShip && <ChooseShip />}
    </div>
  );
}

export default App;
