/**
 * If selected displays contents of objectAttributes across shared and transientState
 * Handles the scenario where objectAttributes is not present in nodeState
 * Displays multiple nodeState variables specified in the node property array 'nodeStateVariable'
 * Handles case where key is not present in nodeState
 * v1_0
 */

var nodeOutcomes = { 
    NEXT: "Next" 
};

(function () {
    logger.error(scriptName + ": Node execution started");

    if (callbacks.isEmpty()) {
        const objectAttributes = properties.objectAttributes;      
        const stateVariables   = properties.nodeStateVariable || [];

        //Handle objectAttributes from both shared and transient state
        if (objectAttributes) {
            const oa = nodeState.getObject("objectAttributes");
            if (oa) {
                const keys = (typeof oa.keySet === "function") ? oa.keySet().toArray() : Object.keys(oa);
                keys.forEach(function (key) {
                    //Guards against TypeErrors
                    const val = (typeof oa.get === "function") ? oa.get(key) : oa[key];
                    callbacksBuilder.stringAttributeInputCallback(String(key), "objectAttributes." + String(key), String(val), false);

                });
                logger.debug(scriptName + ": objectAttributes processed (" + keys.length + " keys).");
            } else {
                logger.error(scriptName + ": objectAttributes not present in nodeState.");
                callbacksBuilder.textOutputCallback(0, "Variable objectAttributes not found in nodeState.");
            }
        }

        //Handle getting config defined variables from NodeState, with error handling if the variable is not present in state
        if (stateVariables.length > 0) {
            stateVariables.forEach(function (key) {
                var value = nodeState.get(key);

                if (value === null || value === undefined) {
                    var msg = "Variable " + key + " not found in nodeState.";
                    logger.error(scriptName + ": " + msg);
                    callbacksBuilder.textOutputCallback(0, msg);
                    return;
                }

                callbacksBuilder.stringAttributeInputCallback(String(key), "nodeState." + String(key), String(value), false);
                logger.debug(scriptName + ": nodeState variable '" + key + "' = " + value);
            });
        } else {
            logger.error(scriptName + ": No nodeStateVariable array defined or it's empty in node properties.");
            callbacksBuilder.stringAttributeInputCallback("Error", "nodeStateVariable", "No variables defined in node configuration", false);
        }
    } else {
        logger.error(scriptName + ": Node execution completed");
        action.goTo(nodeOutcomes.NEXT);
    }
})();