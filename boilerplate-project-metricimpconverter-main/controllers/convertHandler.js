function ConvertHandler() {
  const unitConversion = {
    "gal": { fullName: "gallons",	convert: "l" },
		"l": { fullName: "liters", convert: "gal" },
		"lbs": { fullName: "pound", convert: "kg" },
    "kg": { fullName: "kilograms", convert: "lbs" },
    "mi": { fullName: "miles", convert: "km" },
    "km": { fullName: "kilometers", convert: "mi" }
  };
  
  // note to self:
  // string.match(regex) return array
	// eval() to handle fractional input

  this.getNum = function(input) {
    const checkDoubleSlash = (input) => {
      const slashCount = (input.match(/\//g) || []).length;
      return slashCount > 1? false : true;
    }
    if (!checkDoubleSlash(input)) {
      return 'invalid number';
    }
    const regex = /^[\d]+(([.\/]\d+([.\/]\d+)?)?.\d+)?/;
	  const num = input.match(regex);
    if (num == undefined) {
      return 1;
    }
	  return eval(num[0]);
  };
  
  this.getUnit = function(input) {
    const regex = /[a-zA-Z]*$/;
	  const match = input.match(regex);
    const unit = match[0].toLowerCase();
    console.log('unit='+unit);
    const validUnits = ['gal','l','kg','lbs','mi','km'];
    if (!validUnits.includes(unit)) {
      return undefined;
    }
    if (unit == 'l') {
      return 'L';
    }
	  return unit;
  };

  this.getReturnUnit = function(initUnit) {
    if ( initUnit == 'gal') {
      return 'L';
    }
    return unitConversion[initUnit.toLowerCase()].convert;
  };

  this.spellOutUnit = function(unit) {
    // provide the full name of units
    return unitConversion[unit.toLowerCase()].fullName;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    const num = Number(initNum);
    if (initUnit==undefined) {
      return undefined;
    }
	  let result;
    switch (initUnit.toLowerCase()) {
      case "gal":
        result = num * galToL;
        break;
      case "l":
        result = num / galToL;
        break;
      case "lbs":
        result = num * lbsToKg;
        break;
      case "kg":
        result = num / lbsToKg;
        break;
      case "mi":
        result = num * miToKm;
        break;
      case "km":
        result = num / miToKm;
        break;
      default:
        return 'invalid unit'
    }
	  return result.toFixed(5);
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;
