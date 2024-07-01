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
        isEmpty: true,
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
      squares[randRow][randCol].isEmpty = false;
      bombsPlaced++;

      // Update neighboring bomb counts
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = randRow + i;
          const newCol = randCol + j;
          if (
            newRow >= 0 &&
            newRow < numRows &&
            newCol >= 0 &&
            newCol < numCols &&
            !(i === 0 && j === 0)
          ) {
            squares[newRow][newCol].neighborBombs++;
          }
        }
      }
    }
  }
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<
    "ready" | "playing" | "won" | "lost"
  >("ready");
  const [squares, setSquares] = useState<Square[][]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [flagsRemaining, setFlagsRemaining] = useState<number>(numBombs);

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
      square.isRevealed = true; // Reveal the clicked bomb
      setGameState("lost");
      console.log("Bomb clicked. Game Over.");
      revealAllBombs(newSquares); // Reveal all bombs
    } else {
      // Use BFS to reveal empty squares
      const stack: { row: number; col: number }[] = [{ row, col }];

      while (stack.length > 0) {
        const { row, col } = stack.pop()!;
        const currentSquare = newSquares[row][col];

        if (currentSquare.isRevealed || currentSquare.isFlagged) continue;

        currentSquare.isRevealed = true;
        newSquares[row][col] = { ...currentSquare };

        if (currentSquare.neighborBombs === 0) {
          // Check all neighbors
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;

              if (
                newRow >= 0 &&
                newRow < numRows &&
                newCol >= 0 &&
                newCol < numCols &&
                !(i === 0 && j === 0)
              ) {
                stack.push({ row: newRow, col: newCol });
              }
            }
          }
        }
      }

      setSquares(newSquares);
      checkGameWon(newSquares);
    }
  };

  const revealAllBombs = (squares: Square[][]) => {
    squares.forEach((row) => {
      row.forEach((square) => {
        if (square.isBomb) {
          square.isRevealed = true;
        }
      });
    });
    setSquares([...squares]);
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;

    const newSquares = [...squares];
    const square = newSquares[row][col];
    if (square.isRevealed) return;

    if (square.isFlagged) {
      setFlagsRemaining(flagsRemaining + 1);
    } else {
      setFlagsRemaining(flagsRemaining - 1);
    }

    square.isFlagged = !square.isFlagged;
    newSquares[row][col] = square;
    setSquares(newSquares);
    checkGameWon(newSquares);
  };

  const checkGameWon = (currentSquares: Square[][]) => {
    let squaresRevealed = 0;

    currentSquares.forEach((row) => {
      row.forEach((square) => {
        if (square.isRevealed && !square.isBomb) {
          squaresRevealed++;
        }
      });
    });

    const totalNonBombSquares = numRows * numCols - numBombs;

    if (squaresRevealed === totalNonBombSquares) {
      setGameState("won");
      console.log("Game Won!");
    }
  };

  const resetGame = () => {
    setGameState("ready");
    setSquares(generateSquares());
    setTimer(0);
    setFlagsRemaining(numBombs);
  };
  const getNumberColor = (number: any) => {
    const colors = [
      "text-blue-500",
      "text-green-500",
      "text-red-500",
      "text-purple-500",
      "text-yellow-500",
      "text-pink-500",
      "text-indigo-500",
      "text-gray-500",
    ];
    return colors[number - 1] || colors[colors.length - 1];
  };
  return (
    <div className="flex flex-col items-center p-4">
      <div className="glass mb-4 flex w-full items-center justify-between rounded-lg border border-slate-300 p-4 dark:border-slate-500">
        <div className="flex items-center space-x-4">
          <div className="timer flex items-center space-x-2 text-2xl font-bold text-gray-700 dark:text-gray-200">
            <span className="text-3xl">⏳</span>
            <span>{timer}</span>
          </div>
          <div className="flags-remaining flex items-center space-x-2 text-2xl font-bold text-gray-700 dark:text-gray-200">
            <span className="text-3xl">🚩</span>
            <span>{flagsRemaining}</span>
          </div>
        </div>
        <div className="game-status text-2xl font-bold text-gray-700 dark:text-gray-200">
          {gameState === "playing"
            ? "🎮 Playing"
            : gameState === "won"
            ? "🎉 You Won!"
            : gameState === "lost"
            ? "💥 You Lost!"
            : "🔍 Ready"}
        </div>
        <button
          className="rounded-lg  p-3 text-2xl text-white transition-transform hover:scale-110  dark:text-gray-200"
          onClick={resetGame}
        >
          🔄
        </button>
      </div>

      <div className="board grid grid-cols-10 gap-1 rounded-lg bg-slate-300 p-4 shadow-lg dark:bg-slate-700">
        {squares.flat().map((square) => (
          <div
            key={`${square.row}-${square.col}`}
            className={`flex h-10 w-10 items-center justify-center rounded ${
              square.isRevealed
                ? "bg-slate-100 dark:bg-slate-600"
                : "cursor-pointer bg-slate-400 hover:bg-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700"
            } text-slate-800 transition-colors duration-200 dark:text-slate-200`}
            onClick={() => handleSquareClick(square.row, square.col)}
            onContextMenu={(e) => handleRightClick(e, square.row, square.col)}
          >
            {square.isRevealed ? (
              square.isBomb ? (
                "💣"
              ) : square.neighborBombs > 0 ? (
                <span
                  className={`font-bold ${getNumberColor(
                    square.neighborBombs
                  )}`}
                >
                  {square.neighborBombs}
                </span>
              ) : (
                ""
              )
            ) : square.isFlagged ? (
              "🚩"
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
