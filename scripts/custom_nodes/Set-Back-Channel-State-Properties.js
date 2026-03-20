/**
 * Main function
 */

(function () {
  logger.error(scriptName + "Node execution started");

  //Get node properties
  var nodeStateProperty = properties.backChannelStateProperty;
  var attributeList = properties.attributeListProperty;

  //Loop to get and set attributes into the nodeStateProperty nodeState variable
  var out = {};
  for (var i = 0; i < attributeList.length; i++) {
    var k = attributeList[i];
    var v = nodeState.get(k);
    if (v !== null && v !== undefined) out[k] = v;
  }
  nodeState.putShared(nodeStateProperty, out);
    logger.error(scriptName + "Node execution completed");
  action.goTo("Next");
})();