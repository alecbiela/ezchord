const express = require('express');
const app = express();
const queryString = require('querystring');
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//obj of response headers
/*const resHeaders = {  
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, accept",
    "access-control-max-age": 10,
    //"Content-Type": "application/json"
};*/

/*
//set headers for every request (from tutorial link below)
//http://stackoverflow.com/questions/31661449/express-js-how-to-set-a-header-to-all-ress
app.use((req, res, next) => {
	res.setHeader("access-control-allow-origin", "*");
	res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.setHeader("access-control-allow-headers", "Content-Type, accept");
	res.setHeader("access-control-max-age", 10);
	//res.setHeader("Content-Type", "application/json");
	next();
});
*/

//route incoming requests
router(app);

app.listen(port, function()
{
	console.log("Listening on 127.0.0.1:" + port);
});

