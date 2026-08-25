function compareDecisions(baseline, aiDecision) {

    const scoreDifference =
        Math.abs(
            baseline.recoveryScore -
            aiDecision.recoveryScore
        );

    const classificationAgreement =
        baseline.classification ===
        aiDecision.classification;

    const actionAgreement =
        baseline.recommendedAction ===
        aiDecision.recommendedAction;

    let severity = "LOW";

    if (
        !classificationAgreement ||
        !actionAgreement
    ) {
        severity = "HIGH";
    } else if (
        scoreDifference >= 15
    ) {
        severity = "MEDIUM";
    }

    return {
        classificationAgreement,
        actionAgreement,
        scoreDifference,
        severity
    };
}

module.exports = {
    compareDecisions
};