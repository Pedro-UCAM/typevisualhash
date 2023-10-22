import React from "react";
import "semantic-ui-css/semantic.min.css";
import { useState } from "react";
import "./App.css";
import Canvas from "./components/canvas/Canvas";
import MenuConfiguracion from "./components/MenuCanvas";
import CanvasContext from "./components/context/CanvasContext";
import { ConsolaProvider } from "./components/context/ConsolaContext";
import ConsolaWrapper from "./components/wrapper/ConsolaWrapper";
import Footer from "./components/footer/Footer";
import { Header, Segment } from "semantic-ui-react"; // Añadimos las importaciones necesarias para Semantic UI React

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
          {/* Reemplazamos el antiguo header con el componente de Semantic UI React */}
          <Segment inverted textAlign="center" className="header-segment">
            <Header as="h1" inverted>
              Simulador Algoritmo Hash
            </Header>
          </Segment>

          <div className="body-content">
            <div className="canvas">
              <Canvas />
            </div>
            {/* Deberás envolver la consola en un div para aplicarle los estilos */}
            <div className="consola">
              {/* Aquí deberás invocar a tu componente de Consola. Asumo que tienes alguna forma de hacerlo a través de ConsolaProvider. */}
              {/* <h2>Consola: </h2> */}
              <ConsolaWrapper />
            </div>
          </div>

          <div className="menu-configuracion">
            <MenuConfiguracion />
          </div>

          {/* Cuando crees el componente Footer, simplemente añádelo aquí con la clase "footer" */}
          <div className="footer">
            <Footer />
          </div>
        </ConsolaProvider>
      </CanvasContext.Provider>
    </div>
  );
}

export default App;
