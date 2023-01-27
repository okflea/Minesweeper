const mineCount = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j].value === '💣') continue;
      else {
        grid[i][j].value = check(grid, i - 1, j) + check(grid, i + 1, j) + check(grid, i, j + 1) + check(grid, i, j - 1) + check(grid, i - 1, j - 1) + check(grid, i + 1, j + 1) + check(grid, i - 1, j + 1) + check(grid, i + 1, j - 1);
      }
    }
  }
  // console.log(grid)
  return grid;
}
const check = (grid, r, c) => {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return 0;
  else if (grid[r][c].value === '💣') return 1;
  else return 0;
}
// mineCount([[0, 'X', 0], [0, 0, 0], ['X', 0, 'X']])
export default mineCount
/*
  1 x 1
  2 3 2
  x 2 x
*/
