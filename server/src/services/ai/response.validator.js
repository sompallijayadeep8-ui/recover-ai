const ALLOWED_CLASSIFICATIONS = [
    "RECOVERABLE",
    "UNCERTAIN",
    "NOT_RECOVERABLE"
];

const ALLOWED_ACTIONS = [
    "RETRY",
    "SEND_REMINDER",
    "HUMAN_REVIEW"
];

function validateAIResponse(response) {

    if (!response || typeof response !== "object") {
        return {
            valid: false,
            reason: "AI response must be an object"
        };
    }

    if (
        !ALLOWED_CLASSIFICATIONS.includes(
            response.classification
        )
    ) {
        return {
            valid: false,
            reason: "Invalid classification"
        };
    }

    if (
        typeof response.recoveryScore !== "number" ||
        response.recoveryScore < 0 ||
        response.recoveryScore > 100
    ) {
        return {
            valid: false,
            reason: "Invalid recovery score"
        };
    }

    if (
        !ALLOWED_ACTIONS.includes(
            response.recommendedAction
        )
    ) {
        return {
            valid: false,
            reason: "Invalid recommended action"
        };
    }

    if (
        typeof response.confidence !== "number" ||
        response.confidence < 0 ||
        response.confidence > 1
    ) {
        return {
            valid: false,
            reason: "Invalid confidence"
        };
    }

    if (
        typeof response.reason !== "string" ||
        response.reason.trim().length === 0
    ) {
        return {
            valid: false,
            reason: "Reason is required"
        };
    }

    return {
        valid: true
    };
}

module.exports = {
    validateAIResponse
};