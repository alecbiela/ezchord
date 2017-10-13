//chordversion v.1.2
//by Alec Bielanos, please don't steal my things
 
'use strict';

//IIFE Begins here - Globals need not apply!
(function(){

	//will be appended to the song information at the head of the tab
	var resetButton = '<select id="inst"><option value="guitar" class="instSelect">Guitar</option>' + 
		'<option value="piano" class="instSelect">Piano</option></select>' +
		'<button type="button" id="reset">Start Over</button>';

	//holds the current search selection ID
	var currentSelectionID = "";
	var chordInformation = {};

	//init event listeners
	function init() {
		document.querySelector("#submitButton").onclick = sendAjax;
		document.querySelector("#submitScrape").onclick = sendScrapeRequest;
		$('#response').on('click', '.spanButton', changeSelectedResult);
		$('#tabResults').on('click', '.chord', displayChordInformation);
		$('#content').on('click', '#reset', resetService);
		$('#chordBrowser').on('click', '#closeChordInfo', function(e){ $('#chordBrowser').slideUp(200); });	
		$('#songInfo').on('change', '#inst', function(e){ $('.scales_chords_api').attr('instrument', e.target.value); });		
	}
	
	
	//resets the service to be used again
	function resetService()
	{
		$('#tabResults, #songInfo, #chordBrowser').each(function(){ $(this).fadeOut(1000); })
			.promise().done(function(){			
				$('#searchBox').fadeIn(1000);
				$('#status').html("");
				});
	}
	
	//sets the song information in the box above the tab
	function setSongInfo(title, author){
		var htmlStr = '<p style="display: inline; ">' + title + ' by ' + author + '</p>' + resetButton;
		document.querySelector('#songInfo').innerHTML = htmlStr;
	}
	
	//displays chord information about specific chord
	function displayChordInformation(e){
		var chord = e.target.innerHTML;
			
		//set the 'chord' attrib of image box to current chord
		$('.scales_chords_api').attr( 'chord', chord );
		
		//lock down your globals, kids.
		//or else someone can call the onload function of your API
		//for a little bonus functionality ;)
		scales_chords_api_onload();		
		
		//finally, fade in the stuff
		$('#chordBrowser').clearQueue().finish().slideDown(200);
					
	}
	
	//custom search result selection callback
	function changeSelectedResult(e)
	{		
		//get the parent of the button (the <div> of the search result)
		var targ = e.target.parentNode;
		
		//add selected ID to this object (if it's not already selected)		
		if(targ.id !== currentSelectionID){

			//remove the old class if there is one
			if(currentSelectionID !== "")
				$('#' + currentSelectionID).removeClass('selectedResponse');
			
			//add styling for the 'selected' and set it to currently selected
			$('#' + targ.id).addClass('selectedResponse');
			currentSelectionID = targ.id;
			
			$('#searchFooter').fadeIn(800);
		}	
	}
	
	//sends Yql scrape request
	function sendScrapeRequest(e)
	{
		//let the user know we heard their button press
		$('#status').html("Retrieving Tab...");
		
		//get user selection
		var data = currentSelectionID;
		
		//update tab header with song title and artist (above actual tab)
		var selectedTitle = document.querySelector('.selectedResponse > .songName').innerHTML;
		var selectedArtist = document.querySelector('.selectedResponse > .songArtist').innerHTML;
		setSongInfo(selectedTitle, selectedArtist);
		
		//normal ajax stuff, set up REST style get query
		var action = document.querySelector("#proxyForm").getAttribute("action");
		var query = "scrape=" + encodeURIComponent( $('#' + data).find('.searchResultURL').html() );		
		var url = action + "?" + query;		
		var xhr = new XMLHttpRequest();
		
		//define callback for load
		xhr.onload = function()
		{
			//if bad response, let the user know and don't process data
			if(xhr.status !== 200)
			{
				$('#status').html("Server Error, please try again!");
				return false;
			}
			
			//if we actually got HTML back (should always be true unless ultimate guitar)
			//changes their site design for some reason
			if(xhr.responseText != "")
			{
				document.querySelector("#tabResults").innerHTML = xhr.responseText;
				
				//attach class 'chord' to everything that Ultimate Guitar recognizes as a 'chord'
				$('.js-tab-content > span').each(function(){				
					$(this).addClass('chord');
				});
				
				//do some animating				
				$('#status').html("");
				$('#rWrapper').slideUp(800);
				$('#searchBox').slideUp(800).promise().done(function(){ 
					$('#songInfo').fadeIn(1300);
					$('#tabResults').fadeIn(1300);
				});
			}
			else{
				$('#status').html("Internal Server Error... Reload Page and Try Again.");
			}
		};
		
		//send get request and prevent default
		xhr.open('GET', url);
		xhr.send();
		
		e.preventDefault();
		return false;	
	}
  
	//sends ultimate guitar scrape request
	function sendAjax(e) {
	
		//let the user know we're searching
		//$('#status').html("Searching...");
		
		//get data from the form 
		var action = document.querySelector("#proxyForm").getAttribute("action");
		var artist = document.querySelector("#bName").value;
		var song = document.querySelector("#sName").value;
		
		//if no data, print error and don't do ajax (maybe move to server side?)
		if((!artist && !song) || (artist.length === 0 && song.length === 0))
		{			
			$('#status').html("Please enter something to search!");
			e.preventDefault();
			return false;
		}

		//set up ajax request
		var query = "bName=" + encodeURIComponent(artist) + "&sName=" + encodeURIComponent(song);
		var url = action + "?" + query;
		var xhr = new XMLHttpRequest();

		//callback for ajax
		xhr.onload = function()
		{
			//if bad response, let the user know and exit
			if(xhr.status !== 200)
			{
				$('#status').html("Server Error, please try again!");
				return false;
			}
			
			//format the response into a list of search results
			$('#status').html("Formatting Response...");
			
			var responseDiv = document.querySelector('#response');
			var responseJSON = JSON.parse( xhr.responseText );
			var allTabs = responseJSON.tabs;
			
			//alternative error for successful request but no tabs
			if(!allTabs || allTabs.length == 0){
				$('#status').html("No tabs found!  Try altering your search terms...");
				return false;
			}
			
			//set up html buffer
			var htmlBuffer = [];
			
			for(var i=0; i<allTabs.length; i++)
			{
				var tab = allTabs[i];
				if(tab.type != 'chords') continue;
				
				//wot in concatenation	
				htmlBuffer.push("<div class='searchResponseTab' id='searchResult" + i + "'>");
					htmlBuffer.push("<span class='spanButton'></span>");
					htmlBuffer.push("<h3 class='songName'>" + (tab.name || "No Title") + "</h3>");
					htmlBuffer.push("<h3 class='songArtist'>" + (tab.artist || "No Artist") + "</h3>");
					htmlBuffer.push("<p>Difficulty: " + (tab.difficulty || "Unknown"));
					htmlBuffer.push("<span class='searchResultURL'>" + tab.url + "</span>")
				htmlBuffer.push("</div>");
			}
			
			//push everything to the screen
			responseDiv.innerHTML = htmlBuffer.join('\n');
			$('#status').html("");
			
			//slide results down
			if(htmlBuffer !== []) $('#rWrapper').slideDown(800);
	};

	//open a GET request and prevent default
	xhr.open('GET', url);
	xhr.send();

	e.preventDefault();
	return false;
	}
  
	//calls init once the window has loaded
	window.addEventListener("load",init);
	
	//end of IIFE
  })();
  