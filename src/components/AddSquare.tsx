import { useContext, useState } from 'react';
import React from 'react';
import CanvasContext from './CanvasContext';
import { fabric } from 'fabric';

const AddSquare = () => {
    const { canvas, setCanvas } = useContext(CanvasContext);
    const [numSquares, setNumSquares] = useState<number>(0);

    const handleNumSquaresChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumSquares(Number(event.target.value));
    };

    const addSquare = () => {
        if (canvas) {
          const top = 100;
          const left = 200;
          const width = 50;
          const height = 50;
          const fill = 'rgb(178,204,255)';
          const canvasWidth = canvas.width !== undefined ? canvas.width - 200 : 0;

          for (let i = 0; i < numSquares; i++) {
            for (let j = 0; j < numSquares; j++) {
              const square = new fabric.Rect({
                left: left + (i * 50),
                top: top + (j * 50),
                width,
                height,
                fill,
              });
      
              canvas.add(square);
            }
          }
      
          canvas.renderAll();
        }
      };
      
      
      

    return (
        <div>
            <input
                type="number"
                value={numSquares}
                onChange={handleNumSquaresChange}
            />
            <button onClick={addSquare}>Agregar cuadrado</button>
        </div>
    );
};

export default AddSquare;
