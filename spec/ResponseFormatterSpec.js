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
    expect(response).toEqual("There is a tram from Test Depature to Test Destination at 12:34. Direct. You should arrive at 12:35.");  
  });

});
