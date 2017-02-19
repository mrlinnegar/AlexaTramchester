const TramService = require('./lib/TramService'),
      parseDateTime = require('./lib/DateTimeParser'),
      Promise = require('bluebird');

/*

function getHomeStation(session, data){
	return new Promise(function(resolve, reject){
		data.session = session;
		resolve(data);
	});
}

function getTrams(data){
	return new Promise(function(resolve, reject){
		resolve("Success");
	})
}

parseDateTime("2017-02-20", "12:30")
    .then(function(options){
        return Storage.getHomeStation(session, options);
    })
    .then(function(options){
        return new Promise(function(resolve, reject){
            resolve(JSON.stringify(options));
        });
    })
	.catch(function(error){console.log("Error: " + error);});

*/
 var t = new TramService()
 	.get({"departureTime":"10:13:14","departureDate":"2017-02-19","homeStation":{"name":"Piccadilly","id":"9400ZZMAPIC"},"toStation":{"name":"Bury","id":"9400ZZMABUR"}})
    .then(function(trams){
        var responseText = responseFormatter.format(trams.journeys);
        response.tell(responseText);
    	console.log(trams);
    })
 ;
