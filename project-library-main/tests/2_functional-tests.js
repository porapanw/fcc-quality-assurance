/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */



  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({"title": "Threads of the Eternal Loom"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "Threads of the Eternal Loom");
            assert.property(res.body, '_id');
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send()
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      this.beforeEach((done) => {
        chai.request(server)
          .post('/api/books')
          .send({"title": 'Test Book for GET'})
          .end((err,res) => {
            if (err) return done(err);
            testId = res.body._id;
            done();
          })
      });
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/67611f41c7aa2100134ff666')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${testId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Test Book for GET');
            assert.notEqual(res.body._id, undefined);
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      this.beforeEach((done) => {
        chai.request(server)
          .post('/api/books')
          .send({"title": 'Test Book for POST'})
          .end((err,res) => {
            if (err) return done(err);
            testId = res.body._id;
            done();
          })
      });

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${testId}`)
          .send({ 
            "comment": "Test comment"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, testId);
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/67613a0372ce626d2b491fe6')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment')
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/67613bd1c7aa2100134ff686')
          .send({ 
            "comment": "Test comment"})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      this.beforeEach((done) => {
        chai.request(server)
          .post('/api/books')
          .send({"title": 'Test Book for DELETE'})
          .end((err,res) => {
            if (err) return done(err);
            testId = res.body._id;
            done();
          })
      });

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${testId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/67612bd8c7aa2100134ff67e')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });

    });

  });

});
