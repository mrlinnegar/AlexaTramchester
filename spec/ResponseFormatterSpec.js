describe("ResponseFormatter", function() {
  var ResponseFormatter = require('../lib/ResponseFormatter');
  var mockService = {};

  beforeEach(function() {
   	mockService = {
   		"begin": { "name": "Test Depature"},
   		"end": {"name":"Test Destination"},
   		"firstDepartureTime" : "12:34",
   		"expectedArrivalTime" : "12:35",
   		"summary": "Direct"
   	};
  });

  it("should format the service to Alexa response", function() {
  	var response = ResponseFormatter.format(mockService);
    expect(response).toEqual("The next tram from Test Depature to Test Destination is at 12:34. Direct. You should arrive at 12:35.");  
  });

});
