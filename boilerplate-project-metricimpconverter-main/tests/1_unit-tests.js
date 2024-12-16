const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  test('whole number input', () => {
    assert.equal(convertHandler.getNum('4gal'),4);
  })
  test('decimal input', () => {
    assert.equal(convertHandler.getNum('4.5gal'),4.5);
  })
  test('fractional input', () => {
    assert.equal(convertHandler.getNum('3/5lbs'), 3/5);
  })
  test('fractional with decimal input', () => {
    assert.equal(convertHandler.getNum('3.5/4gal'), 3.5/4);
  })
  test('double fraction return error', () => {
    assert.equal(convertHandler.getNum('3/2/4'), 'invalid number');
  })
  test('default numeric input of 1', () => {
    assert.equal(convertHandler.getNum('kg'),1);    
  })
  test('read valid unit', () => {
    assert.equal(convertHandler.getUnit('4gal'),'gal');    
  })
  test('invalid unit return error', () => {
    assert.equal(convertHandler.getUnit('5fg'), undefined);    
  })
  test('return unit', () => {
    assert.equal(convertHandler.getReturnUnit('l'),'gal');    
  })
  test('return spelled-out', () => {
    assert.equal(convertHandler.spellOutUnit('gal'),'gallons');
  })
  test('gal to L', () => {
    assert.equal(convertHandler.convert(1,'gal'), 3.78541);    
  })
  test('L to gal', () => {
    assert.equal(convertHandler.convert(1,'L'), 0.26417 );    
  })
  test('mi to km', () => {
    assert.equal(convertHandler.convert(1, 'mi'), 1.60934 );
  })
  test('km to mi', () => {
    assert.equal(convertHandler.convert(1, 'km'), 0.62137 );    
  })
  test('lbs to kg', () => {
    assert.equal(convertHandler.convert(1, 'lbs'), 0.45359 );    
  })
  test('kg to lbs', () => {
    assert.equal(convertHandler.convert(1, 'kg'), 2.20462 );    
  })
});