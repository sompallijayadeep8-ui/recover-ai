function simulateRecoveryOutcome(transaction) {

   const reason = transaction.failureReason;
   const retryCount = transaction.retryCount;

    // Rule 1 — Retry limit reached
    if (retryCount >= 3) {
        return {
            status: "BLOCKED",
            reason: "Maximum retry attempts reached"
        };
    }

    // Rule 2 — Never auto recover
    if (
        reason === "INSUFFICIENT_FUNDS" ||
        reason === "CARD_EXPIRED" ||
        reason === "FRAUD_SUSPECTED"
    ) {
        return {
            status: "FAILED",
            reason: "Customer action required"
        };
    }

    // Rule 3 — Recoverable gateway failures
    if (
        reason === "NETWORK_TIMEOUT" ||
        reason === "BANK_SERVER_ERROR" ||
        reason === "UPI_TIMEOUT"
    ) {

        const success = Math.random() < 0.8;

       // const success = false;

        return success
            ? {
                  status: "SUCCESS",
                  reason: "Gateway recovered on retry"
              }
            : {
                  status: "FAILED",
                  reason: "Gateway retry failed"
              };
    }

    // Default
    return {
        status: "FAILED",
        reason: "Unknown recovery scenario"
    };
}

module.exports = {
    simulateRecoveryOutcome
};