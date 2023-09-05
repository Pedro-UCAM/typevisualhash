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
    const [collisionAlgorithm, setCollisionAlgorithm] = useState('linear'); // Estado para almacenar el algoritmo de colisión seleccionado


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

            // Crea un array de números del mismo tamaño que el número de cuadrados y lo rellena con undefined.
            const numArray = Array(numSquares).fill(undefined);
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

    ///Funciones introducir Numeros
    /**
     * Crea y agrega un número en el centro de un cuadrado en un canvas.
     *
     * @param {number} numero - El número que se desea mostrar en el centro del cuadrado.
     * @param {fabric.Object} square - El objeto cuadrado de Fabric.js en el que se colocará el número.
     * @param {any} canvas - El canvas de Fabric.js en el que se trabajará.
     */
    const createNumero = (numero: number, square: fabric.Object, canvas: any) => {
        // Verifica si el cuadrado y sus propiedades necesarias están definidas
        if (square && square.left !== undefined && square.top !== undefined && square.width !== undefined && square.height !== undefined) {
            // Crea un nuevo objeto de texto con el número
            const minumero = new fabric.Text(numero.toString(), {
                left: square.left + square.width / 2,  // Posición horizontal en el centro del cuadrado
                top: square.top + square.height / 2,    // Posición vertical en el centro del cuadrado
                fontSize: 20,                           // Tamaño de fuente
                fill: 'black',                          // Color del texto (negro)
                originX: 'center',                      // Establece el punto de origen en el centro horizontal
                originY: 'center',
                // Establece el punto de origen en el centro vertical
            });

            // Agrega el objeto de texto al canvas
            canvas.add(minumero);

            // Renderiza el canvas para que el número sea visible
            canvas.renderAll();
        }
    };

    // Función para manejar las colisiones
    function handleCollision(i: number, numero: number, posicion: number, array: number[], algoritmo: string): number {
        let nuevaPosicion = posicion;
        switch (algoritmo) {
            case 'linear':
                // Algoritmo de prueba lineal
                // Sin colisión: h0 = H(k) = k mod NELEMS
                // Colisión: h= G(k,i) = (H(k) + i) mod NELEMS i= [0..NELEMS]

                // Calcula la nueva posición utilizando el algoritmo de prueba lineal
                nuevaPosicion = (posicion + i) % array.length;
                break;

            case 'quadratic':
                // Implementa la lógica para el algoritmo de colisión cuadrática
                // Puedes calcular la nueva posición cuadráticamente aquí
                // Sin colisión: h0 = H(k) = k mod NELEMS
                // Colisión: h= G(k,i) = (H(k) + (i*i)) mod NELEMS i= [0..NELEMS]
                nuevaPosicion = (posicion + (i * i)) % array.length;
                break;

            case 'key-dependent':
                // Algoritmo de colisión dependiente de clave
                // Calcula el valor de d basado en la clave (numero)
                const d = Math.max(1, Math.floor(numero / array.length));
                nuevaPosicion = (posicion + (d * i)) % array.length;
                break;

            default:
                // Manejo para un algoritmo desconocido (puedes agregar lógica adicional si es necesario)
                break;
        }

        // Devuelve la nueva posición calculada
        return nuevaPosicion;
    }

    /**
* Genera un nuevo array basado en el array anterior (prevNumArray), actualizando un valor en una posición específica.
*
* @param {number[]} prevNumArray - El array original del cual se creará una copia con la actualización.
* @param {number} numero - El número que se desea colocar en una posición específica del nuevo array.
* @param {number} posicion - La posición en la que se colocará el número en el nuevo array.
* @returns {number[]} - Un nuevo array con el valor actualizado en la posición especificada.
*/
    function calcularPosicion(numero: number): number | undefined {
        const posicion = numero % squares.length; // Calcula la posición utilizando el módulo
        let nuevaPosicion: number | undefined = posicion;
        console.log(`Posición Inicial: h0 = H(K) = k mod NELEMS`);
        console.log(`${numero} mod ${squares.length} = ${posicion}`);

        // Crea una copia del array original para no modificarlo directamente
        const newArray = [...numArray];
        let i = 0;
        let insertado = false;

        while (!insertado) {
            // Verifica si la posición ya está ocupada
            console.log(`Se intenta insertar en ${nuevaPosicion}`);
            if (newArray[nuevaPosicion] === undefined) {
                newArray[nuevaPosicion] = numero;
                insertado = true;
            } else {
                // Deja un comentario o realiza alguna acción si la posición ya está ocupada
                console.log(`La posición ${nuevaPosicion} ya está ocupada. Se gestiona la colisión con ${collisionAlgorithm}`);
                // Llama a la función handleCollision para calcular la nueva posición
                i++;
                nuevaPosicion = handleCollision(i, numero, posicion, newArray, collisionAlgorithm);
            }

            if ((i === newArray.length)) {
                nuevaPosicion = undefined;
                break;
            }
        }

        // Actualiza el estado con el nuevo array
        setNumArray(newArray);

        return nuevaPosicion;
    }


    const introducirNumero = () => {

        const posicion = calcularPosicion(numero);

        if (posicion === undefined) {
            console.log(`No se pudo insertar ${numero}`);
        }
        else {
            // Ahora vamos a introducir el número dentro del cuadrado
            const updatedSelectedSquareIndex = Number(posicion);
            //console.log(`ID del cuadrado: ${updatedSelectedSquareIndex}`);

            if (updatedSelectedSquareIndex >= 0 && updatedSelectedSquareIndex < squares.length && canvas) {
                //console.log(`Entré en el IF`);
                //Seleccionar el cuadrado correcto (por hacer)
                const square = squares[updatedSelectedSquareIndex];
                createNumero(numero, square, canvas);
            }
            console.log(`${numero} se insertó en la posición: ${posicion}`);
        }

    };

    return (
        <div>
            <div>
                <input
                    type="number"
                    min="0"
                    max="64"
                    value={numSquares}
                    onChange={handleNumSquaresChange}
                />
                <button onClick={addSquare}>Tamaño del Array</button>
            </div>

            {/* <div>
                <input
                    type="number"
                    value={selectedSquareIndex}
                    onChange={(event) => setSelectedSquareIndex(Number(event.target.value))}
                />
                <button onClick={deleteSquare}>Eliminar cuadrado</button>
            </div> */}

            <div>
                <input
                    type="number"
                    min="0"
                    max="9999"
                    value={numero}
                    onChange={handleNumeroChange}
                />
                <button onClick={introducirNumero}>Insertar número</button>
            </div>

            <div>
                <p>Seleccione el algoritmo de manejo de colisiones:</p>
                <label>
                    <input
                        type="checkbox"
                        checked={collisionAlgorithm === 'linear'}
                        onChange={() => setCollisionAlgorithm('linear')}
                    />
                    Lineal
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={collisionAlgorithm === 'quadratic'}
                        onChange={() => setCollisionAlgorithm('quadratic')}
                    />
                    Cuadrática
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={collisionAlgorithm === 'key-dependent'}
                        onChange={() => setCollisionAlgorithm('key-dependent')}
                    />
                    Dependiente de Clave
                </label>
            </div>
        </div>
    );
}


export default AddSquare;
