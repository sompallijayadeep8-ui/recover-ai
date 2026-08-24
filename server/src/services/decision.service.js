function generateBaselineDecision(scoring) {

    let classification;
    let recommendedAction;

    if (scoring.score >= 70) {

        classification = "RECOVERABLE";
        recommendedAction = "RETRY";

    } else if (scoring.score >= 40) {

        classification = "UNCERTAIN";
        recommendedAction = "HUMAN_REVIEW";

    } else {

        classification = "NOT_RECOVERABLE";
        recommendedAction = "HUMAN_REVIEW";
    }

    return {
        classification,
        recoveryScore: scoring.score,
        recommendedAction,
        confidence: scoring.score / 100,
        reason: "Decision generated from recovery scoring baseline",
        factors: scoring.factors
    };
}

module.exports = {
    generateBaselineDecision
};