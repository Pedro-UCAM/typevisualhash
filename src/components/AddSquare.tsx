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
          // const top = 100;
          // const left = 200;
          const width = 50;
          const height = 50;
          const fill = 'rgb(178,204,255)';
          const canvasWidth = canvas.width !== undefined ? canvas.width - 100 : 0; //Margen de 100 ancho
          const canvasHeight = canvas.height !== undefined ? canvas.height - 50 : 0;//Margen 50 alto
          let i = 0;

            for (let top = 50; top < canvasHeight; top+=100) { //Empiezo en 50 de alto por el margen
              for (let left = 100; left < canvasWidth; left+=50) { //Empiezo en 100 de ancho por el margen
                const square = new fabric.Rect({
                  left: left,
                  top: top,
                  width,
                  height,
                  fill: 'white',
                  stroke: 'black',
                  strokeWidth: 1,
                });
                
                canvas.add(square);
                i++;
                if(i==numSquares)
                {
                  break;
                }
              }
              if(i==numSquares)
              {
                break;
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
