const auditLogs = [];


function createAuditLog({
    transaction,
    baseline,
    aiDecision,
    comparison,
    policy
}) {

    const auditEntry = {
        id: `AUDIT_${auditLogs.length + 1}`,

        timestamp: new Date().toISOString(),

        transactionId: transaction.id,

        baseline: {
            classification: baseline.classification,
            recoveryScore: baseline.recoveryScore,
            recommendedAction: baseline.recommendedAction,
            confidence: baseline.confidence
        },

        aiDecision: {
            classification: aiDecision.classification,
            recoveryScore: aiDecision.recoveryScore,
            recommendedAction: aiDecision.recommendedAction,
            confidence: aiDecision.confidence
        },

        comparison: {
            classificationAgreement:
                comparison.classificationAgreement,

            actionAgreement:
                comparison.actionAgreement,

            scoreDifference:
                comparison.scoreDifference,

            severity:
                comparison.severity
        },

        policy: {
            decision: policy.decision,
            action: policy.action,
            reason: policy.reason
        }
    };

    auditLogs.push(auditEntry);

    return auditEntry;
}


function getAuditLogs() {
    return auditLogs;
}


function getAuditLogByTransactionId(transactionId) {

    return auditLogs.filter(
        (log) =>
            log.transactionId === transactionId
    );
}

function getAuditLogsBySeverity(severity) {

    return auditLogs.filter(
        (log) =>
            log.comparison.severity === severity
    );
}


module.exports = {
    createAuditLog,
    getAuditLogs,
    getAuditLogByTransactionId,
    getAuditLogsBySeverity
};