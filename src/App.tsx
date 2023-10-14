import React from 'react';
import { useState } from 'react';
// import './App.css';
import Canvas from './components/Canvas'
import OtroAddSquare from './components/AddSquare_otroborrar'
import CanvasContext from './components/context/CanvasContext';
import { ConsolaProvider } from './components/context/ConsolaContext';

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
        <ConsolaProvider>
          {/* Tus componentes */}
          <h1>Simulador Algoritmo Hash</h1>
          <Canvas />
          <OtroAddSquare />
        </ConsolaProvider>
      </CanvasContext.Provider>
    </div>
  );
}

export default App;
