import mineCount from "./mineCount";
const createBoard = (r, c, bomb) => {
  bomb = r * c / 10;
  let grid = [];
  for (let i = 0; i < r; i++) {
    let sub = [];
    for (let j = 0; j < c; j++) {
      sub.push({
        revealed: false,
        flagged: false,
        value: 0,
        r: i,
        c: j,
      })
    }
    grid.push(sub);
  }
  //placing bombs
  let bombCount = 0;
  while (bombCount < bomb) {
    let x = Math.floor(Math.random() * r);
    let y = Math.floor(Math.random() * c);
    if (grid[x][y].value === 0) {
      grid[x][y].value = '💣';
      bombCount++;
    }
  }
  grid = mineCount(grid);
  // console.table(grid);
  return grid;
}
export default createBoard;
