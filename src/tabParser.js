//tab-parser
//non-functional for now, just holding old parse code


//import the good stuff
var ugs = require('ultimate-guitar-scraper');
var yqlHandler = require('yql');//.formatAsJSON();
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