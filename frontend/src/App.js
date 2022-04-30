import Map from "./components/Map";
import cl from "./App.module.css";

// Generates random 0 or 1
const flipcoin = () => {
  return Math.floor(Math.random() * 2);
};

// Generate random sample tank data
const MAP_DIMENSION = 100;
const SPACESHIP_DATA = (function () {
  const arr = [];
  for (let i = 0; i < MAP_DIMENSION ** 2; i++) {
    arr.push(flipcoin());
  }
  return arr;
})();

function App() {
  return (
    <div className={cl.App}>
      <Map data={SPACESHIP_DATA} dim={MAP_DIMENSION} />
    </div>
  );
}

export default App;
