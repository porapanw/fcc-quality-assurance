const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  // Tests for /api/solve
  test('Solve a puzzle with valid puzzle string: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, '218396745753284196496157832531672984649831257827549613962415378185763429374928561');
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....X9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1...' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '55.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  // Tests for /api/check
  test('Check a puzzle placement with all fields: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '7',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '2',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.property(res.body, 'conflict');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '1',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.property(res.body, 'conflict');
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
        coordinate: 'A1',
        value: '3',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
        coordinate: 'W2',
        value: '3',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1...',
        coordinate: 'A2',
        value: '3',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..',
        coordinate: 'Z9',
        value: '3',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..8.....6.1.9....523..9....9..',
        coordinate: 'A2',
        value: '10',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
});

