import Map from "./components/Map";
import cl from "./App.module.css";

/******** Generate random sample tank data *****/
const MAP_LENGTH = 100;
const NUM_OF_SPACESHIPS = 69;

const randXYArr = () => {
  const x = Math.floor(Math.random() * MAP_LENGTH);
  const y = Math.floor(Math.random() * MAP_LENGTH);
  return [x, y];
};

const SPACESHIP_DATA = (function () {
  const arr = [];
  for (let i = 0; i < NUM_OF_SPACESHIPS; i++) {
    arr.push(randXYArr());
  }
  return arr;
})();
/* ***************************************  */

function App() {
  return (
    <div className={cl.App}>
      <Map data={SPACESHIP_DATA} len={MAP_LENGTH} />
    </div>
  );
}

export default App;
