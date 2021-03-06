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
    moment = require('moment'),
    Storage = require('./Storage'),
    parseDateTime = require('./DateTimeParser');

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
    "TramToIntent": function (intent, session, response) {

        parseDateTime(intent.slots.DepartureDate.value,
                      intent.slots.DepartureTime.value)
        .then(function(options){
            return Storage.getHomeStation(session, options);
        })
        .then(function(options){
            return parseStationIntent(intent.slots.Station, options);
        })
        .then(function(options){
            return new TramService().get(options);
        })
        .then(function(trams){
            var responseText = responseFormatter.format(trams.journeys);
            response.tell(responseText);
        })
        .catch(function(error) {
            if (error) {
                response.tell(error);
            } else {
                response.tell("I'm sorry an error has occurred.")
            }
        });

    },

    "TramFromIntent": function (intent, session, response) {

        parseDateTime(intent.slots.DepartureDate.value, intent.slots.DepartureTime.value)
            .then(function(request){
                Storage
                .getHomeStation(session)
                .then(function(data){
                    var station = JSON.parse(data);

                    if(!intent.slots.Station.value)
                        response.ask("I'm sorry I didn't quite catch that");

                    var stationId = parseStation(intent.slots.Station);

                    if(!stationId)   {
                       var speech = "I'm sorry, I do not recognise the destination station.";
                       response.tell(speech);       
                    }

                    new TramService()
                        .from(stationId)
                        .to(station.id)
                        .departingAt(request.departureTime)
                        .departingOn(request.departureDate)
                        .getTrams()
                        .then(function(trams){
                          var responseText = responseFormatter.format(trams.journeys);
                          response.tell(responseText);
                        });
                });
                
            })
            .catch(function(error){
                response.tell(error);
            });
    },


    "TramRouteIntent": function(intent, session, response){

        if(!intent.slots.ToStation || !intent.slots.FromStation)
            response.ask("I'm sorry I didn't quite catch that");


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


        var departureTime,
            departureDate;

        if(intent.slots.DepartureTime.value){
            departureTime = parseTime(intent.slots.DepartureTime.value);
        } else {
            departureTime = moment().format('HH:mm:ss');
        }

        if(intent.slots.DepartureDate.value){
            departureDate = intent.slots.DepartureDate;
        } else {
            departureDate = moment().format('YYYY-MM-DD');
        }


        new TramService()
            .from(fromStationId)
            .to(toStationId)
            .departingAt(departureTime)
            .departingOn(departureDate)
            .getTrams()
            .then(function(trams){
                var responseText = responseFormatter.format(trams.journeys);
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
    "SaveHomeStationIntent": function(intent, session, response){
        if(!intent.slots.Station)
            response.ask("I'm sorry I didn't quite catch that");

        var stationId = parseStation(intent.slots.Station);
        
        if(!stationId)   {
            response.tell("I'm sorry, I do not recognise that station.");       
        } else {
            var station = {
                name:intent.slots.Station.value,
                id: stationId
            };
            
            Storage
                .setHomeStation(session, station)
                .then(function(data){
                    response.tell(data);
                })
                .error(function(error){
                    response.tell(error);
                });
        }
    },
    "RetrieveHomeStationIntent": function(intent, session, response){
        Storage
            .getHomeStation(session)
            .then(function(data){
                var station = JSON.parse(data);
                response.tell("your home station is set to "+ station.name);
            })
            .error(function(error){
                response.tell(error);
            });
        return;
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.tell("You can ask 'when is the next tram from Chorlton to Eccles'");
    },
    "AMAZON.CancelIntent": function(intent, session, response){
        reponse.tell("goodbye");
    },
    "AMAZON.StopIntent": function(intent, session, response){
        response.tell("goodbye");
    }
};

function parseStationIntent(station, options){
    return new Promise(function(resolve, reject){

        if(!station.value)
            reject("I'm sorry I didn't quite catch that");

        var stationId = parseStation(station);

        if(!stationId)   {
            reject("I'm sorry, I do not recognise that station.");
        }

        options.toStation ={
            "name": station.value,
            "id": stationId
        };

        resolve(options);
    });
};

function parseStation(station) {
    var stations = require("./Stations");
    var stationName = station.value.toLowerCase();
    var stationId = stations[stationName] || null;        
    return stationId;
}



module.exports = Tramchester;