/*
 * Next Generation Config Provider Node Script
 * Updates the front channel Poll Wait Node with status updates as the Back Channel Journey progresses
 * Logic based on the stateKey value and if not present defaults to defaultStatus
 */

var config = {
    stateKey: "transaction:data",
    statusKey: "journeyStatus",
    defaultStatus: "The identity verification user journey has been initiated.",
    secondsToWait: 3,
    spamDetectionEnabled: false,
    spamDetectionTolerance: 3,
    exitable: false,
    exitMessage: {}
};

var data = nodeState.get(config.stateKey);

var message = (
    data &&
    typeof data === "object" &&
    data[config.statusKey]
) ? data[config.statusKey] : config.defaultStatus;

config = {
    secondsToWait: config.secondsToWait,
    spamDetectionEnabled: config.spamDetectionEnabled,
    spamDetectionTolerance: config.spamDetectionTolerance,
    waitingMessage: { en: message },
    exitable: config.exitable,
    exitMessage: config.exitMessage
};