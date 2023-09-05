import React, { useContext, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import CanvasContext from './CanvasContext';

const FabricCanvas = () => {
  const { setCanvas } = useContext(CanvasContext);

  useEffect(() => {
    const canvasInstance = new fabric.Canvas('canvas', {
      height: 500,
      width: 1000,
      backgroundColor: 'pink',
      
    });
    setCanvas(canvasInstance);
  }, []);

  return (
    <div>
      <canvas id="canvas" />
    </div>
  );
};

export default FabricCanvas;
