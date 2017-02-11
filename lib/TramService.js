var Promise = require("bluebird");
var request = require("request");
var moment = require("moment");

function TramService(fromStationId, toStationId){

	var options = {
		method: 'GET',
		url: ['https://www.tramchester.com/api/journey?departureDate=',
					moment().format('YYYY-MM-DD'),
					'&departureTime=',
					moment().format('HH:mm:ss'),
					'&end=',
					toStationId,
					'&start=',
					fromStationId].join("")
		,
		headers: {}
	};
	return new Promise(function (resolve, reject) {
		request.get(options, function (error, response, body) {
		  if (error) { return reject(error); }
		  
		  if (response.statusCode === 200 && body) {
		    resolve(JSON.parse(body));
		  }
		});
	});
}


module.exports = TramService;
