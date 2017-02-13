/**
 * App ID for the skill
 */
var APP_ID =  "amzn1.ask.skill.8543c9ac-515f-4f07-a831-053c07aee69f";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill'),
    stations = require("./Stations"),
    TramService = require('./TramService'),
    responseFormatter = require('./ResponseFormatter'),
    moment = require('moment');

var Tramchester = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Tramchester.prototype = Object.create(AlexaSkill.prototype);
Tramchester.prototype.constructor = Tramchester;

Tramchester.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Tramchester onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

Tramchester.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Tramchester onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to Tramchester";
    var repromptText = "You can ask for tram times between two stations";
    response.ask(speechOutput, repromptText);
};

Tramchester.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Tramchester onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

Tramchester.prototype.intentHandlers = {
    // register custom intent handlers
    "NextTramToIntent": function (intent, session, response) {
        var stationId = parseStation(intent.slots.Station);

        if(!stationId)   {
           var speech = "I'm sorry, I do not recognise the destination station.";
            response.ask(speech);       
            return; 
        }

        new TramService()
            .from("9400ZZMAPGD")
            .to(stationId)
            .getTrams().then(function(trams){
    		  var first = trams.journeys[0];
                var responseText = responseFormatter.format(first);
                response.ask(responseText);
            });
    },
    "TramRouteIntent": function(intent, session, response){
        var fromStationId = parseStation(intent.slots.FromStation),
            toStationId   = parseStation(intent.slots.ToStation); 

        if(!fromStationId)   {
           var speech = "I'm sorry, I do not recognise the departure station.";
            response.ask(speech);       
            return; 
        }

        if(!toStationId) {
            var speech = "I'm sorry, I do not recognise the destination station.";
            response.ask(speech);    
            return;
        }

        new TramService()
            .from(fromStationId)
            .to(toStationId)
            .getTrams()
            .then(function(trams){
                var first = trams.journeys[0];
                var responseText = responseFormatter.format(first);
                response.ask(responseText);
            });

    },
    "TramRouteTimeIntent": function(intent, session, response){
        var fromStationId = parseStation(intent.slots.FromStation),
            toStationId   = parseStation(intent.slots.ToStation),
            departureTime   = parseTime(intent.slots.DepartureTime); 

        if(!fromStationId)   {
           var speech = "I'm sorry, I do not recognise the departure station.";
            response.ask(speech);       
            return; 
        }

        if(!toStationId) {
            var speech = "I'm sorry, I do not recognise the destination station.";
            response.ask(speech);    
            return;
        }

        new TramService()
            .from(fromStationId)
            .to(toStationId)
            .departingAt(moment(departureTime.value, "HH:mm").format("HH:mm:ss"))
            .getTrams()
            .then(function(trams){
                var first = trams.journeys[0];
                var responseText = responseFormatter.format(first);
                response.ask(responseText);
            });

    },
    "TramRouteTimeDateIntent": function(intent, session, response){
        var fromStationId = parseStation(intent.slots.FromStation),
            toStationId   = parseStation(intent.slots.ToStation),
            departureTime = parseTime(intent.slots.DepartureTime),
            departureDate = parseDate(intent.slots.DepartureDate); 

        if(!fromStationId)   {
           var speech = "I'm sorry, I do not recognise the departure station.";
            response.ask(speech);       
            return; 
        }

        if(!toStationId) {
            var speech = "I'm sorry, I do not recognise the destination station.";
            response.ask(speech);    
            return;
        }

        new TramService()
            .from(fromStationId)
            .to(toStationId)
            .departingAt(moment(departureTime.value, "HH:mm").format("HH:mm:ss"))
            .departingOn(departureDate)
            .getTrams()
            .then(function(trams){
                var first = trams.journeys[0];
                var responseText = responseFormatter.format(first);
                response.ask(responseText);
            });
    },
    "ListStationsIntent": function(intent, session, response){
        var stationNames = [];
        for(n in stations){
            stationNames.push(n);
        }
        response.tell(stationNames.join(", "));
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.tell("You can ask 'when is the next tram from Chorlton to Eccles'");
    }
};


function parseStation(station) {
    var stations = require("./Stations");
    var stationName = station.value.toLowerCase();
    var stationId = stations[stationName] || null;        
    return stationId;
}

function parseTime(time){
    // night NI , morning: MO, afternoon: AF, evening: EV.


    return time;
}
function parseDate(date){
    return date.value;
}


module.exports = Tramchester;