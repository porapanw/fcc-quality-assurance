const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  Translate(text,locale) {
    let dict = {};
    let titles = {};
    if ( locale == 'american-to-british') {
      dict = { ...americanOnly, ...americanToBritishSpelling };
      titles = americanToBritishTitles;
    } else if ( locale == 'british-to-american') {
      dict = { ...britishOnly };
      Object.entries(americanToBritishSpelling).forEach(([key,value]) => dict[value] = key);
      Object.entries(americanToBritishTitles).forEach(([key,value]) => titles[value] = key);
    } else {
      return { error: 'Invalid locale' };
    }

    let translatedText = text;
    let highlightedText = text;
    
    for (const [key,value] of Object.entries(dict)) {
      const regex = new RegExp(`(?<!-)\\b${key}\\b`,'gi');
      translatedText = translatedText.replace(regex, value);
      highlightedText = highlightedText.replace(regex, match => `<span class="highlight">${value}</span>`);
    }

    for (const [key,value] of Object.entries(titles)) {
      let newKey = key.replace('.','\\.');
      const regex = new RegExp(`\\b${newKey}(\\.)?(\\s|$)`, 'gi');
      let newValue = value[0].toUpperCase() + value.slice(1);
      translatedText = translatedText.replace(regex, `${newValue} `);
      highlightedText = highlightedText.replace(regex, `<span class="highlight">${newValue}</span> `)
    }

    const timeRegex = locale == 'american-to-british' 
      ? /\d{1,2}:\d{2}/g 
      : /\d{1,2}\.\d{2}/g;
    const timeReplacementWithHighlight = locale == 'american-to-british' 
      ? match => `<span class="highlight">${match.replace(':','.')}</span>` 
      : match => `<span class="highlight">${match.replace('.',':')}</span>`;
    const timeReplacement = locale == 'american-to-british' 
    ? match => `${match.replace(':','.')}` 
    : match => `${match.replace('.',':')}`;
    translatedText = translatedText.replace(timeRegex, timeReplacement)
    highlightedText = highlightedText.replace(timeRegex, timeReplacementWithHighlight);

    return {
     text: text,
     translation: (translatedText == text ) ? 'Everything looks good to me!' : highlightedText
    };
  }
}

module.exports = Translator;