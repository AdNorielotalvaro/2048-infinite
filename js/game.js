import { getCurrentPlayer } from "./supabase.js";

let currentPlayer = null;

getCurrentPlayer().then(player => {
    currentPlayer = player;

    console.log(
        "Jugador actual:",
        currentPlayer
    );
});

/*
=================================================================
2048 INFINITE
MOTOR PRINCIPAL DEL JUEGO
=================================================================
*/

/*
 * =================================================================
 * 2048 INFINITE
 * MOTOR PRINCIPAL DEL JUEGO
 * =================================================================
 *
 * Este archivo contiene la lógica fundamental del juego 2048.
 *
 * IMPORTANTE:
 *
 * Aquí NO manejamos directamente el diseño visual.
 *
 * El HTML se encuentra en:
 *
 *     /index.html
 *
 * Los estilos están en:
 *
 *     /css/style.css
 *
 * Y este archivo se encarga de:
 *
 *     - Crear el estado del tablero
 *     - Generar fichas
 *     - Mover fichas
 *     - Combinar fichas
 *     - Calcular puntuación
 *     - Detectar movimientos
 *     - Detectar Game Over
 *
 * Posteriormente añadiremos:
 *
 *     - Sistema de niveles
 *     - Etapas 1, 2, 3...
 *     - Guardado de progreso
 *     - Usuarios
 *     - Ranking
 *     - Supabase
 *     - Controles avanzados
 *     - Animaciones
 * =================================================================
 */


/* =================================================================
   1. CONFIGURACIÓN DEL JUEGO
   ================================================================= */


/*
 * Tamaño del tablero.
 *
 * El 2048 clásico utiliza un tablero de 4 x 4.
 */
const BOARD_SIZE = 4;


/*
 * Cantidad de celdas totales.
 *
 * 4 × 4 = 16.
 */
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;


/* =================================================================
   2. ESTADO DEL JUEGO
   ================================================================= */


/*
 * Esta variable almacenará el tablero completo.
 *
 * Ejemplo:
 *
 * [
 *     [0, 2, 0, 0],
 *     [0, 0, 4, 0],
 *     [0, 0, 0, 0],
 *     [2, 0, 0, 0]
 * ]
 *
 * El número 0 representa una celda vacía.
 */
let board = [];


/*
 * Puntuación actual.
 */
let score = 0;


/*
 * Mejor puntuación.
 *
 * Posteriormente esta información podrá guardarse
 * en Supabase.
 */
let bestScore = 0;


/* =================================================================
   3. ELEMENTOS HTML
   ================================================================= */


/*
 * Obtenemos una referencia al tablero HTML.
 */
const gameBoardElement =
    document.getElementById("game-board");


/*
 * Elemento que muestra la puntuación actual.
 */
const scoreElement =
    document.getElementById("current-score");


/*
 * Elemento que muestra la mejor puntuación.
 */
const bestScoreElement =
    document.getElementById("best-score");


/*
 * Botón para comenzar una nueva partida.
 */
const newGameButton =
    document.getElementById("new-game-button");


/* =================================================================
   4. INICIAR EL JUEGO
   ================================================================= */


/*
 * Esta función se ejecuta cuando queremos comenzar
 * una nueva partida.
 */
function startNewGame() {

    /*
     * Reiniciamos la puntuación.
     */
    score = 0;


    /*
     * Creamos un tablero vacío.
     */
    board = createEmptyBoard();


    /*
     * Generamos las dos primeras fichas.
     */
    addRandomTile();

    addRandomTile();


    /*
     * Actualizamos visualmente el tablero.
     */
    renderBoard();


    /*
     * Actualizamos la puntuación.
     */
    updateScore();
}


/* =================================================================
   5. CREAR TABLERO VACÍO
   ================================================================= */


/*
 * Crea una matriz de 4 × 4 llena de ceros.
 */
function createEmptyBoard() {

    /*
     * Array principal.
     */
    const newBoard = [];


    /*
     * Recorremos las filas.
     */
    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        /*
         * Creamos una fila vacía.
         */
        const newRow = [];


        /*
         * Creamos las columnas.
         */
        for (
            let column = 0;
            column < BOARD_SIZE;
            column++
        ) {

            /*
             * 0 significa que la celda está vacía.
             */
            newRow.push(0);
        }


        /*
         * Agregamos la fila al tablero.
         */
        newBoard.push(newRow);
    }


    return newBoard;
}


/* =================================================================
   6. BUSCAR CELDAS VACÍAS
   ================================================================= */


/*
 * Devuelve una lista con todas las posiciones
 * disponibles del tablero.
 */
function getEmptyCells() {

    /*
     * Aquí almacenaremos las celdas vacías.
     */
    const emptyCells = [];


    /*
     * Recorremos filas.
     */
    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        /*
         * Recorremos columnas.
         */
        for (
            let column = 0;
            column < BOARD_SIZE;
            column++
        ) {

            /*
             * Si encontramos un cero,
             * la celda está disponible.
             */
            if (board[row][column] === 0) {

                emptyCells.push({
                    row: row,
                    column: column
                });
            }
        }
    }


    return emptyCells;
}


/* =================================================================
   7. GENERAR UNA NUEVA FICHA
   ================================================================= */


/*
 * Agrega una ficha aleatoria al tablero.
 *
 * En el 2048 clásico:
 *
 * 90% de las veces aparece un 2.
 * 10% de las veces aparece un 4.
 */
function addRandomTile() {

    /*
     * Obtenemos las celdas vacías.
     */
    const emptyCells =
        getEmptyCells();


    /*
     * Si no hay espacio disponible,
     * no podemos generar una nueva ficha.
     */
    if (emptyCells.length === 0) {

        return;
    }


    /*
     * Seleccionamos una posición aleatoria.
     */
    const randomIndex =
        Math.floor(
            Math.random() * emptyCells.length
        );


    /*
     * Obtenemos la posición.
     */
    const selectedCell =
        emptyCells[randomIndex];


    /*
     * Generamos el valor.
     *
     * Math.random() devuelve un número entre
     * 0 y 1.
     *
     * Si es menor que 0.9:
     *
     *     2
     *
     * De lo contrario:
     *
     *     4
     */
    const tileValue =
        Math.random() < 0.9
            ? 2
            : 4;


    /*
     * Colocamos la ficha.
     */
    board[selectedCell.row][selectedCell.column] =
        tileValue;
}


/* =================================================================
   8. RENDERIZAR EL TABLERO
   ================================================================= */


/*
 * Esta función convierte nuestro tablero matemático
 * en elementos visuales HTML.
 */
function renderBoard() {

    /*
     * Eliminamos el contenido anterior.
     *
     * Esto permite reconstruir visualmente el tablero.
     */
    gameBoardElement.innerHTML = "";


    /*
     * Recorremos todas las filas.
     */
    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        /*
         * Recorremos todas las columnas.
         */
        for (
            let column = 0;
            column < BOARD_SIZE;
            column++
        ) {

            /*
             * Obtenemos el valor de la celda.
             */
            const value =
                board[row][column];


            /*
             * Creamos un elemento HTML.
             */
            const tile =
                document.createElement("div");


            /*
             * Agregamos la clase base.
             */
            tile.classList.add("tile");


            /*
             * Si la celda contiene un número,
             * mostramos el número.
             */
            /*
 * Si la celda contiene una ficha:
 */
if (value !== 0) {

    /*
     * Mostramos el número.
     */
    tile.textContent =
        value;


    /*
     * ------------------------------------------------------------
     * ASIGNAR ESTILO SEGÚN EL VALOR
     * ------------------------------------------------------------
     *
     * Ejemplo:
     *
     * 2    → tile-2
     * 4    → tile-4
     * 8    → tile-8
     * 16   → tile-16
     * ...
     *
     * Esto permite que CSS controle completamente
     * la apariencia de cada ficha.
     */

    /*
     * Para valores normales hasta 2048:
     */
    if (value <= 2048) {

        tile.classList.add(
            `tile-${value}`
        );

    } else {

        /*
         * --------------------------------------------------------
         * VALORES SUPERIORES A 2048
         * --------------------------------------------------------
         *
         * Como nuestro juego será infinito, no podemos crear
         * una clase CSS diferente para cada número:
         *
         * tile-4096
         * tile-8192
         * tile-16384
         * tile-32768
         *
         * Por eso utilizamos una clase genérica.
         */

        tile.classList.add(
            "tile-super"
        );
    }


    /*
     * Añadimos una pequeña animación de aparición.
     */
    tile.classList.add(
        "tile-new"
    );
}


            /*
             * Agregamos la ficha al tablero.
             */
            gameBoardElement.appendChild(tile);
        }
    }
}


/* =================================================================
   9. ACTUALIZAR PUNTUACIÓN
   ================================================================= */


/*
 * Actualiza los valores visuales de puntuación.
 */
function updateScore() {

    /*
     * Actualizamos la puntuación actual.
     */
    scoreElement.textContent =
        score;


    /*
     * Si la puntuación actual supera
     * nuestra mejor puntuación:
     */
    if (score > bestScore) {

        /*
         * Actualizamos la mejor puntuación.
         */
        bestScore = score;
    }


    /*
     * Actualizamos el HTML.
     */
    bestScoreElement.textContent =
        bestScore;
}


/* =================================================================
   10. COMPRIMIR UNA FILA
   ================================================================= */


/*
 * Esta función elimina los ceros de una fila.
 *
 * Ejemplo:
 *
 * [2, 0, 2, 4]
 *
 * se convierte en:
 *
 * [2, 2, 4]
 */
function compressLine(line) {

    return line.filter(
        value => value !== 0
    );
}


/* =================================================================
   11. COMBINAR UNA FILA
   ================================================================= */


/*
 * Combina números iguales.
 *
 * Ejemplo:
 *
 * [2, 2, 4, 4]
 *
 * se convierte en:
 *
 * [4, 8]
 */
function mergeLine(line) {

    /*
     * Copiamos la fila para no modificar
     * accidentalmente el array original.
     */
    const mergedLine = [];


    /*
     * Recorremos la fila.
     */
    for (
        let index = 0;
        index < line.length;
        index++
    ) {

        /*
         * Si existe un siguiente elemento
         * y es igual al actual:
         */
        if (
            index + 1 < line.length &&
            line[index] === line[index + 1]
        ) {

            /*
             * Combinamos ambos valores.
             */
            const mergedValue =
                line[index] * 2;


            /*
             * Agregamos el nuevo valor.
             */
            mergedLine.push(
                mergedValue
            );


            /*
             * Sumamos el valor combinado
             * a la puntuación.
             */
            score += mergedValue;


            /*
             * Saltamos el siguiente elemento,
             * porque ya fue combinado.
             */
            index++;

        } else {

            /*
             * Si no se puede combinar,
             * agregamos el valor normal.
             */
            mergedLine.push(
                line[index]
            );
        }
    }


    return mergedLine;
}


/* =================================================================
   12. COMPLETAR UNA FILA
   ================================================================= */


/*
 * Después de comprimir y combinar necesitamos
 * volver a completar la fila con ceros.
 *
 * Ejemplo:
 *
 * [4, 8]
 *
 * se convierte en:
 *
 * [4, 8, 0, 0]
 */
function padLine(line) {

    /*
     * Copiamos la línea.
     */
    const result = [...line];


    /*
     * Mientras no tengamos cuatro elementos:
     */
    while (
        result.length < BOARD_SIZE
    ) {

        /*
         * Agregamos una celda vacía.
         */
        result.push(0);
    }


    return result;
}


/* =================================================================
   13. PROCESAR UNA LÍNEA COMPLETA
   ================================================================= */


/*
 * Ejecuta:
 *
 *     comprimir
 *     combinar
 *     completar
 *
 * sobre una línea.
 */
function processLine(line) {

    /*
     * Primero eliminamos espacios.
     */
    const compressed =
        compressLine(line);


    /*
     * Después combinamos.
     */
    const merged =
        mergeLine(compressed);


    /*
     * Finalmente completamos.
     */
    return padLine(merged);
}


/* =================================================================
   14. COMPARAR TABLEROS
   ================================================================= */


/*
 * Determina si dos tableros son iguales.
 *
 * Esto nos permitirá saber si un movimiento
 * realmente produjo un cambio.
 */
function boardsAreEqual(
    firstBoard,
    secondBoard
) {

    /*
     * Recorremos filas.
     */
    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        /*
         * Recorremos columnas.
         */
        for (
            let column = 0;
            column < BOARD_SIZE;
            column++
        ) {

            /*
             * Si encontramos una diferencia,
             * los tableros no son iguales.
             */
            if (
                firstBoard[row][column] !==
                secondBoard[row][column]
            ) {

                return false;
            }
        }
    }


    /*
     * Si llegamos aquí,
     * ambos tableros son iguales.
     */
    return true;
}


/* =================================================================
   15. COPIAR TABLERO
   ================================================================= */


/*
 * Crea una copia independiente del tablero.
 */
function cloneBoard(sourceBoard) {

    return sourceBoard.map(
        row => [...row]
    );
}


/* =================================================================
   16. MOVER A LA IZQUIERDA
   ================================================================= */


/*
 * Procesa todas las filas hacia la izquierda.
 */
function moveLeft() {

    /*
     * Guardamos el estado anterior.
     */
    const previousBoard =
        cloneBoard(board);


    /*
     * Procesamos cada fila.
     */
    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        board[row] =
            processLine(board[row]);
    }


    /*
     * Determinamos si hubo movimiento.
     */
    const moved =
        !boardsAreEqual(
            previousBoard,
            board
        );


    /*
     * Si hubo movimiento:
     */
    if (moved) {

        /*
         * Generamos una nueva ficha.
         */
        addRandomTile();


        /*
         * Actualizamos visualmente.
         */
        renderBoard();


        /*
         * Actualizamos puntuación.
         */
        updateScore();


        /*
         * Comprobamos Game Over.
         */
        checkGameOver();
    }
}


/* =================================================================
   17. OBTENER COLUMNA
   ================================================================= */


/*
 * Devuelve una columna del tablero.
 */
function getColumn(columnIndex) {

    const column = [];


    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        column.push(
            board[row][columnIndex]
        );
    }


    return column;
}


/* =================================================================
   18. ESTABLECER COLUMNA
   ================================================================= */


/*
 * Reemplaza una columna completa.
 */
function setColumn(
    columnIndex,
    values
) {

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        board[row][columnIndex] =
            values[row];
    }
}


/* =================================================================
   19. MOVER A LA DERECHA
   ================================================================= */


/*
 * Procesa todas las filas hacia la derecha.
 */
function moveRight() {

    const previousBoard =
        cloneBoard(board);


    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        /*
         * Invertimos la fila.
         */
        const reversed =
            [...board[row]].reverse();


        /*
         * Procesamos la línea.
         */
        const processed =
            processLine(reversed);


        /*
         * Volvemos a invertirla.
         */
        board[row] =
            processed.reverse();
    }


    const moved =
        !boardsAreEqual(
            previousBoard,
            board
        );


    if (moved) {

        addRandomTile();

        renderBoard();

        updateScore();

        checkGameOver();
    }
}


/* =================================================================
   20. MOVER HACIA ARRIBA
   ================================================================= */


/*
 * Procesa todas las columnas hacia arriba.
 */
function moveUp() {

    const previousBoard =
        cloneBoard(board);


    for (
        let column = 0;
        column < BOARD_SIZE;
        column++
    ) {

        /*
         * Obtenemos la columna.
         */
        const currentColumn =
            getColumn(column);


        /*
         * Procesamos la columna.
         */
        const processed =
            processLine(currentColumn);


        /*
         * La volvemos a colocar.
         */
        setColumn(
            column,
            processed
        );
    }


    const moved =
        !boardsAreEqual(
            previousBoard,
            board
        );


    if (moved) {

        addRandomTile();

        renderBoard();

        updateScore();

        checkGameOver();
    }
}


/* =================================================================
   21. MOVER HACIA ABAJO
   ================================================================= */


/*
 * Procesa todas las columnas hacia abajo.
 */
function moveDown() {

    const previousBoard =
        cloneBoard(board);


    for (
        let column = 0;
        column < BOARD_SIZE;
        column++
    ) {

        /*
         * Obtenemos la columna.
         */
        const currentColumn =
            getColumn(column);


        /*
         * La invertimos.
         */
        const reversed =
            currentColumn.reverse();


        /*
         * Procesamos.
         */
        const processed =
            processLine(reversed);


        /*
         * Volvemos a invertir.
         */
        const finalColumn =
            processed.reverse();


        /*
         * Guardamos.
         */
        setColumn(
            column,
            finalColumn
        );
    }


    const moved =
        !boardsAreEqual(
            previousBoard,
            board
        );


    if (moved) {

        addRandomTile();

        renderBoard();

        updateScore();

        checkGameOver();
    }
}


/* =================================================================
   22. DETECTAR SI EXISTEN MOVIMIENTOS
   ================================================================= */


/*
 * Determina si todavía existe algún movimiento posible.
 */
function canMove() {

    /*
     * Si existe una celda vacía,
     * todavía podemos mover.
     */
    if (
        getEmptyCells().length > 0
    ) {

        return true;
    }


    /*
     * Revisamos si existen fichas adyacentes
     * que puedan combinarse horizontalmente.
     */
    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        for (
            let column = 0;
            column < BOARD_SIZE;
            column++
        ) {

            const current =
                board[row][column];


            /*
             * Revisamos la celda de la derecha.
             */
            if (
                column + 1 < BOARD_SIZE &&
                current ===
                board[row][column + 1]
            ) {

                return true;
            }


            /*
             * Revisamos la celda inferior.
             */
            if (
                row + 1 < BOARD_SIZE &&
                current ===
                board[row + 1][column]
            ) {

                return true;
            }
        }
    }


    /*
     * No quedan movimientos.
     */
    return false;
}


/* =================================================================
   23. GAME OVER
   ================================================================= */


/*
 * Comprueba si el jugador perdió.
 */
function checkGameOver() {

    if (!canMove()) {

        /*
         * Por ahora mostramos un mensaje sencillo.
         *
         * Más adelante construiremos una pantalla
         * mucho más profesional.
         */
        setTimeout(
            () => {

                alert(
                    "Game Over"
                );

            },
            100
        );
    }
}


/* =================================================================
   24. CONTROLES DE TECLADO
   ================================================================= */


/*
 * Escuchamos las teclas del teclado.
 */
document.addEventListener(
    "keydown",
    event => {

        /*
         * Según la tecla presionada
         * ejecutamos el movimiento correspondiente.
         */
        switch (event.key) {

            case "ArrowLeft":

                event.preventDefault();

                moveLeft();

                break;


            case "ArrowRight":

                event.preventDefault();

                moveRight();

                break;


            case "ArrowUp":

                event.preventDefault();

                moveUp();

                break;


            case "ArrowDown":

                event.preventDefault();

                moveDown();

                break;
        }
    }
);


/* =================================================================
   25. BOTÓN NUEVA PARTIDA
   ================================================================= */


/*
 * Cuando el usuario pulsa "Nueva partida"
 * reiniciamos completamente el juego.
 */
newGameButton.addEventListener(
    "click",
    startNewGame
);


/* =================================================================
   26. INICIAR AUTOMÁTICAMENTE
   ================================================================= */


/*
 * Cuando la página termina de cargar,
 * iniciamos automáticamente una partida.
 */
startNewGame();

/* ================================================================
   CONTROLES TÁCTILES
   ================================================================ */

/*
 * Posición inicial del dedo.
 */
let touchStartX = 0;
let touchStartY = 0;


/*
 * Distancia mínima para reconocer un deslizamiento.
 */
const SWIPE_THRESHOLD = 40;


/*
 * Detectamos cuando el dedo toca el tablero.
 */
gameBoardElement.addEventListener(
    "touchstart",
    function (event) {

        /*
         * Obtenemos el primer dedo.
         */
        const touch = event.touches[0];

        /*
         * Guardamos la posición inicial.
         */
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

    },
    {
        passive: true
    }
);


/*
 * Detectamos cuando el dedo abandona la pantalla.
 */
gameBoardElement.addEventListener(
    "touchend",
    function (event) {

        /*
         * Obtenemos la posición final.
         */
        const touch = event.changedTouches[0];

        /*
         * Calculamos cuánto se movió horizontalmente.
         */
        const deltaX =
            touch.clientX - touchStartX;

        /*
         * Calculamos cuánto se movió verticalmente.
         */
        const deltaY =
            touch.clientY - touchStartY;


        /*
         * Valores absolutos.
         *
         * Math.abs() convierte:
         *
         * -100 → 100
         *  100 → 100
         */
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);


        /*
         * Si el movimiento fue demasiado pequeño,
         * probablemente fue solamente un toque.
         */
        if (
            absX < SWIPE_THRESHOLD &&
            absY < SWIPE_THRESHOLD
        ) {

            return;
        }


        /*
         * --------------------------------------------------------
         * MOVIMIENTO HORIZONTAL
         * --------------------------------------------------------
         */

        if (absX > absY) {

            /*
             * Hacia la derecha.
             */
            if (deltaX > 0) {

                moveRight();

            }

            /*
             * Hacia la izquierda.
             */
            else {

                moveLeft();
            }


            return;
        }


        /*
         * --------------------------------------------------------
         * MOVIMIENTO VERTICAL
         * --------------------------------------------------------
         */

        /*
         * Hacia abajo.
         */
        if (deltaY > 0) {

            moveDown();

        }

        /*
         * Hacia arriba.
         */
        else {

            moveUp();
        }

    },
    {
        passive: true
    }
);

/*
 * PRUEBA TEMPORAL DE EVENTOS TÁCTILES
 *
 * Esta prueba NO mueve el juego.
 * Solo nos permite confirmar que el navegador
 * está detectando correctamente el final del gesto.
 */
