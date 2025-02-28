import React from 'react';
import Login from './Pages/Login';
import Home from './Pages/Home';
import GameSlider from './components/slider'
import GameList from './components/dock'
import SmoothScroll from "./components/SmoothScroll";
import Footer from "./components/footer"

function App() {
  return (
    <SmoothScroll>

    <div>
      {/* <GameList /> */}
      {/* <GameSlider /> */}
      <Home />
      {/* <Footer /> */}
      {/* <Login /> */}
    </div>
    </SmoothScroll>
  );
}

export default App;