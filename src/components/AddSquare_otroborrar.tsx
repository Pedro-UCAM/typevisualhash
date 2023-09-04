import { useContext, useState } from 'react';
import React from 'react';
import CanvasContext from './CanvasContext';
import { fabric } from 'fabric';

const AddSquare = () => {
    const { canvas, setCanvas } = useContext(CanvasContext);
    const [numSquares, setNumSquares] = useState<number>(0);
    const [squares, setSquares] = useState<fabric.Object[]>([]); //Array de Cuadrados
    const [selectedSquareIndex, setSelectedSquareIndex] = useState<number>(-1); //variable para seleccionar cuadrados del array cuadrados.
    //Constantes para numeros
    const [numArray, setNumArray] = useState<number[]>([]); //Array de Numeros
    const [numero, setNumero] = useState<number>(0);

    const handleNumSquaresChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumSquares(Number(event.target.value));
    };

    const handleNumeroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);
        if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 9999) {
            setNumero(inputValue);
        }
    };


    //Animacion: Subraya de rojo el cuadrado, lo hace girar y luego lo borra.
    const animateSquare = (squareObj: fabric.Object) => {
        if (canvas && squareObj) {
            let rotation = 0; // Inicializar la rotación en 0
            const animate = () => {
                if (squareObj) {
                    squareObj.set({
                        strokeWidth: 5,
                        scaleX: 1,
                        scaleY: 1,
                        stroke: 'red',
                        angle: rotation, // Establecer la propiedad de rotación del cuadrado
                    });
                    rotation += 1; // Aumentar el valor de rotación en cada cuadro de la animación
                    squareObj.bringToFront(); // Mover el cuadrado al frente
                    canvas.requestRenderAll();
                    window.requestAnimationFrame(animate);
                }
            };
            animate();
        }
    };


    const deleteSquare = () => {
        if (selectedSquareIndex >= 0 && selectedSquareIndex < squares.length && canvas) {
            const square = squares[selectedSquareIndex];
            animateSquare(square);//Llamo a la funcion definida antes para que se ejecute la animacion
            setTimeout(() => {
                canvas.remove(square);
                setSquares((prevSquares) => prevSquares.filter((_, i) => i !== selectedSquareIndex));
                canvas.requestRenderAll(); // Renderizar el canvas después de eliminar el cuadrado
            }, 2000);//Pongo un delay de 2 segundos antes de borrar, para dar tiempo a ejecutarse a la animacion
        }
    };

    //FUNCION PARA LLENAR EL CANVAS SEGUN EL TAMAÑO QUE INDIQUE EL USUARIO
    const addSquare = () => {
        if (canvas) {

            canvas.clear(); // Limpia el canvas (CUANDO LO LIMPIO, SE BORRA EL COLOR Y TODAS LAS PROPIEDADES DEL CANVAS PREESTABLECIDAS)
            canvas.backgroundColor = 'pink'; // Restablece el color de fondo, si quiero mantener las propiedas preestablecidas.
            setSquares([]); // Limpia el array de cuadrados, lo reinicia

            // Crea un array de números del mismo tamaño que el número de cuadrados y lo rellena con 0
            const numArray = Array(numSquares).fill(0);
            setNumArray(numArray);

            // const top = 100;
            // const left = 200;
            const width = 50;
            const height = 50;
            const fill = 'rgb(178,204,255)';
            const canvasWidth = canvas.width !== undefined ? canvas.width - 100 : 0; //Margen de 100 ancho
            const canvasHeight = canvas.height !== undefined ? canvas.height - 50 : 0;//Margen 50 alto
            let i = 0;

            for (let top = 50; top < canvasHeight; top += 100) { //Empiezo en 50 de alto por el margen
                for (let left = 100; left < canvasWidth; left += 50) { //Empiezo en 100 de ancho por el margen
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
                    setSquares((prevSquares) => [...prevSquares, square]);
                    i++;
                    if (i == numSquares) {
                        break;
                    }
                }
                if (i == numSquares) {
                    break;
                }

            }
            canvas.renderAll();
        }
    };

    ///Numeros
    const createNumero = (numero: number, square: fabric.Object, canvas: any) => {
        if (square && square.left !== undefined && square.top !== undefined && square.width !== undefined && square.height !== undefined) {
            const minumero = new fabric.Text(numero.toString(), {
                left: square.left + square.width / 2,
                top: square.top + square.height / 2,
                fontSize: 20,
                fill: 'black',
                originX: 'center',
                originY: 'center',
            });

            canvas.add(minumero);
            canvas.renderAll();
        }
    };

    const introducirNumero = () => {
        const posicion = numero % squares.length; // Calcula la posición utilizando el módulo
        setNumArray((prevNumArray) => {
            const newArray = [...prevNumArray];
            newArray[posicion] = numero;
            return newArray;
        }); //Guardo el número en la posicion dentro del array.

        // Ahora vamos a introducir el número dentro del cuadrado
        const updatedSelectedSquareIndex = Number(posicion);
        console.log(`ID del cuadrado: ${updatedSelectedSquareIndex}`);

        if (updatedSelectedSquareIndex >= 0 && updatedSelectedSquareIndex < squares.length && canvas) {
            console.log(`Entré en el IF`);
            const square = squares[updatedSelectedSquareIndex];
            createNumero(numero, square, canvas);
        }
        console.log(`La posición del número ${numero} en el array es: ${posicion}`);
    };

    return (
        <div>
            <input
                type="number"
                value={numSquares}
                onChange={handleNumSquaresChange}
            />
            <button onClick={addSquare}>Agregar cuadrado</button>

            <input
                type="number"
                value={selectedSquareIndex}
                onChange={(event) => setSelectedSquareIndex(Number(event.target.value))}
            />
            <button onClick={deleteSquare}>Eliminar cuadrado</button>

            <input
                type="number"
                min="0"
                max="9999"
                value={numero}
                onChange={handleNumeroChange}
            />
            <button onClick={introducirNumero}>Insertar número</button>

        </div>
    );
};

export default AddSquare;
