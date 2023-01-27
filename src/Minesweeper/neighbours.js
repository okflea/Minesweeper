const neighbours = (i, j,grid) => {
  let res=[];
  const surr=[
    [1,0],
    [0,1],
    [-1,0],
    [0,-1],
    [1,1],
    [-1,-1],
    [-1,1],
    [1,-1]
  ]
  const h=grid.length;
  const w=grid[0].length;
  surr.forEach(([x,y])=>{
    const newI = i+x;
    const newJ = j+y;
  if(newI>=0 && newI<h && newJ>=0 &&newJ<w){
      res.push(grid[newI][newJ])
    }
  })
  return res;
}
export default neighbours
