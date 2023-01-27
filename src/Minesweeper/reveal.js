import neighbours from "./neighbours";
import produce from "immer"
const reveal = (e, i, j, grid, setGrid, gameStatus, setGameStatus) => {
  e.preventDefault();
  if (grid[i][j].revealed === true) return
  //right click flagging
  if (e.type === 'contextmenu' && grid[i][j].revealed === false && typeof gameStatus === 'number') {
    let prev = grid[i][j].flagged;
    if (prev === false) setGameStatus(prev => prev - 1);
    else if (prev === true) setGameStatus(prev => prev + 1);
    let temp = produce(grid, (draft) => {
      Object.assign(draft[i][j], { flagged: !prev })
    })
    setGrid(temp);
  }
  //right click reveal(middlemouse button in orginal game)
  //will implement later
  //else if (e.type === 'contextmenu' && grid[i][j].revealed === true) {
  //}
  //left click
  else if (grid[i][j].flagged === false) {
    let temp = produce(grid, (draft) => {
      Object.assign(draft[i][j], { revealed: true })
      if (draft[i][j].value === 0) emptyReveal(i, j, draft, grid);
    //incase it is a bomb
    if (grid[i][j].value === '💣') {
      setGameStatus("GAME OVER")
      const h = grid.length;
      const w = grid[0].length;
      for (let x = 0; x < h; x++) {
        for (let y = 0; y < w; y++) {
          if (grid[x][y].revealed === false) {
            Object.assign(draft[x][y], { revealed: true })
          }
        }
      }
    }
      //win check
    const hiddenCells= grid.flat().filter(cell => !cell.revealed)
      // console.log(hiddenCells);
    if(hiddenCells.length===24)//grid length^2 /10 is bomb count
    {
      setGameStatus("You Won!");
      for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid.length; y++) {
          if (grid[x][y].revealed === false) {
            Object.assign(draft[x][y], { revealed: true })
          }
        }
      }
    }
    })
    setGrid(temp);
  }
}
let memo = {};
const emptyReveal = (i, j, draft, grid) => {
  let surr = neighbours(i, j, grid);
  surr.map(cell => {
    if (!cell.revealed && typeof cell.value === 'number' && !(`${cell.r},${cell.c}` in memo)) {
      Object.assign(draft[cell.r][cell.c], { revealed: true })
      if (cell.value >= 0) memo[`${cell.r},${cell.c}`] = -1;//visited
      if (cell.value === 0) {
        emptyReveal(cell.r, cell.c, draft, grid)
        memo[`${cell.r},${cell.c}`] = -1;//visited
      }
    }
    return null;
  })
  return draft;
}
export default reveal
