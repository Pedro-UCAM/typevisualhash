import React from 'react';
import { useState } from 'react';
// import './App.css';
import Canvas from './components/Canvas'
import AddSquare from './components/AddSquare'
import OtroAddSquare from './components/AddSquare_otroborrar'
import CanvasContext from './components/CanvasContext';

function App() {
  const [canvasVal, setCanvasVal] = useState<fabric.Canvas>();
  const setCanvas = (canv: fabric.Canvas) => {
    setCanvasVal(canv);
  };
  return (
    <div className="App">
      <CanvasContext.Provider
        value={{
          canvas: canvasVal,
          setCanvas,
        }}
      >
        {/* Tus componentes */}
        <Canvas />
        {/* <AddSquare /> */}
        <OtroAddSquare />
      </CanvasContext.Provider>
    </div>
  );
}

export default App;
