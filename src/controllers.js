//controllers.js
//handles requests
const searcher = require('./tabSearcher.js');
const scraper = require('./tabScraper.js');
const path = require('path');

// returns index.html page
const getIndex = (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/ezchord.html`));
};

// returns style.css sheet
const loadCSS = (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/styles/mainStyle.css`));
};

//loads font
const loadFont = (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/styles/gemelli.TTF`));
};

//loads main.js
const loadJS = (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/js/main.js`));
};

//searches for a tab
const searchTabs = (req, res) => {
  searcher(req, res);
};

//scrapes a tab
const scrapeTab = (req, res) => {
  scraper(req, res);
};

module.exports = {
  loadCSS,
  getIndex,
  loadFont,
  loadJS,
  searchTabs,
  scrapeTab
};