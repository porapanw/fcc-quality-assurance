'use strict';


module.exports = function (app) {
  const mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;
  mongoose
    .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME, serverSelectionTimeoutMS: 30000 })
    .then(() => { console.log('database connected.') })
    .catch((err) => console.log(err.message));
  const issueSchema = new mongoose.Schema({
    "project": String,
    "issue_title": { type: String, required: true },
    "issue_text": { type: String, required: true },
    "created_on": Date,
    "updated_on": Date,
    "created_by": { type: String, required: true },
    "assigned_to": String,
    "open": Boolean,
    "status_text": String
  })
  const Issues = mongoose.model('Issues', issueSchema);
  const submitIssue = async (project,issue_title,issue_text,created_by,assigned_to,status_text,justNow) => {
    try {
      const newIssue = new Issues({
        "assigned_to": assigned_to,
        "status_text": status_text,
        "open": true,
        "project": project,
        "issue_title": issue_title,
        "issue_text": issue_text,
        "created_by": created_by,
        "created_on": justNow.toISOString(),
        "updated_on": justNow.toISOString()
      });
      return await newIssue.save();
    } catch(err) {console.error(err)};
  }

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      //show all the issues listed
      let project = req.params.project;
      console.log("Method: GET, Received project:", project);

      let query = {...req.query};

      if ( query.open == 'true' ) query.open = ( query.open === "true"); // open="true" results in true, open="false" results in false;

      try {
        query.project = project;
        const issues = await Issues.find(query);
        if ( issues.length == 0 ) {
          return res.json([]);
        } else {
          console.log('Success GET');
          return res.send(issues);
        }
      } catch(err) {
        console.error(err);
        return res.send('error: ',err);
      }      
    })
    
    .post(async (req, res) => {
      // submit new issues
      let project = req.params.project;
      console.log("Method: POST, Received project:", project);
      let { issue_title,issue_text,created_by,assigned_to,status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      if ( !assigned_to ) { console.log('blank assign'); assigned_to = ''};
      if ( !status_text ) { console.log('blank status'); status_text = ''};
      
      try {
        // upload to database
        const justNow = new Date();
        // console.log(issue_title, issue_text, created_by, assigned_to, status_text, justNow);
        await submitIssue(project,issue_title,issue_text,created_by,assigned_to,status_text,justNow);
        console.log('data is successfully added');
        const issue = await Issues.find({ "issue_title": issue_title,"created_on": justNow.toISOString()  });
        console.log('data is successfully found');
        console.log(issue);
        res.json({
          "assigned_to":issue[0].assigned_to,
          "status_text":issue[0].status_text,
          "open":true,
          "_id":issue[0]._id,
          "issue_title":issue[0].issue_title,
          "issue_text":issue[0].issue_text,
          "created_by":issue[0].created_by,
          "created_on":issue[0].created_on,
          "updated_on":issue[0].updated_on
        });
      } catch(err) {
        res.send('error: ',err);
      };
      
    })
    
    .put(async (req, res) => {
      // update issues from id
      let project = req.params.project;
      let { _id,issue_title,issue_text,created_by,assigned_to,status_text,open } = req.body;

      console.log("Method: PUT, Received project:", project);
      console.log("PUT req.body: ",req.body);

      try {
        if (!_id) { return res.json({ error: "missing _id"})}

        if (ObjectId.isValid(_id)==false) {
          console.log('_id is invalid');
          return res.json({ "error": "could not update", "_id": _id })
        }

        if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
          return res.json({ error: 'no update field(s) sent', '_id': _id })
        }

        if (open !== undefined) {
          open = open === 'true'; // Convert string to boolean
        }

        const issue = await Issues.findById(_id);
        if (!issue) {
          console.log('could not find this id');
          return res.json({ "error": "could not update", "_id": _id })
        }
        console.log('issue found: ', issue)

        let updatedOn = new Date(); 
        req.body.updated_on = updatedOn;
        console.log(req.body);

        const updatedIssue = await Issues.findByIdAndUpdate(_id, req.body, {new: true});
        console.log("updatedIssue: ",updatedIssue);
        if ( !updatedIssue ) {
          return res.json({ "error": "could not update", "_id": _id })
        }
        console.log('successfully updated')
        res.json({ "result": "successfully updated", "_id": _id })
      } catch(err) {
        console.error(err);
        return res.json({ "error": "could not update", "_id": _id })
      };      
    })
    
    .delete(async (req, res) => {
      let project = req.params.project;
      const { _id } = req.body;
      if ( !_id ) {
        return res.json({
          "error": 'missing _id',
          "_id": _id
        })
      }
      console.log("Method: DELETE, Received project:", project);
      try {        
        const issue = await Issues.findOneAndDelete({ "_id": _id });
        // console.log(issue);
        if ( !issue ) {
          return res.json({
            "error": "could not delete",
            "_id": _id
          })
        } else {
          return res.json({
            "result": "successfully deleted",
            "_id": _id
          })
        }        
      } catch(err){
        console.error(err);
        return res.json({
          "error": "could not delete",
          "_id": _id
        })
      }       
    });
    
};
