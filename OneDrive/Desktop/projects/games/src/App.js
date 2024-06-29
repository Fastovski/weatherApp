import './App.css';
import { useRef, useState, useEffect, useCallback } from 'react';

const COLs = 48;
const ROWs = 48;
const DEFAULT_LENGTH = 10;

const UP = Symbol("up");
const DOWN = Symbol("down");
const RIGHT = Symbol("right");
const LEFT = Symbol("left");

const gameAudio = new Audio("/gameplay.mp3");
gameAudio.loop = true;

const bonusAudio = new Audio("/point.mp3");
const errorAudio = new Audio("/error.mp3");

function App() {
    const timer = useRef(null);
    const snakeCoordinates = useRef([]);
    const direction = useRef(RIGHT);
    const [gridSize, setGridSize] = useState({ rows: ROWs, cols: COLs });
    const grid = useRef(Array(gridSize.rows).fill(Array(gridSize.cols).fill("")));
    const snakeCoordinatesMap = useRef(new Set());
    const foodCoords = useRef({
        row: -1,
        col: -1,
    });
    const [points, setPoints] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setPlaying] = useState(0);

    useEffect(() => {
        window.addEventListener("keydown", (e) => handleDirectionChange(e.key));

      }, []);

    useEffect(() => {
        const snake_postions = [];
        for (let i = 0; i < DEFAULT_LENGTH; i++) {
            snake_postions.push({
                row: 0,
                col: i,
                isHead: false,
            });
        }

        snake_postions[DEFAULT_LENGTH - 1].isHead = true;
        snakeCoordinates.current = snake_postions;

        syncSnakeCoordinatesMap();
        populateFoodBall();
    }, []);

    // const updateGridSize = () => {
    //     const cells = document.querySelectorAll('.cell');
    //     const cellWidth = `${100 / gridSize.cols}%`;
    //     const cellHeight = `${100 / gridSize.rows}%`;
      
    //     cells.forEach(cell => {
    //       cell.style.width = cellWidth;
    //       cell.style.height = cellHeight;
    //     });
    //   };

    const handleGridSizeChange = (rows, cols) => {
        setGridSize({ rows, cols });
        // updateGridSize();
        resetGame();
    };

    const resetGame = () => {
        setPoints(0);
        setGameOver(false);
        direction.current = RIGHT;
        snakeCoordinates.current = [];
        snakeCoordinatesMap.current = new Set();
        foodCoords.current = { row: -1, col: -1 };
      
        const snake_postions = [];
        for (let i = 0; i < DEFAULT_LENGTH; i++) {
          snake_postions.push({
            row: 0,
            col: i,
            isHead: false,
          });
        }
      
        snake_postions[DEFAULT_LENGTH - 1].isHead = true;
        snakeCoordinates.current = snake_postions;
        syncSnakeCoordinatesMap();
        populateFoodBall();
    };

    const handleDirectionChange = (key) => {
        direction.current = getNewDirection(key);
    };

    const getNewDirection = (key) => {
        switch (key) {
            case "ArrowUp":
                return UP;
            case "ArrowDown":
                return DOWN;
            case "ArrowRight":
                return RIGHT;
            case "ArrowLeft":
                return LEFT;
            default:
                return direction.current;
        }
    };

    const syncSnakeCoordinatesMap = () => {
        const snakeCoordsSet = new Set(
            snakeCoordinates.current.map((coord) => `${coord.row}:${coord.col}`)
        );
        snakeCoordinatesMap.current = snakeCoordsSet;
    };

    const moveSnake = () => {
        if (gameOver) return;

        setPlaying((s) => s + 1);

        const coords = snakeCoordinates.current;
        const snakeTail = coords[0];
        const snakeHead = coords.pop();
        const curr_direction = direction.current;

        const foodConsumed =
            snakeHead.row === foodCoords.current.row &&
            snakeHead.col === foodCoords.current.col;

        coords.forEach((_, idx) => {
            if (idx === coords.length - 1) {
                coords[idx] = { ...snakeHead };
                coords[idx].isHead = false;
                return;
            }
            coords[idx] = coords[idx + 1];
        });

        switch (curr_direction) {
            case UP:
                snakeHead.row -= 1;
                break;
            case DOWN:
                snakeHead.row += 1;
                break;
            case RIGHT:
                snakeHead.col += 1;
                break;
            case LEFT:
                snakeHead.col -= 1;
                break;
            default:
              return direction.current;
        }

        if (foodConsumed) {
            setPoints((points) => points + 10);
            populateFoodBall();
            bonusAudio.play();
        }

        const collided = collisionCheck(snakeHead);
        if (collided) {
            stopGame();
            return;
        }

        coords.push(snakeHead);
        snakeCoordinates.current = foodConsumed
            ? [snakeTail, ...coords]
            : coords;
        syncSnakeCoordinatesMap();
    };

    const collisionCheck = (snakeHead) => {
        if (
            snakeHead.col >= gridSize.cols ||
            snakeHead.row >= gridSize.rows ||
            snakeHead.col < 0 ||
            snakeHead.row < 0
        ) {
            return true;
        }

        const coordsKey = `${snakeHead.row}:${snakeHead.col}`;
        if (snakeCoordinatesMap.current.has(coordsKey)) {
            return true;
        }
    };

    const populateFoodBall = async () => {
        const row = Math.floor(Math.random() * ROWs);
        const col = Math.floor(Math.random() * COLs);

        foodCoords.current = {
            row,
            col,
        };
    };

    const startGame = async () => {
        const interval = setInterval(() => {
            moveSnake();
        }, 100);

        timer.current = interval;
        gameAudio.play();
    };

    const stopGame = async () => {
        gameAudio.pause();
        errorAudio.play();
        setGameOver(true);
        setPlaying(false);
        if (timer.current) {
            clearInterval(timer.current);
        }
    };

    const getCell = useCallback(
        (row_idx, col_idx) => {
            const coords = `${row_idx}:${col_idx}`;
            const foodPos = `${foodCoords.current.row}:${foodCoords.current.col}`;
            const head =
                snakeCoordinates.current[snakeCoordinates.current.length - 1];
            const headPos = `${head?.row}:${head?.col}`;

            const isFood = coords === foodPos;
            const isSnakeBody = snakeCoordinatesMap.current.has(coords);
            const isHead = headPos === coords;

            let className = "cell";
            if (isFood) {
                className += " food";
            }
            if (isSnakeBody) {
                className += " body";
            }
            if (isHead) {
                className += " head";
            }

            return <div key={col_idx} className={className}></div>;
        },
        [isPlaying, gridSize]
    );

  
    return (
        <div className="app-container">
          {gameOver ? (
            <p className="game-over">GAME OVER</p>
          ) : (
            <button onClick={isPlaying ? stopGame : startGame}>
              {isPlaying ? "STOP" : "START"} GAME
            </button>
          )}
          <div className="board">
            {grid.current?.map((row, row_idx) => (
              <div key={row_idx} className="row">
                {row.map((_, col_idx) => getCell(row_idx, col_idx))}
              </div>
            ))}
          </div>
          <p className="score">SCORE {points}</p>
          <div className="keys-container">
            <button onClick={() => handleDirectionChange("ArrowUp")}>
              UP
            </button>
            <div className="key-row">
              <button onClick={() => handleDirectionChange("ArrowLeft")}>
                LEFT
              </button>
              <button onClick={() => handleDirectionChange("ArrowRight")}>
                RIGHT
              </button>
            </div>
            <button onClick={() => handleDirectionChange("ArrowDown")}>
              DOWN
            </button>
          </div>
          <div className="App">
            <div>
              <label>
                Rows:
                <input
                  type="number"
                  value={gridSize.rows}
                  onChange={(e) => handleGridSizeChange(e.target.value, gridSize.cols)}
                />
              </label>
              <label>
                Columns:
                <input
                  type="number"
                  value={gridSize.cols}
                  onChange={(e) => handleGridSizeChange(gridSize.rows, e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      );
}

export default App;
