import { useEffect } from "react";
import { useDispatch } from "react-redux";
import init from "./store/initThunk";

import Map from "./components/Map";
import Headbar from "./components/Headbar";
import cl from "./App.module.css";

function App() {
  useEffect(() => {
    dispatch(init());
  }, []);

  const dispatch = useDispatch();

  return (
    <div className={cl.App}>
      <Headbar />
      <main className={cl.main}>
        <Map />
      </main>
    </div>
  );
}

export default App;
