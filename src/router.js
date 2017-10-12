//router.js
//routes request to controllers

const controllers = require('./controllers.js');

const router = (app) => {
  app.get('/mainStyle.css', controllers.loadCSS);
  app.get('/', controllers.getIndex);
  app.get('/*', (req, res) => { res.send('404 Error', 404); } );
};

module.exports = router;