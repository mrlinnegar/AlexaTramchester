

'use strict';
var AWS     = require("aws-sdk"),   
    Promise = require("bluebird");

AWS.config.update({
  region: "us-east-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "Tramchester";


var storage = (function(){

    return {

        setHomeStation: function(session, station){
            return new Promise(function(resolve, reject){

                var params = {
                    TableName:table,
                    Item:{
                        "CustomerId": session.user.userId,
                        "data": JSON.stringify(station)
                    }
                };

                console.log("Adding a new item...");
                docClient.put(params, function(err, data) {
                    if (err) {
                        return reject("Unable to set your home station.");
                    } else {
                        resolve("Setting your home station to "+ station.name);
                    }
                    
                });

            });
        },

        getHomeStation: function(session, options){
            return new Promise(function (resolve, reject) {
                var params = {
                    TableName: table,
                    Key:{
                        "CustomerId": session.user.userId
                    }
                };

                docClient.get(params, function(err, data) {
                    if (err) {
                        return reject("I could not retrieve a home station.");
                    } else {
                        if(!data.Item){
                            return reject("You do not have a station set."); 
                        } else {
                            options.homeStation = JSON.parse(data.Item.data);
                            resolve(options);
                        }
                    }
                    
                });                
            });
        }

        
    };

})();


module.exports = storage;
