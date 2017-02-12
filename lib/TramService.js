var Promise = require("bluebird"),
    request = require("request"),
    moment = require("moment");

function TramService(fromStationId, toStationId){
	this._fromStationId = fromStationId;
	this._toStationId = toStationId;
	this._departureDate = moment().format('YYYY-MM-DD'); //default to today
	this._departureTime = moment().format('HH:mm:ss'); // an now
};

TramService.prototype.departingAt = function(departureTime){
	this._departureTime = departureTime;
	return this;
};

TramService.prototype.departingOn = function(departureDate){
	this._departureDate = departureDate;
	return this;
};

TramService.prototype.getTrams = function(){
	var options = {
		method: 'GET',
		url: ['https://www.tramchester.com/api/journey',
					'?departureDate=',
					this._departureDate,
					'&departureTime=',
					this._departureTime,
					'&end=',
					this._toStationId,
					'&start=',
					this._fromStationId].join("")
		,
		headers: {}
	};
	console.log(options.url);
	return new Promise(function (resolve, reject) {
		request.get(options, function (error, response, body) {
		  if (error) { return reject(error); }
		  
		  if (response.statusCode === 200 && body) {
		    resolve(JSON.parse(body));
		  }
		});
	});
};


module.exports = TramService;
