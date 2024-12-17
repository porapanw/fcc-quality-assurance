/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {
  const mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;
  mongoose.connect( process.env.DB, 
    { "dbName": process.env.DB_NAME, 
      serverSelectionTimeoutMS: 30000 
    }).then(() => console.log('database connected'))
      .catch((err) => console.error(err));
  const bookSchema = new mongoose.Schema({
    "title": { type: String, required: true },
    "comment": [String],
    "commentcount": { type: Number, default: 0}
  })
  const Books = mongoose.model('Books', bookSchema);
  const addBook = async (title) => {
    try {
      const newBook = new Books({ "title": title });
      console.log('successfully added a new book: ',title);
      return await newBook.save();
    } catch(err) {console.error(err)};
  }
  const addComment = async (id,comment) => {
    try { 
      const theBook = await Books.findById(id);
      if ( !theBook ) return false;
      theBook.comment.push(comment);
      theBook.commentcount = theBook.comment.length;
      return await theBook.save();
    } catch(err) {console.error(err)};
  }

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Books.find().select('-comment');
        res.json(books);
      } catch(err) {console.error(err)};
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      console.log(title);
      //response will contain new book object including atleast _id and title
      try {
        if ( !title ) return res.send('missing required field title');
        const foundBook = await Books.find({ "title": title });
        if ( foundBook[0] ) return res.json(foundBook[0]);
        const newBook = await addBook(title);
        console.log('successfully added a new book');
        res.json({ "_id": newBook._id, "title": newBook.title});
      } catch(err) {console.error(err)}
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        await Books.deleteMany({});
        res.send("complete delete successful")
      } catch(err) {console.error(err)}
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        if ( !ObjectId.isValid(bookid) ) return res.send('no book exists');
        const book = await Books.findById(bookid);
        if ( !book ) return res.send('no book exists');
        res.json({
          "_id": bookid,
          "title": book.title,
          "comments": book.comment,
          "commentcount": book.commentcount
        })
      } catch(err){console.error(err)}
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try {
        if ( !comment ) return res.send('missing required field comment');
        const newBookComment = await addComment(bookid,comment);
        if ( !newBookComment ) return res.send('no book exists');
        console.log('succesfully added a comment to bookid: ',bookid);
        res.json({
          "_id": bookid,
          "title": newBookComment.title,
          "comments": newBookComment.comment,
          "commentcount": newBookComment.commentcount
        })
      } catch(err){console.error(err)}
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const deletedBook = await Books.findOneAndDelete({"_id": bookid});
        if ( !deletedBook ) return res.send('no book exists');
        res.send('delete successful');
      } catch(err){console.error(err)}

    });
  
};
