import { useContext } from "react";
import reveal from "./reveal";
import {appContext} from "./context.js";
const Cell = ({i,j,element}) => {
  const {grid,setGrid,gameStatus,setGameStatus} = useContext(appContext)
  return (
    <div style={{
      border: '8px solid',
      borderStyle: element.revealed?'inset':'outset',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bolder',
      backgroundColor:element.revealed?(i+j)%2==0?'#415a77':'#778da9':(i+j)%2==0?'#0d1b2a':'#1b263b',
    }}
      onClick={(e) => reveal(e, i, j, grid, setGrid, gameStatus, setGameStatus)}
      onContextMenu={(e) => reveal(e, i, j, grid, setGrid, gameStatus, setGameStatus)}
      >
      {element.revealed ? element.value === 0 ? '' : element.value : ''}
      {element.flagged ? '🚩' : ''}
    </div>
  )
}

export default Cell
