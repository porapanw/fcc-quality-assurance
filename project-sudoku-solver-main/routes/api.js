'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      // let updatedGrid = grid;
      
      // check all validity
      console.log('coordinate: ', coordinate)
      if ( !puzzle || !coordinate || !value ) return res.json({ "error": "Required field(s) missing" });
      if ( !coordinate.match(/^[a-iA-I][1-9]$/)) return res.json({ "error": "Invalid coordinate" });
      if ( !value.match(/^[1-9]$/) ) return res.json({ "error": "Invalid value" });
      if ( puzzle.length != 81) return res.json({ "error": "Expected puzzle to be 81 characters long" });
      if ( puzzle.match(/[^1-9.]/)) return res.json({ "error": "Invalid characters in puzzle" });

      const grid = solver.createGrid(puzzle);

      // convert coor to row and col
      const rowCoor = {'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7,'i':8};
      const row = rowCoor[coordinate[0].toLowerCase()];
      const col = Number(coordinate[1]-1);

      // validate the puzzle
      if (!solver.validate(puzzle)) return res.json({ "error": "Puzzle cannot be solved"});
      if (grid[row][col] == value) return res.json({ "valid": true })
      const checkRow = solver.checkRowPlacement(grid,row,value);
      const checkCol = solver.checkColPlacement(grid,col,value);
      const checkRegion = solver.checkRegionPlacement(grid,row,col,value);
      if (checkRow && checkCol && checkRegion) {
        console.log(checkRow,checkCol,checkRegion)
        return res.json({ "valid": true })
      }
      else {
        const conflict = [];
        if (!checkRow) conflict.push('row');
        if (!checkCol) conflict.push('column');
        if (!checkRegion) conflict.push('region');
        console.log(checkRow,checkCol,checkRegion)
        return res.json({ "valid": false, 'conflict': conflict });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) return res.json({ error: 'Required field missing' });
      if (puzzle.length !== 81) return res.json({ error: 'Expected puzzle to be 81 characters long' });
      if (!/^[\d.]{81}$/.test(puzzle)) return res.json({ error: 'Invalid characters in puzzle' });
      if (!solver.validate(puzzle)) return res.json({ "error": "Puzzle cannot be solved"});
      const solution = solver.solve(puzzle);
      if (!solution) return res.json({ error: 'Puzzle cannot be solved' });
      console.log('solution: ', solution);
      if (solution.error) return res.json(solution);
      return res.json({ solution });
    });
};
