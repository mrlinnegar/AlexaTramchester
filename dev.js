var TramService = require('./lib/TramService');

 new TramService("9400ZZMAABM", "9400ZZMABUR")
 	.departingAt("12:30:00")
 	.departingOn("2017-02-14")
 	.getTrams()
    .then(function(trams){
    	console.log(trams);
    })
    .error(function(error){
    	console.log(error);
    });