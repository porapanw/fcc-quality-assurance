const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.validate(puzzle), 'Valid puzzle string should pass validation');
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5....X9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..';
    assert.isFalse(solver.validate(puzzle), 'Puzzle string with invalid characters should fail validation');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1...';
    assert.isFalse(puzzle.length === 81, 'Puzzle string not 81 characters should fail');
  });

  test('Logic handles a valid row placement', () => {
    const grid = solver.createGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..');
    assert.isTrue(solver.checkRowPlacement(grid, 0, '3'), 'Valid row placement should return true');
  });

  test('Logic handles an invalid row placement', () => {
    const grid = solver.createGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..');
    assert.isFalse(solver.checkRowPlacement(grid, 10, '2'), 'Invalid row placement should return false');
  });

  test('Logic handles a valid column placement', () => {
    const grid = solver.createGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..');
    assert.isTrue(solver.checkColPlacement(grid, 1, '3'), 'Valid column placement should return true');
  });

  test('Logic handles an invalid column placement', () => {
    const grid = solver.createGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..');
    assert.isFalse(solver.checkColPlacement(grid, 11, '4'), 'Invalid column placement should return false');
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const grid = solver.createGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..');
    assert.isTrue(solver.checkRegionPlacement(grid, 0, 0, '3'), 'Valid region placement should return true');
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const grid = solver.createGrid('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..');
    assert.isFalse(solver.checkRegionPlacement(grid, 0, 10, '2'), 'Invalid region placement should return false');
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.solve(puzzle), '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....X..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..';
    assert.isFalse(solver.solve(puzzle), 'Invalid puzzle string should not be solvable');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const solution = solver.solve(puzzle);
    assert.strictEqual(solution, '568913724342687519197254386685479231219538467734162895926345178473891652851726943', 'Solver should return the expected solution');
  });
});
