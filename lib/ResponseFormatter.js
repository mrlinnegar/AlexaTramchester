var ResponseFormatter = {
	"format":function(services){

        var service = services[0];
        
        if(!service){
            return "There is not a service at this time";
        }

        var departure = ["There is a tram from ",
                        service.begin.name,
                        " to ",
                        service.end.name,
                        " at ",
                        service.firstDepartureTime,
                        ". "].join("");

        var change = [service.summary, ". "].join("");

        var arrival = ["You should arrive at ",
                        service.expectedArrivalTime,
                        "."].join("");

        return [departure,change,arrival].join("");
    }
};

module.exports = ResponseFormatter;