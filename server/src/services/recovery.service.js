const RECOVERABLE_FAILURES = [
    "NETWORK_TIMEOUT",
    "TEMPORARY_BANK_ERROR"
];

function analyzeTransaction(transaction) {

    if (!transaction) {
        return {
            eligible: false,
            reason: "Transaction not found"
        };
    }

    if (transaction.status === "SUCCESS") {
        return {
            eligible: false,
            reason: "Transaction is already successful"
        };
    }

    if (!RECOVERABLE_FAILURES.includes(transaction.failureReason)) {
        return {
            eligible: false,
            reason: "Failure type is not automatically recoverable"
        };
    }

    if (transaction.retryCount >= 2) {
        return {
            eligible: false,
            reason: "Maximum retry limit reached"
        };
    }

    return {
        eligible: true,
        recommendedAction: "RETRY",
        reason: "Transaction has a potentially recoverable failure"
    };
}

module.exports = {
    analyzeTransaction
};