

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Tramchester skill.
    var Tramchester = require("./lib/Tramchester");
    var alexaApp = new Tramchester();
    alexaApp.execute(event, context);
};

