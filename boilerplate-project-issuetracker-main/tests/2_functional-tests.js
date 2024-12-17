const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({ 
        "issue_title": "Performance Lag" ,
        "issue_text": "App is slow during peak hours.",
        "created_by": "George King",
        "assigned_to": "Fiona Clark",
        "status_text": "In QA"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Performance Lag");
        assert.equal(res.body.issue_text, "App is slow during peak hours.");
        assert.equal(res.body.created_by, "George King");
        assert.equal(res.body.assigned_to, "Fiona Clark");
        assert.equal(res.body.status_text, "In QA");
        done()
      })
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        "issue_title": "Performance Lag" ,
        "issue_text": "App is slow during peak hours.",
        "created_by": "George King"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Performance Lag");
        assert.equal(res.body.issue_text, "App is slow during peak hours.");
        assert.equal(res.body.created_by, "George King");
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        done();
      })
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send()
      .end((err, res) => {
        if (err) return done(err);
        assert.equal(res.status, 200);        
        assert.equal(res.json, undefined);
        done();
      })
  });

  test('View issues on a project: GET request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .end((err, res) => {
        assert.isArray(res.body);
        done();
      })
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .get('/api/issues/apitest?open=true')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body[0].open, true);
        done();
      })
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .get('/api/issues/apitest?open=true&assigned_to=Joe')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body[0], undefined);
        done();
      })
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        "_id": '6760f93b1f7c44cb712e9e8b',
        "issue_title": "Performance Lag"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated"); 
        assert.equal(res.body._id, '6760f93b1f7c44cb712e9e8b');
        done();
      })
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        "_id": '6760f93b1f7c44cb712e9e8b',
        "issue_title": "Performance Lag" ,
        "issue_text": "App is slow during peak hours.",
        "created_by": "George King",
        "assigned_to": "Fiona Clark",
        "status_text": "In QA"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated"); 
        assert.equal(res.body._id, '6760f93b1f7c44cb712e9e8b');
        done();
      })
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({       
        "issue_title": "Performance Lag" ,
        "issue_text": "App is slow during peak hours.",
        "created_by": "George King",
        "assigned_to": "Fiona Clark",
        "status_text": "In QA"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id"); 
        done();
      })
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        "_id": '6760f135900585a4034e3e40',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent'); 
        assert.equal(res.body._id, '6760f135900585a4034e3e40');
        done();
      })
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}',(done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        "_id": 'abcd',
        "issue_title": "Performance Lag" ,
        "issue_text": "App is slow during peak hours.",
        "created_by": "George King",
        "assigned_to": "Fiona Clark",
        "status_text": "In QA"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update"); 
        assert.equal(res.body._id, 'abcd');
        done();
      })
  });

  test('Delete an issue: DELETE request to /api/issues/{project}',(done) => {
    chai.request(server)
      .delete('/api/issues/apitest')
      .send({ "_id": "6760f94c1f7c44cb712e9ecf" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, "6760f94c1f7c44cb712e9ecf");
        done();
      })
  });

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}',(done) => {
    chai.request(server)
      .delete('/api/issues/apitest')
      .send({ "_id": "7760181e00dd8897c8745310" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body.id, null );
        done();
      })
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}',(done) => {
    chai.request(server)
      .delete('/api/issues/apitest')
      .send()
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id" );
        assert.equal(res.body.id, undefined);
        done();
      })
  });
});
