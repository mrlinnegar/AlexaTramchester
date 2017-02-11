var ResponseFormatter = {
	"format":function(service){
    var departure = ["The next tram from ",
                    service.begin.name,
                    " to ",
                    service.end.name,
                    " is at ",
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