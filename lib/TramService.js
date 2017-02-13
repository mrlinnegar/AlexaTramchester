var Promise = require("bluebird"),
    request = require("request"),
    moment = require("moment");

function TramService(){
	this._departureDate = moment().format('YYYY-MM-DD'); //default to today
	this._departureTime = moment().format('HH:mm:ss'); // an now
	return this;
};

TramService.prototype.from = function(fromStationId) {
	this._fromStationId = fromStationId;
	return this;
};

TramService.prototype.to = function(toStationId){
	this._toStationId = toStationId;
	return this;
};

TramService.prototype.departingAt = function(departureTime){
	this._departureTime = departureTime;
	return this;
};

TramService.prototype.departingOn = function(departureDate){
	this._departureDate = departureDate;
	return this;
};

TramService.prototype.getURL = function(){
	var url =  ['https://www.tramchester.com/api/journey',
				'?departureDate=',
				this._departureDate,
				'&departureTime=',
				this._departureTime,
				'&end=',
				this._toStationId,
				'&start=',
				this._fromStationId].join("");
	return url;
};

TramService.prototype.getTrams = function(){

	return new Promise(function (resolve, reject) {
		request.get(this.getURL(), function (error, response, body) {
		  if (error) { return reject(error); }
		  
		  if (response.statusCode === 200 && body) {
		    resolve(JSON.parse(body));
		  }
		});
	});
};


module.exports = TramService;
