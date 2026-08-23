const MAX_AUTO_RECOVERY_AMOUNT = 10000;

function validateRecovery(transaction, decision) {

    if (!decision.eligible) {
        return {
            approved: false,
            reason: decision.reason
        };
    }

    if (transaction.amount > MAX_AUTO_RECOVERY_AMOUNT) {
        return {
            approved: false,
            reason: "Transaction amount exceeds automatic recovery limit"
        };
    }

    return {
        approved: true,
        reason: "Recovery action passed policy checks"
    };
}

module.exports = {
    validateRecovery
};