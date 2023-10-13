import { useContext, useRef, useState } from 'react';
import React from 'react';
import CanvasContext from './CanvasContext';
import { fabric } from 'fabric';

const AddSquare = () => {
    const { canvas, setCanvas } = useContext(CanvasContext);
    const [numSquares, setNumSquares] = useState<number>(0); //Tamaño de la Tabla Hash
    const [numerosCanvas, setNumerosCanvas] = useState<fabric.Text[]>([]); //Array de Numeros Canvas
    const [squares, setSquares] = useState<fabric.Object[]>([]); //Array de Cuadrados
    const [squaresLastAnimation, setSquaresLastAnimation] = useState<fabric.Object[]>([]); //Cuadrados de la Ultima Animacion
    const [selectedSquareIndex, setSelectedSquareIndex] = useState<number>(-1); //variable para seleccionar cuadrados del array cuadrados.
    //Constantes para numeros
    const [numArray, setNumArray] = useState<number[]>([]); //Array de Numeros Logicos
    const [numero, setNumero] = useState<number>(0);
    const [collisionAlgorithm, setCollisionAlgorithm] = useState('linear'); // Estado para almacenar el algoritmo de colisión seleccionado

    //Estados de Control de Errores
    const [animationRunning, setAnimationRunning] = useState(false);
    const [animationCancelled, setAnimationCancelled] = useState(false);

    //Delay de la animacion
    //const [delayTime, setDelayTime] = useState(1000); // Comienza con el valor predeterminado de 1 segundo.
    const delayTime = useRef(1000);

    let currentArrowGroup: any = null; // Esta variable mantiene la referencia al grupo de flechas actual en el canvas: any = null; // Esta variable mantiene la referencia a la flecha actual en el canvas


    const handleNumSquaresChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const valorIntroducido = Number(event.target.value);

        if (valorIntroducido < 0 || valorIntroducido > 60) {
            setNumSquares(60);
        } else {
            setNumSquares(valorIntroducido);
        }
    };

    const handleNumeroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = Number(event.target.value);
        if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 9999) {
            setNumero(inputValue);
        }
    };

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);

        switch (value) {
            case 0:
                delayTime.current = 2000; // x0.5 velocidad
                break;
            case 1:
                delayTime.current = 1000; // x1 velocidad
                break;
            case 2:
                delayTime.current = 500;  // x2 velocidad
                break;
            case 3:
                delayTime.current = 250;  // x4 velocidad
                break;
            default:
                delayTime.current = 1000;
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

    const squareAnimation = (squareObj: fabric.Object, animationType: string) => {
        if (canvas && squareObj) {
            let strokeColor = 'black'; // Color por defecto
            let strokeWidth = 2;
            //let fillColor = 'white'; // Color por defecto

            switch (animationType) {
                case 'select':
                    strokeColor = 'blue';
                    break;
                case 'ok':
                    strokeColor = 'green';
                    strokeWidth = 3;
                    break;
                case 'fail':
                    strokeColor = 'red';
                    break;
                case 'reset':
                    strokeColor = 'black';
                    strokeWidth = 1;
                    break;
                default:
                    console.error('Tipo de animación no reconocida:', animationType);
                    return; // Salir de la función si el tipo de animación no es reconocido
            }

            squareObj.set({
                strokeWidth: strokeWidth,
                stroke: strokeColor
            });
            //squareObj.bringToFront(); // Mover el cuadrado al frente
            canvas.requestRenderAll();
        }
    };

    function moveArrow(square: any): void {
        const arrowBodyWidth = 5;  // Cambiamos el ancho del cuerpo de la flecha
        const arrowBodyHeight = 15;
        const arrowTipSize = 10;  // Cambiamos el tamaño de la punta de la flecha
    
        const arrowBody = new fabric.Rect({
            width: arrowBodyWidth,
            height: arrowBodyHeight,
            fill: 'blue',
            originX: 'center',
            originY: 'bottom'
        });
    
        const arrowTip = new fabric.Triangle({
            width: 15,
            height: 10,
            fill: 'blue',
            originX: 'center',
            originY: 'bottom',   // Cambiamos 'top' a 'bottom' para que el triángulo se sitúe en la parte inferior
            angle: 180,
            top: -5
        });
    
        const arrowGroup = new fabric.Group([arrowBody, arrowTip], {
            left: (square.left + square.width / 2)-7,
            top: square.top - arrowTipSize - arrowBodyHeight,  // Ajustamos la posición de la flecha para que esté justo encima del cuadrado
            selectable: false
        });
    
        // Aplicamos el zoom
        const scaleFactor = 1;  // 
        arrowGroup.scale(scaleFactor);
    
        if (currentArrowGroup && canvas) {
            canvas.remove(currentArrowGroup);
        }
        if (canvas) {
            canvas.add(arrowGroup);
        }
        currentArrowGroup = arrowGroup;
    }
    



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
            // Haz lo mismo para el array numerosCanvas
            const initialNumerosCanvas = Array(numSquares).fill(undefined);
            setNumerosCanvas(initialNumerosCanvas);


            // const top = 100;
            // const left = 200;
            const width = 50;
            const height = 50;
            const fill = 'rgb(178,204,255)';
            const canvasWidth = canvas.width !== undefined ? canvas.width - 100 : 0; //Margen de 100 ancho
            const canvasHeight = canvas.height !== undefined ? canvas.height - 50 : 0; //Margen 50 alto
            let i = 0;

            for (let top = 50; top < canvasHeight; top += 100) { //Empiezo en 50 de alto por el margen
                for (let left = 100; left < canvasWidth; left += 55) { //Empiezo en 100 de ancho por el margen
                    const square = new fabric.Rect({
                        left: left,
                        top: top,
                        width,
                        height,
                        fill: 'white',
                        stroke: 'black',
                        strokeWidth: 1,
                    });

                    // Añadir el cuadrado al canvas
                    canvas.add(square);

                    // Crear objeto de texto para el índice
                    const indexText = new fabric.Text(i.toString(), {
                        left: left + width / 2, // Centrar horizontalmente respecto al cuadrado
                        top: top + height + 5,  // Colocar debajo del cuadrado con un pequeño margen
                        fontSize: 12,
                        originX: 'center', // Esto asegura que el texto se centre en su posición
                        originY: 'top'
                    });

                    // Añadir el texto al canvas
                    canvas.add(indexText);

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
    const createNumero = (numero: number, square: fabric.Object, canvas: any): fabric.Text | undefined => {
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
            //console.log("numero insertado")

            // Renderiza el canvas para que el número sea visible
            canvas.renderAll();
            return minumero;  // Devuelve el objeto de texto creado
        }
        return undefined;
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
    async function calcularPosicion(numero: number): Promise<number | undefined> {
        const posicion = numero % squares.length; // Calcula la posición utilizando el módulo
        let nuevaPosicion: number | undefined = posicion;
        console.log(`Posición Inicial: h0 = H(K) = k mod NELEMS`);
        console.log(`${numero} mod ${squares.length} = ${posicion}`);

        // Crea una copia del array original para no modificarlo directamente
        const newArray = [...numArray];
        let i = 0;
        let insertado = false;
        const intentosPrevios: { [key: number]: number } = [];

        const delay = () => new Promise(resolve => setTimeout(resolve, delayTime.current));

        const insertarConAnimacion = async (): Promise<number | undefined> => {
            while (!insertado) {
                //Comprobacion para cancelar la accion si el usuario lo solicita.
                if (animationCancelled) {
                    return; // Sale de la función
                }
                // Verifica si la posición ya está ocupada
                console.log(`Se intenta insertar en ${nuevaPosicion}`);
                // Animación seleccionar cuadrado
                const square = squares[Number(nuevaPosicion)]; // Selecciono el cuadrado
                setSquaresLastAnimation(prevSquares => [...prevSquares, square]); //Añado a la lista LastAnimation
                moveArrow(square); //Funcion que hace aparecer la flecha encima del cuadrado y la va moviendo.
                squareAnimation(square, "select");
                await delay();

                if (newArray[Number(nuevaPosicion)] === undefined) {
                    squareAnimation(square, "ok");
                    newArray[Number(nuevaPosicion)] = numero;
                    insertado = true;
                } else {
                    // Deja un comentario o realiza alguna acción si la posición ya está ocupada
                    console.log(`La posición ${nuevaPosicion} ya está ocupada. Se gestiona la colisión con ${collisionAlgorithm}`);
                    squareAnimation(square, "fail");

                    // Incrementa o inicializa el conteo de intentos para esta posición
                    intentosPrevios[Number(nuevaPosicion)] = (intentosPrevios[Number(nuevaPosicion)] || 0) + 1;

                    // Si la posición se ha intentado 3 veces, detén la animación y muestra un error
                    if (intentosPrevios[Number(nuevaPosicion)] >= 3) {
                        console.error(`No se pudo insertar ${numero}. Se detectó un bucle en la posición ${nuevaPosicion}.`);
                        return undefined;
                    }

                    // Llama a la función handleCollision para calcular la nueva posición
                    i++;
                    nuevaPosicion = handleCollision(i, numero, posicion, newArray, collisionAlgorithm);
                }

                if (i === newArray.length) {
                    return undefined;
                }
            }

            if (currentArrowGroup && canvas) {
                canvas.remove(currentArrowGroup);
                currentArrowGroup = null;
            }

            // Actualiza el estado con el nuevo array
            setNumArray(newArray);
            return nuevaPosicion;
        };
        //Comprobacion para cancelar la accion si el usuario lo solicita.
        if (animationCancelled) {
            setAnimationCancelled(false); // Restablece el estado para usos futuros
            return undefined; // Sale de la función
        }
        // Llamar a la función de inserción con animación y esperar a que termine
        const result = await insertarConAnimacion();

        // Si insertarConAnimacion devuelve undefined, también devolvemos undefined desde calcularPosicion
        if (result === undefined) {
            return undefined;
        }

        return result;
    }






    const introducirNumero = async () => {

        setAnimationRunning(true);

        //Reseteo la animacion anterior
        if (squaresLastAnimation.length > 0) {
            // Recorre cada cuadrado en squaresLastAnimation y llama a la función squareAnimation con "reset"
            squaresLastAnimation.forEach(squareObj => {
                squareAnimation(squareObj, "reset");
            });

            // Limpia el array squaresLastAnimation, dejándolo vacío
            setSquaresLastAnimation([]);
        }

        const posicion = await calcularPosicion(numero);  // Usa await para esperar el resultado

        if (posicion === undefined) {
            console.log(`No se pudo insertar ${numero}`);
        }
        else {
            // console.log(`Entro en el else de introducirNumero`);
            // Ahora vamos a introducir el número dentro del cuadrado
            const updatedSelectedSquareIndex = Number(posicion);
            //console.log(`ID del cuadrado: ${updatedSelectedSquareIndex}`);

            if (updatedSelectedSquareIndex >= 0 && updatedSelectedSquareIndex < squares.length && canvas) {
                //console.log(`Entro en el if del if de introducirNumero`);
                //console.log(`Entré en el IF`);
                const square = squares[updatedSelectedSquareIndex];
                //console.log("Llamo a createNumero")
                const numeroCanvas = createNumero(numero, square, canvas);
                //console.log("He creado el numero: ", numeroCanvas)
                //Guardo el Numero en el Array de Numeros Canvas para poder animarlo o eliminarlo en el futuro
                if (numeroCanvas) {
                    if (posicion !== undefined) {
                        const arrayNumerosCanvas = [...numerosCanvas];
                        arrayNumerosCanvas[Number(posicion)] = numeroCanvas;
                        setNumerosCanvas(arrayNumerosCanvas);
                        //console.log(arrayNumerosCanvas);
                    }
                }
            }
            console.log(`${numero} se insertó en la posición: ${posicion}`, posicion);
        }
        setAnimationRunning(false);
    };

    return (
        <div>
            <div>
                <input
                    type="number"
                    min="0"
                    max="60"
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
                <button onClick={introducirNumero} disabled={animationRunning}>Insertar número</button>
                {/* <button onClick={() => setAnimationCancelled(true)} disabled={!animationRunning}>Cancelar animación</button> */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="range"
                        min="0"
                        max="3"
                        step="1"
                        defaultValue="1"
                        onChange={handleSliderChange}
                        style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                        <span style={{ flex: '1', textAlign: 'center' }}>x0.5</span>
                        <span style={{ flex: '1', textAlign: 'center' }}>x1</span>
                        <span style={{ flex: '1', textAlign: 'center' }}>x2</span>
                        <span style={{ flex: '1', textAlign: 'center' }}>x4</span>
                    </div>
                </div>

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
