var ResponseFormatter = {
	"format":function(service){
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