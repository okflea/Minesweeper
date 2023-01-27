import WinScreen from "./WinScreen";
import { useEffect, useState } from "react";
import createBoard from "./createBoard";
import Cell from "./Cell";
import {appContext} from "./context.js";
const Board = () => {
  let dimension = {
    row: 15,
    col: 15
  }
  let bombsLeft = Math.ceil((dimension.row * dimension.col) / 10);
  let [grid, setGrid] = useState(null);
  let [gameStatus, setGameStatus] = useState(bombsLeft);
  useEffect(() => {
    setGrid(createBoard(dimension.row, dimension.col, bombsLeft));
  }, [])
  if (grid == null) return <div>loading</div>
  const handleReset = () => {
    setGrid(createBoard(dimension.row, dimension.col, 3));
    setGameStatus(bombsLeft)
  }
  return (
    <>
      <appContext.Provider
        value={{
          grid, setGrid, gameStatus, setGameStatus
        }}>
        <div style={{width:'100',overflow:'hidden'}}>
        <button 
            style={{
              width:'90px',
              float:'left',
            }}
            onClick={handleReset}>Reset</button>
        <h2 style={{
            marginLeft:'320px'
          }}>
            {typeof gameStatus === 'number' ? gameStatus > 1 ? `${gameStatus} bombs left ` : gameStatus === 1 ? `${gameStatus} bomb left ` : gameStatus === 0 ? `All bombs are flagged` : gameStatus === -1 ? `${Math.abs(gameStatus)} excess flag marked` : `${Math.abs(gameStatus)} excess flags marked ` : gameStatus}</h2>
            {gameStatus==='You Won!'?(<WinScreen/>):<div></div>}

        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${dimension.col},50px)`,
          gridTemplateRows: `repeat(${dimension.row},50px)`,
        }}>
          {grid.map((row, i) => row.map((ele, j) =>
          (
            <Cell i={i} j={j} element={ele} key={`${i},${j}`} />
          )))}
        </div>
      </appContext.Provider>
    </>
  )
}

export default Board
