//router.js
//routes request to controllers

const controllers = require('./controllers.js');

const router = (app) => {
  app.get('/mainStyle.css', controllers.loadCSS);
  app.get('/gemelli.ttf', controllers.loadFont);
  app.get('/main.js', controllers.loadJS);
  app.get('/searchForTabs', controllers.searchTabs);
  app.get('/scrapeTab', controllers.scrapeTab);
  app.get('/', controllers.getIndex);
  app.get('/*', (req, res) => { res.status(404).send('Item Not Found'); } );
};

module.exports = router;