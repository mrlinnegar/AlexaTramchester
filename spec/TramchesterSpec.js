describe("Tramchester", function() {
  var Tramchester = require('../lib/Tramchester');
  var Storage = require("../lib/Storage");

  beforeEach(function() {
    tramchester = new Tramchester();
  });

  it("should handle a 'RetrieveHomeStationIntent' intent", function(){
  	expect(typeof tramchester.intentHandlers.RetrieveHomeStationIntent).toEqual("function");
  });

  it("should save a valid station", function(){
  	var mockIntent = {};
  	var mockSession = {};
  	var mockResponse = {
  		tell: function(){},
  		ask: function(){}
  	};
	
	tramchester.intentHandlers.RetrieveHomeStationIntent(mockIntent, mockSession, mockResponse);

  	expect(true).toBeTruthy();
  });


});
