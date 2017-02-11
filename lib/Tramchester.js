/**
 * App ID for the skill
 */
var APP_ID =  "amzn1.ask.skill.8543c9ac-515f-4f07-a831-053c07aee69f";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill'),
    stations = require("./Stations"),
    getTrams = require('./TramService'),
    responseFormatter = require('./ResponseFormatter');

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
        var stationSlot = intent.slots.Station,
            stationId;

        if(stationSlot && stationSlot.value)   {
            var stationName = stationSlot.value.toLowerCase();
            var stationId = stations[stationName];        
        }

        if(stationId){
            getTrams("9400ZZMAPGD", stationId).then(function(trams){
        		var first = trams.journeys[0];
                var responseText = responseFormatter.format(first);
                response.ask(responseText);
            });
        } else {
            var speech = "I'm sorry, I do not recognise that station.";
            response.ask(speech);    
        }
    },
    "TramRouteIntent": function(intent, session, response){
        var fromStationSlot = intent.slots.FromStation;
        var toStationSlot = intent.slots.ToStation;


        if(fromStationSlot && fromStationSlot.value)   {
            var fromStationName = fromStationSlot.value.toLowerCase();
            var fromStationId = stations[fromStationName];        
        } else {
            var speech = "I'm sorry, I do not recognise the departure station.";
            response.ask(speech);       
            return; 
        }

        if(toStationSlot && toStationSlot.value)   {
            var toStationName = toStationSlot.value.toLowerCase();
            var toStationId = stations[toStationName];        
        } else {
            var speech = "I'm sorry, I do not recognise the destination station.";
            response.ask(speech);    
            return;
        }

        getTrams(fromStationId, toStationId)
            .then(function(trams){
                var sessionAttributes = {};    
                sessionAttributes.trams = trams;
                sessionAttributes.readTram = 0;
                var first = trams.journeys[0];
                var responseText = responseFormatter.format(first);
                session.attributes = sessionAttributes;
                response.ask(responseText);
            });

    },
    "TramRouteTimeIntent": function(intent, session, response){
        response.ask("This is not yet implemented");
    },
    "ListStationsIntent": function(intent, session, response){
        var stationNames = [];
        for(n in stations){
            stationNames.push(n);
        }
        response.tell(stationNames.join(", "));
    },
    "NextTramIntent": function(intent, session, response){
        var sessionAttributes = session.attributes;
        if(sessionAttributes.trams){
            var trams = sessionAttributes.trams;
            var readTram = sessionAttributes.readTram + 1;

            if(trams[readTram]){
                var responseText = responseFormatter.format(first);
                sessionAttributes.readTram = readTram;
                response.ask(responseText);
                session.attributes = sessionAttributes;
            } else {
                response.ask("I'm sorry you need to search again");    
            }
        } else {
            response.ask("You need to ask for a route first.")
        }
        
    },
    "PreviousTramIntent": function(intent, session, response) {
        response.ask("I'm sorry I can't do that yet");
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.tell("Panic! Goodbye");
    }
};

module.exports = Tramchester;