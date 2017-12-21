var request, theList;
var db = null;

function init(){
    getMoviesListAndDrawList();
}

function getMoviesListAndDrawList(){	
	theList = $("#mylist");
  	request = $.ajax({
   		url: "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=e326138bc256cf61eb4f586eb38c1d8b",
   		method: "GET"
  	});
   	request.done(function( moviesList ) {
		requestDBdata();
		if ( $('#mylist').children().length == 0 ) {      
			for (i=0;i<moviesList.results.length;i++){
				//Get Info from WebServic3
				var text = moviesList.results[i].original_title;
				var imgPath = "img"+ moviesList.results[i].poster_path;
				var date = moviesList.results[i].release_date;;
				//Create Obj
				var objLi = $('<li></li>');
				var objImg = $('<img src="' +imgPath+ '"</img>');  
				var objTit = $('<h2/>' + text + '</h2>');
				var objParr = $('<p>' + date + '</p>');
				var objLink = $('<a id="'+i+'" class="objLink" href="#infodetail" data-rel="popup" data-position-to="window" data-transition="pop"></a>');
				var favLink = $('<a id="id'+i+'" href="#" class="favLink"> Add to favourites </a>'); 
				//Build
				objLink.append(objImg);
				objLink.append(objTit);
				objLink.append(objParr);
				objLi.append(objLink);
				objLi.append(favLink);
				theList.append(objLi);
			}        
			theList.listview("refresh");
		}
        db.executeSql('SELECT id FROM Movies WHERE favourite = 1', [], 
		function(rs) {
            var len = rs.rows.length;
			if (rs.rows.length > 0) {
			}
            for (i = 0; i < len; i++) {
				var id = rs.rows.item(i).id;
				var itemVL = $('#id'+id);
                $(itemVL).attr("style", "background-color:#FFFF30;");
            }
		}, function(error) {
			alert('SELECT SQL statement ERROR: ' + error.message);
		});
		theList.listview("refresh");
    });   
    request.fail(function( jqXHR, textStatus ) {
      	alert( "Request failed: " + textStatus );
    });
}
 
$(document).on('click', '.objLink', function () {
        var index = $(this).attr('id');
		request = $.ajax({
   			url: "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=e326138bc256cf61eb4f586eb38c1d8b",
   			method: "GET"
  		});
		request.done(function( moviesList ) {       
			//Get Info from WebServic3
			var text = moviesList.results[index].original_title;
			var bdPath = "img/backdropPath"+ moviesList.results[index].backdrop_path;
			var descr = moviesList.results[index].overview;
			var rating = moviesList.results[index].vote_average + "/10";
			//Popup Obj
      		$('#ratPopup').html(rating);
			$('#titPopup').html(text);
			$('#imgPopup').attr("src", bdPath);
			$('#descrPopup').html(descr);
			//$('#infodetail').attr("hidden", false);		        
    	});   
   		request.fail(function( jqXHR, textStatus ) {
      		alert( "Request failed: " + textStatus );
    	}); 
        //return false; 
});

$(document).on('click', '.favLink', function () {
        var index = $(this).attr('id');
		var objList =  $('#'+index);
		if ($(objList).css('background-color') == 'rgb(255, 255, 48)') {
			$(objList).attr("style", "background-color:#F6F6F6;");
		} else {
			$(objList).attr("style", "background-color:#FFFF30;");
		}
});

$(document).on('click', '#LoadFav', function (e) {	
	e.preventDefault();
	$.mobile.navigate("#pagetwo", {info:" "});
});

$(document).on('click', '#LoadFirstScreen', function (e) {	
	e.preventDefault();
	$.mobile.navigate("#main_page", {info:" "});
	init();
});

function requestDBdata () {
	db = window.sqlitePlugin.openDatabase({name: 'db_movies.db', location: 'default'});
	db.sqlBatch([
		'DROP TABLE Movies',
		'CREATE TABLE IF NOT EXISTS Movies (id, name, favourite)',
		[ 'INSERT INTO Movies VALUES (?,?,?)', [0, 'It', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [1, 'Coco', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [2, 'Star Wars: The Last Jedi', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [3, 'Justice League', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [4, 'Jumanji', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [5, 'Minions' , 1] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [6, 'Beauty and The Beast', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [7, 'Daddys Home 2', 1] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [8, 'Murder on the Orient Express', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [9, 'War for the planet of the apes', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [10, 'Jumanji: Welcome to the jungle', 1] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [11, 'The Star', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [12, 'Sleight', 1] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [13, 'Thor: Ragnarok', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [14, 'Kingsman: The Golden Circle', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [15, 'The disaster Artist', 1] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [16, 'Big Hero 6', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [17, 'Wonder Woman', 0] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [18, 'John Wick', 1] ],
		[ 'INSERT INTO Movies VALUES (?,?,?)', [19, 'Spider-Man: Homecoming', 0] ],
	], function() {
		}, function(error) {
			alert('SQL batch ERROR: ' + error.message);
	});
}



