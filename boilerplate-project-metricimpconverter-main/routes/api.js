'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  app.get('/api/convert',(req, res) => {
    let convertHandler = new ConvertHandler();
    const input = req.query.input;
    console.log(req.query); // Logs the query parameters

    let initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);
    console.log(initNum + ',' + initUnit);
    
    if (initNum == 'invalid number' && initUnit) {
      console.log("Detected invalid number: " + initNum);
      console.log("About to send 'invalid number'");
      res.send("invalid number");
      console.log("Response sent for invalid number");
      return;
    } else if ( (!initNum || initNum == 'invalid number') && !initUnit) {
      console.log("invalid number and unit");
      console.log("About to send 'invalid number and unit'");
      res.send("invalid number and unit");
      console.log("Response sent for invalid number and unit");
      return;
    } else if (initNum && !initUnit) {
      console.log("invalid unit");
      console.log("About to send 'invalid unit'");
      res.send("invalid unit");
      console.log("Response sent for invalid unit");
      return;
    } else {
      const returnNum = convertHandler.convert(initNum,initUnit);
      const returnUnit = convertHandler.getReturnUnit(initUnit);
      console.log('returnNum:' + returnNum +', returnUnit: ' + returnUnit);
      console.log(initNum, initUnit, returnNum, returnUnit);
      const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      console.log(string);
      res.json({
        initNum: initNum,
        initUnit: initUnit,
        returnNum: Number(returnNum),
        returnUnit: returnUnit,
        string: string
      })
    }
  })

  app.use((err, req, res, next) => {
    // This could be sending a response after res.send() in the route.
    res.status(500).send('Internal Server Error');
  });
  
};
