import { useEffect } from "react";
import { useDispatch } from "react-redux";
import loadData from "./store/loadDataThunk";
import Map from "./components/Map";
import Headbar from "./components/Headbar";
import cl from "./App.module.css";

function App() {
  useEffect(() => {
    dispatch(loadData());
  }, []);

  const dispatch = useDispatch();

  return (
    <div className={cl.App}>
      <Headbar />
      <Map />
    </div>
  );
}

export default App;
