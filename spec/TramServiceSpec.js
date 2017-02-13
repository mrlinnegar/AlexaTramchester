var sinon = require('sinon');
require('jasmine-sinon');


var TramService = require('../lib/TramService.js'),
	momentProto = require("moment").fn,
	sandbox = sinon.sandbox.create();

describe("TramService", function(){

	it("Should do set the departure time and date to now with supplied station IDs", function(){

		sandbox.stub(momentProto,'format');
		momentProto.format.withArgs("YYYY-MM-DD").returns("2000-01-01");
		momentProto.format.withArgs("HH:mm:ss").returns("12:00");

		var service = new TramService("mockStation", "mockStation");
		expect(service.getURL()).toEqual("https://www.tramchester.com/api/journey?departureDate=2000-01-01&departureTime=12:00&end=mockStation&start=mockStation");
	
		sandbox.restore();
	});

	it("Should use the current date but the supplied time", function(){

		sandbox.stub(momentProto,'format');
		momentProto.format.withArgs("YYYY-MM-DD").returns("2000-01-01");

		var service = new TramService("mockStation", "mockStation").departingAt("12:30");
		expect(service.getURL()).toEqual("https://www.tramchester.com/api/journey?departureDate=2000-01-01&departureTime=12:30&end=mockStation&start=mockStation");
	
		sandbox.restore();

	});

	it("Should use the supplied date and time", function(){
		
		var service = new TramService("mockStation", "mockstation")
							.departingOn("2016-07-01")
							.departingAt("12:30");
		expect(service.getURL()).toEqual("https://www.tramchester.com/api/journey?departureDate=2016-07-01&departureTime=12:30&end=mockstation&start=mockStation");

	});
});
