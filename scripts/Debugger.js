/**
 * Prints shared, transient state, object attributes, request parameters, headers and Cookies
 */

/**
 * Node outcomes
 */
var nodeOutcomes = {
    NEXT: "Next"
};

/**
 * Main
 */

(function() {
    logger.debug("node executing");
    if (callbacks.isEmpty()) {
      
        // nodeState
        nodeState.keys().toArray().forEach(
            function(key) {
                var value = nodeState.get(key);
                callbacksBuilder.stringAttributeInputCallback(key, "nodeState.".concat(key), value, false);
            }
        );
      
        // objectAttributes
        var oa = nodeState.getObject("objectAttributes");
        if (!!oa) {
            Object.keys(oa).forEach(
                function(key) {
                    callbacksBuilder.stringAttributeInputCallback(key, "objectAttributes.".concat(key), oa.get(key), false);
                }
            );
        }
      
        // Cookies
        var cookieHeader = requestHeaders.get("cookie");
        if (!!cookieHeader) {
        var cookies = cookieHeader.get(0).split(";");
        cookies.forEach(
            function(key) {
                var cookieSpec = key.split("=");
                callbacksBuilder.stringAttributeInputCallback(cookieSpec[0].trim(), "Cookies.".concat(cookieSpec[0].trim()), cookieSpec[1].trim(), false);
            }
        ); 
        }
      
        // requestParameters 
        var requestParamKeys = Object.keys(requestParameters);
        requestParamKeys.forEach(
            function(key) {
                var value = requestParameters.get(key).get(0);
                callbacksBuilder.stringAttributeInputCallback(key, "requestParameters.".concat(key), value, false);
            }
        );

        // requestHeaders
        var requestHeaderKeys = Object.keys(requestHeaders);
        requestHeaderKeys.forEach(
            function(key) {
                var value = requestHeaders.get(key).get(0);
                callbacksBuilder.stringAttributeInputCallback(key, "requestHeaders.".concat(key), value, false);
            }
        );
    } else {
        action.goTo(nodeOutcomes.NEXT);
    }
})();