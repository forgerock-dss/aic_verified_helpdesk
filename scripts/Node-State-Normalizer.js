/**
 * Main function
 * Converts state attributes received from the front channel journey into standard stateAttributes
 * For each entry in nodeStateAttributes (e.g. customer._id):
 *  - retrieve the value from nodeState using the full key
 *  - error if not found (null/undefined)
 *  - write it back into shared nodeState using the unprefixed key (e.g. _id)
 */

(function () {

    logger.error(scriptName + ": Node execution started");

    var nodeOutcomes = {
        NEXT: "Next",
        ERROR: "Error"
    };

    // Get node properties (Java List)
    var nodeStateAttributes = properties.nodeStateAttributes;

    logger.error(scriptName + ": nodeStateAttributes are: " + nodeStateAttributes);

    try {
        for (var i = 0; i < nodeStateAttributes.size(); i++) {

            // e.g. "customer._id"
            var fullKey = String(nodeStateAttributes.get(i));

            // Retrieve from nodeState using the prefixed key
            var value = nodeState.get(fullKey);

            // Error if missing
            if (value == null) {
                logger.error(scriptName + ": Missing nodeState key: " + fullKey);
                action.goTo(nodeOutcomes.ERROR);
                return;
            }

            // Strip prefix (exactly one dot)
            var parts = fullKey.split(".");
            var shortKey = parts[1]; // e.g. "_id"

            // Special-case userName → username
            if (shortKey === "userName") {
                shortKey = "username";
            }
            // Store without prefix for downstream nodes
            nodeState.putShared(shortKey, value);

            logger.debug(scriptName + ": Set nodeState '" + shortKey + "' from '" + fullKey + "'");
        }

        logger.error(scriptName + ": Node execution completed");
        action.goTo(nodeOutcomes.NEXT);

    } catch (e) {
        logger.error(scriptName + ": unexpected error");
        logger.debug(scriptName + ": full exception: {}", e);
        action.goTo(nodeOutcomes.ERROR);
    }

})();