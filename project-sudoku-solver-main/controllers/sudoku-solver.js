class SudokuSolver {
  createGrid(puzzleString) {
    console.log('createGrid puzzle string:',puzzleString);
    const array = puzzleString.split('');
    let grid = [];
    for (let r = 1; r <= 9; r++) {
      let start = 9*(r-1), stop = (9*r);
      let row = array.slice(start,stop);
      grid.push(row);
    }
    return grid;
  }

  validate(puzzleString) {
    // console.log('validate: ');
    // check string
    const regex = /^[\d.]+$/;
    if (puzzleString.length != 81 || !regex.test(puzzleString)) return false;
    const grid = this.createGrid(puzzleString);
    // check duplicates
    const rows = new Array(9).fill(null).map(()=> new Set());
	  const cols = new Array(9).fill(null).map(()=> new Set());
	  const boxes = new Array(9).fill(null).map(()=> new Set());
	  for (let  r = 0; r < 9; r++) {
		  for (let c = 0; c < 9; c++) {
			  const value = grid[r][c];
			  if (value === ".") continue;
			  const boxIndex = Math.floor(r/3)*3 + Math.floor(c/3);
			  if (rows[r].has(value) || cols[c].has(value) || boxes[boxIndex].has(value)) return false;
			  rows[r].add(value);
			  cols[c].add(value);
			  boxes[boxIndex].add(value);
		  }
	  }
    return true
  }

  checkRowPlacement(grid, row, value) {
    // console.log('checkRowPlacement: ',!grid[row].includes(value));
    if (row >= 9) return false;
    return !grid[row].includes(value);
  }

  checkColPlacement(grid, col, value) {
    // console.log('checkColPlacement: ',grid);
    if (col >= 9) return false;
    return !grid.some(row => row[col] === value);
  }

  checkRegionPlacement(grid, row, col, value) {
    if (row >= 9 || col >= 9) return false;
    const boxRow = Math.floor(row/3)*3;
    const boxCol = Math.floor(col/3)*3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[boxRow + r][boxCol + c] === value) return false;
      }
    }
    // console.log('checkRegionPlacement: ',true)
    return true;
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) return false;
    const grid = this.createGrid(puzzleString);
    
    const isValid = (grid,row,col,value) => {
      return (
        this.checkRowPlacement(grid,row,value) &&
        this.checkColPlacement(grid,col,value) &&
        this.checkRegionPlacement(grid,row,col,value) 
      );
    }

    // solve puzzle
    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === '.') {
            for (let num = 1; num <= 9; num++) {
              if (isValid(grid,row,col,String(num))) {
                grid[row][col] = String(num); // place number
                if (solve()) return true;
                grid[row][col] = '.'; // backtrack
              }
            }
            return false; // no valid number found
          }
        }
      }
      return true; // solved all cells
    };
    
    return solve() ? grid.flat().join('') : false;
  }
}

module.exports = SudokuSolver;

