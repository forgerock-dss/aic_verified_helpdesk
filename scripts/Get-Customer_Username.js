/**
 * Main function
 * Prompts for the customer username
 * If blank re-renders the prompt
 * If present sets in nodeState to the value of nodeStateUserAttribute
 */


(function () {

  logger.error(scriptName + ": Node execution started");

  /**
   * Node outcomes
   */
  var nodeOutcomes = {
    NEXT: "Next"
  };

  /**
 * Node Config
 */
  var nodeConfig = {
    nodeStateUserAttribute: "customer.email"
  };

  if (callbacks.isEmpty()) {
    callbacksBuilder.nameCallback("Customer email");
    return;
  }

  var raw = callbacks.getNameCallbacks().get(0);
  var username = raw == null ? "" : String(raw).trim();

  if (username.length === 0) {
    callbacksBuilder.nameCallback("Customer Email Address");
    return;
  }

  nodeState.putShared(nodeConfig.nodeStateUserAttribute, username);
  logger.error(scriptName + " Node execution completed");
  action.goTo(nodeOutcomes.NEXT);

})();