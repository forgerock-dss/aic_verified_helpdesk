/**
 * Main function
 */

(function () {
  logger.error(scriptName + "Node execution started");

  if (callbacks.isEmpty()) {
    var userMessage = properties.message;
    callbacksBuilder.textOutputCallback(0, userMessage);
  } else {
    logger.error(scriptName + "Node execution completed");
    action.goTo("Success");
  }
})();