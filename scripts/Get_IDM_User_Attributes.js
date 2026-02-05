/**
 * Main function
 * Queries IDM based on a user defined query attribute and a attribute value acquired from sharedState
 * Returns either all attributes or a defined subset of attributes
 * Sets these attributes in nodeState for downstream consumption
 * Note if any attributes are null or [] they are not stored in nodeState
 * Errors if user not found, IDM returns no query results, or a generic script error occurs
 */

(function () {

  logger.error(scriptName + ": Node execution started");

  /**
 * Node outcomes
 */
  var nodeOutcomes = {
    NEXT: "Next",
    NOTFOUND: "User_Not_Found",
    ERROR: "Error"
  };

  //Get node properties
  var realm = properties.realm;
  var queryAttributeName = properties.attributeName;
  var queryAttributeValue = properties.attributeValue;
  var allAttributes = properties.allAttributes;
  var subsetAttributes = properties.subsetAttributes;
  var prefixNodeState = properties.prefixNodeState;
  var prefixNodeStateValue = properties.prefixNodeStateValue;

  try {
    // Get user attribute from nodeState
    var user = nodeState.get(queryAttributeValue);

    // User attribute missing → NOTFOUND
    if (user == null) {
      logger.error(scriptName + ": user attribute not found in nodeState");
      action.goTo(nodeOutcomes.NOTFOUND);
      return;
    }

    // Determine attribute projection
    var attributes = null;
    if (allAttributes === true) {
      attributes = ["*"];
    }
    else {
      attributes = subsetAttributes;
    }

    // Query IDM
    var queryRes = openidm.query(
      "managed/" + realm + "_user",
      { "_queryFilter": "/" + queryAttributeName + " eq '" + user + "'" },
      attributes);

    // User not found → NOTFOUND
    if (!queryRes || !queryRes.result || queryRes.result.length === 0) {
      logger.error(scriptName + ": No IDM user found for user: ", user);
      action.goTo(nodeOutcomes.NOTFOUND);
      return;
    }

    // User found
    var userObj = queryRes.result[0];

    // Copy attributes into shared node state
    // Explicitly exclude _rev
    Object.keys(userObj).forEach(function (key) {
      if (key === "_rev") {
        return; // always exclude
      }
      var value = userObj[key];

      //if to ensure null and IDM returned [] values not added to sharedState
      if (value != null && !((Array.isArray(value) && value.length === 0) || (value.size && value.size() === 0))) {
        var targetKey = prefixNodeState === true
      ? prefixNodeStateValue + "." + key
      : key;
        nodeState.putShared(targetKey, value);
      }
    });

    // Success
    logger.debug(scriptName + ": Found user: " + user);
    logger.error(scriptName + " Node execution completed");
    action.goTo(nodeOutcomes.NEXT);

  } catch (e) {
    logger.error(scriptName + ": unexpected error");
    logger.debug(scriptName + ": full exception: {}", e);
    action.goTo(nodeOutcomes.ERROR);
  }

})();