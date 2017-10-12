//import the good stuff
var ugs = require('ultimate-guitar-scraper');
var yqlHandler = require('yql');//.formatAsJSON();
var express = require('express');
var app = express();
var queryString = require('querystring');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

//obj of response headers
var resHeaders = {  
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, accept",
    "access-control-max-age": 10,
    "Content-Type": "application/json"
};

//set headers for every request (from tutorial link below)
//http://stackoverflow.com/questions/31661449/express-js-how-to-set-a-header-to-all-ress
app.use(function(req, res, next){
	res.setHeader("access-control-allow-origin", "*");
	res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.setHeader("access-control-allow-headers", "Content-Type, accept");
	res.setHeader("access-control-max-age", 10);
	res.setHeader("Content-Type", "application/json");
	next();
});

var query;

//The main request function
function onRequest(req, res) {
	
	//parse out an object with the query info
	query = req.url.split('?')[1];	
	
	if(query.startsWith("scrape")) getSingleTab(req, res);
	else getSearch(req, res);
}

//handles request to search for tabs
function getSearch(req, res)
{
	var params = queryString.parse(query);
	
	//scrape ultimate guitar for a search
	var returnedTabs = [];
	
	var ugsQuery = {
		bandName: params.bName,
		songName: params.sName,
		page: 1,
		type: ['chords']
	};
	
	var ugsCallback = function(error, tabs, response, body){
		//if error, print
		if(error){
			console.log(error);
			res.status(500).send('500: Internal Server Error :(');
		}
		else{
			returnedTabs = tabs;
			console.log('got tabs');
			
			//use express .json function to return json directly
			res.setHeader("Content-Type", "application/json");
			res.json({tabs: returnedTabs});
		}
	};
 
	//query the Ultimate Guitar Scraper for tabs (callback above)
	ugs.search(ugsQuery, ugsCallback);	
}

//handles request to scrape a tab from the URL (in query)
function getSingleTab(req, res)
{
	//build query
	var parsedQuery = queryString.parse(query);
	var qURL = parsedQuery.scrape;
	var qChords = parsedQuery.chords;
	
	//var xpath = "//*[@id='scroll_holder']/div[4]";
	var xpath = "//*[@id='cont']/pre[2]";
	//var input = 'select * from html where url="' + qURL + '" and xpath="' + xpath + '";';
	var input = 'select * from htmlstring where url="' + qURL + '" and xpath="' + xpath + '" and compat="html5";';
	
	//called when the YQL query completes
	var yqlCallback = function(error, response)
	{
		//if error, print
		if(error){
			res.status(500).send('500: Internal Server Error');
			console.log(error);
		}
		else
		{
			//send the html back to the client
			res.setHeader("Content-Type", "text/html");
			res.send(response);
		}
	}
	
	//scrape with YQL
	yqlHandler.execute(input, yqlCallback);
}

//add 'get' handler and start listening
app.get('/', onRequest);
app.listen(port, function()
{
	console.log("Listening on 127.0.0.1:" + port);
});

