/**
 * Script to update sharedState with a key and object value retrieved from properties.value of the custom node 
 * This sharedState key/value is then used by the Backchannel Notification node to update the front channel state
 * Example property values:
 *   journeyStatusKey      = "transaction:notify"
 *   journeyStatusProperty = "journeyStatus"
 *   journeyStatusValue    = "Front Channel Message"
 *
 * sharedState Result:
 *   ["transaction:notify"] = { journeyStatus: "Front Channel Message" }
 */

var nodeOutcomes = {
    SUCCESS: "Success",
    ERROR: "Error"
};

(function () {
    logger.error(scriptName + ": Node execution started");
    try {
        var stateKey = properties.journeyStatusKey;
        var propertyName = properties.journeyStatusProperty;
        var propertyValue = properties.journeyStatusValue;
        var obj = {};
        obj[propertyName] = propertyValue;
        nodeState.putShared(stateKey, obj);
        logger.error(scriptName + ": Node execution completed");
        action.goTo(nodeOutcomes.SUCCESS);
    } catch (e) {
        logger.error(scriptName + ": Failed to update sharedState. Exception: " + e);
        action.goTo(nodeOutcomes.ERROR);
    }
})();