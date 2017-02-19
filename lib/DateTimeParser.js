"use strict";

var moment = require('moment');

function parseDateTime(date, time){


    function parseTime(time){
        // night NI , morning: MO, afternoon: AF, evening: EV. some of the intent craziness

        switch(time){
            case 'NI':
                return "22:00:00";
                break;
            case 'MO':
                return "08:00:00";
                break;
            case 'AF':
                return "16:00:00";
                break;
            case 'EV':
                return "19:00:00";
                break;
            default:
                return moment(time, "HH:mm").format("HH:mm:ss");
        }
        
    }


    return new Promise(function(resolve, reject){

        if(!date){
            date = moment().format('YYYY-MM-DD');
        }

        if(!time){
            time = moment().format('HH:mm:ss');
        } else {
            time = parseTime(time);
        }

        var departure = moment(date + " " + time, "YYYY-MM-DD HH:mm:ss");
        
        if(moment().subtract(1, "hours") > departure){
            reject("I cannot find trams in the past.");
        } else {
            resolve(
                { "departureTime": time,
                  "departureDate": date
                });
        }
    });
}
module.exports = parseDateTime;