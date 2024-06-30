import React, { useState, useEffect } from "react";

type Square = {
  row: number;
  col: number;
  isRevealed: boolean;
  isBomb: boolean;
  isEmpty: boolean;
  isFlagged: boolean;
  neighborBombs: number;
};

const numRows = 10;
const numCols = 10;
const numBombs = 20;

const generateSquares = (): Square[][] => {
  const squares: Square[][] = [];
  for (let i = 0; i < numRows; i++) {
    squares[i] = [];
    for (let j = 0; j < numCols; j++) {
      squares[i][j] = {
        row: i,
        col: j,
        isRevealed: false,
        isBomb: false,
        isEmpty: false,
        isFlagged: false,
        neighborBombs: 0,
      };
    }
  }
  return squares;
};

const generateBombs = (squares: Square[][], firstClick: Square) => {
  let bombsPlaced = 0;
  while (bombsPlaced < numBombs) {
    const randRow = Math.floor(Math.random() * numRows);
    const randCol = Math.floor(Math.random() * numCols);
    if (
      !squares[randRow][randCol].isBomb &&
      (randRow !== firstClick.row || randCol !== firstClick.col)
    ) {
      squares[randRow][randCol].isBomb = true;
      bombsPlaced++;
    }
  }
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<
    "ready" | "playing" | "won" | "lost"
  >("ready");
  const [squares, setSquares] = useState<Square[][]>([]);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    setSquares(generateSquares());
  }, []);

  useEffect(() => {
    if (gameState === "playing") {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleSquareClick = (row: number, col: number) => {
    if (gameState === "ready") {
      setGameState("playing");
      generateBombs(squares, squares[row][col]);
    }

    const newSquares = [...squares];
    const square = newSquares[row][col];
    if (square.isFlagged || square.isRevealed) return;

    if (square.isBomb) {
      setGameState("lost");
    } else {
      square.isRevealed = true;
      newSquares[row][col] = square;

      if (square.neighborBombs === 0) {
        revealEmptySquares(newSquares, row, col);
      }

      setSquares(newSquares);
      checkGameWon(newSquares);
    }
  };

  const revealEmptySquares = (
    squares: Square[][],
    row: number,
    col: number
  ) => {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
          const neighSquare = squares[i][j];
          if (!neighSquare.isRevealed) {
            neighSquare.isRevealed = true;
            squares[i][j] = { ...neighSquare };
            if (neighSquare.neighborBombs === 0) {
              revealEmptySquares(squares, i, j);
            }
          }
        }
      }
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;

    const newSquares = [...squares];
    const square = newSquares[row][col];
    if (square.isRevealed) return;

    square.isFlagged = !square.isFlagged;
    newSquares[row][col] = square;
    setSquares(newSquares);

    checkGameWon(newSquares);
  };

  const checkGameWon = (currentSquares: Square[][]) => {
    let squaresRevealed = 0;
    let squaresFlagged = 0;
    currentSquares.forEach((row) => {
      row.forEach((square) => {
        if (square.isRevealed) squaresRevealed++;
        if (square.isFlagged) squaresFlagged++;
      });
    });

    const totalSquares = numRows * numCols;
    const totalBombs = numBombs;
    if (
      squaresRevealed + squaresFlagged === totalSquares &&
      squaresFlagged === totalBombs
    ) {
      setGameState("won");
    }
  };

  const renderSquare = (row: number, col: number) => {
    const square = squares[row][col];
    let className = "square ";
    if (square.isRevealed) {
      className += "revealed ";
      if (square.isBomb) {
        className += "bomb ";
      }
    } else {
      className += "unrevealed ";
    }

    return (
      <div
        key={`${row}-${col}`}
        className={className}
        onClick={() => handleSquareClick(row, col)}
        onContextMenu={(e) => handleRightClick(e, row, col)}
      >
        {square.isRevealed
          ? square.isBomb
            ? "💣"
            : square.neighborBombs > 0
            ? square.neighborBombs
            : ""
          : square.isFlagged
          ? "🚩"
          : ""}
      </div>
    );
  };

  const resetGame = () => {
    setGameState("ready");
    setSquares(generateSquares());
    setTimer(0);
  };

  return (
    <div>
      <div className="header">
        <div className="timer">{timer}</div>
        <div className="game-status">
          {gameState === "playing"
            ? "Playing"
            : gameState === "won"
            ? "You Won!"
            : "You Lost!"}
        </div>
        <button onClick={resetGame}>Restart Game</button>
      </div>
      <div className="board">
        {squares.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((square, colIndex) => renderSquare(rowIndex, colIndex))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
