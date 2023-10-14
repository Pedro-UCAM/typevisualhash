import React, { useContext, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import CanvasContext from '../context/CanvasContext';
import './Canvas.css';  // Importando los estilos que vamos a crear

const FabricCanvas = () => {
    const { setCanvas } = useContext(CanvasContext);

    useEffect(() => {
        const canvasInstance = new fabric.Canvas('canvas', {
            height: 500,
            width: 1000,
            backgroundColor: '#ffffff', // Cambiando a un fondo verde oscuro
        });
        setCanvas(canvasInstance);
    }, []);

    return (
        <div className="canvas-wrapper">
            <canvas id="canvas" />
        </div>
    );
};

export default FabricCanvas;
