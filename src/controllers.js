//controllers.js
//handles requests

const path = require('path');

// returns index.html page
const getIndex = (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/ezchord.html`));
};

// returns style.css sheet
const loadCSS = (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/styles/mainStyle.css`));
};

module.exports = {
  loadCSS,
  getIndex,
};