import React, { useContext, useState, useEffect } from "react";
import { fabric } from "fabric";
import CanvasContext from "../context/CanvasContext";
import "./Canvas.css"; // Importando los estilos que vamos a crear

const FabricCanvas = () => {
  const { setCanvas } = useContext(CanvasContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvasWidth = windowWidth < 1000 ? windowWidth * 0.8 : 1000;
    const canvasHeight = 500 * (canvasWidth / 1000); // mantener la relación de aspecto

    const canvasInstance = new fabric.Canvas("canvas", {
      height: canvasHeight,
      width: canvasWidth,
      backgroundColor: "#ffffff",
      selection: false, // Desactivar selección global
      hoverCursor: "default", // Cursor por defecto al pasar por encima de un objeto
    });

    setCanvas(canvasInstance);
  }, [windowWidth]);

  return (
    <div className="canvas-wrapper">
      <canvas id="canvas" />
    </div>
  );
};

export default FabricCanvas;
