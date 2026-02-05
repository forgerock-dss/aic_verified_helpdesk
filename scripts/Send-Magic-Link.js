/**
 * @file This script sends a templated magiclink to a user via the IDM's configured email service
 * using the openidm binding in next-gen scripting
 * NOTE - The use of SendGrid is not supported in Production and must be changed to your own email service
 * @version 0.1.1
 * @keywords email mail magiclink sharedState transientState templateService
 */

/**
 * Script configuration
*/
var nodeConfig = {

  mail: "customer.email",
  id: "customer._id",
  templateID: "verifyResetPassword",
  idmEndpoint: "external/email",
  idmAction: "sendTemplate"
};

/**
 * Node outcomes
*/
var nodeOutcome = {
  SUCCESS: "Success",
  FAILED: "Failed"
};

/**
 * Send email via the IDM Email Service openidm binding in next-gen scripting
 * 
 * @param {string} id - _id of user from sharedShare
 * @param {string} email - mail attribute from sharedState
 * @param {string} suspendLink - suspendLink containing the transactionId of the back channel journey and suspendId to continue the front channel journey
 */

function sendMail(id, email, suspendLink) {
  try {
    var templateId = nodeConfig.templateID;
    var idmEndpoint = nodeConfig.idmEndpoint;
    var idmAction = nodeConfig.idmAction;
    var identity = idRepository.getIdentity(id);
    var givenName = identity.getAttributeValues("givenName").toArray()[0];
    var params = new Object();

    params.templateName = templateId;
    params.to = email;
    params.object = {
      "givenName": givenName,
      "resumeURI": suspendLink
    };

    openidm.action(idmEndpoint, idmAction, params);
    logger.debug(scriptName + "Email send successfully");
    return "true";
  }
  catch (e) {
    //Note script defaults to display user message on screen and does not follow the Failed outcome
    logger.error(scriptName + ": Failed to call IDM Email endpoint using template. Exception is: " + e);
    return "false";
  }
};

/**
 * Main function
 */
(function () {
  logger.error(scriptName + ": Node execution started");
  var email;
  var suspendLink;
  var backchannelUrl;

  //Exit if backchannel redirectUri not found in sharedState
  if (!(backchannelUrl = nodeState.get("backchannel-redirectUri"))) {
    logger.error(scriptName + ": Unable to get backchannel-redirectUri from sharedState");
    action.goTo(nodeOutcome.FAILED);
    return;
  }
  
  //Exit if mail to found sharedState
  if (!(email = nodeState.get(nodeConfig.mail))) {
    logger.error(scriptName + ": Unable to get mail from the sharedState attribute");
    action.goTo(nodeOutcome.FAILED);
    return;
  }

  //Exit if _id of user not found in sharedState
  if (!(id = nodeState.get(nodeConfig.id))) {
    logger.error(scriptName + ": Unable to get _id from sharedState attribute");
    action.goTo(nodeOutcome.FAILED);
    return;
  }

  //Send email with suspend link and exit
  sendMail(id, email, backchannelUrl);
  action.goTo(nodeOutcome.SUCCESS);

})();