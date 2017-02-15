var TramService = require('./lib/TramService');

var Promise = require("bluebird");


 var t = new TramService()
 	.from("9400ZZMAABM")
 	.to("9400ZZMABUR")
 	.departingAt("12:30:00")
 	.departingOn("2017-02-14")
 	.getTrams()
    .then(function(trams){
    	console.log(trams);
    })
 ;