/*const MAX_AUTO_RECOVERY_AMOUNT = 10000;

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
};*/


const recoverableFailures = [
    "NETWORK_TIMEOUT",
    "TEMPORARY_BANK_ERROR"
];

const nonRecoverableFailures = [
    "INSUFFICIENT_FUNDS",
    "FRAUD",
    "ACCOUNT_BLOCKED",
    "CHARGEBACK"
];

const MAX_RETRY_ATTEMPTS = 2;
const MAX_AUTO_RECOVERY_AMOUNT = 7500;
const MIN_AUTO_RECOVERY_SUCCESS_RATE = 0.5;


function validateRecovery(transaction, decision, customer) {

    /*
     * POLICY 1
     * Invalid / unsupported failure type
     */

    if (
        nonRecoverableFailures.includes(
            transaction.failureReason
        )
    ) {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason:
                "Failure type is not eligible for automatic recovery"
        };
    }


    /*
     * POLICY 2
     * Failure must be recoverable
     */

    if (
        !recoverableFailures.includes(
            transaction.failureReason
        )
    ) {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason:
                "Failure type is not classified as recoverable"
        };
    }


    /*
     * POLICY 3
     * Maximum retry attempts
     */

    if (
        transaction.retryCount >=
        MAX_RETRY_ATTEMPTS
    ) {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason:
                "Maximum retry attempts reached"
        };
    }


    /*
     * POLICY 4
     * High-value transaction
     *
     * Never automatically retry high-value payments.
     */

    if (
        transaction.amount >
        MAX_AUTO_RECOVERY_AMOUNT
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason:
                "Transaction amount exceeds automatic recovery limit"
        };
    }


    /*
     * POLICY 5
     * Customer payment reliability
     *
     * Customers with success rate below 50%
     * cannot receive automatic recovery.
     */

    const successRate =
        customer.totalPayments === 0
            ? 0
            : customer.successfulPayments /
              customer.totalPayments;


    if (
        successRate <
        MIN_AUTO_RECOVERY_SUCCESS_RATE
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason:
                "Customer payment success rate is below automatic recovery threshold"
        };
    }


    /*
     * POLICY 6
     * Chargeback history
     *
     * Any chargeback creates additional risk.
     */

    if (
        customer.chargebacks > 0
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason:
                "Customer has chargeback history"
        };
    }


    /*
     * POLICY 7
     * AI recommendation must be safe
     */

    if (
        decision.recommendedAction !==
        "RETRY"
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason:
                "AI did not recommend automatic retry"
        };
    }


    /*
     * POLICY 8
     * AI confidence threshold
     */

    if (
        decision.confidence < 0.7
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason:
                "AI confidence is below automatic recovery threshold"
        };
    }


    /*
     * POLICY 9
     * AI classification must support recovery
     */

    if (
        decision.classification !==
        "RECOVERABLE"
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason:
                "AI did not classify the payment as recoverable"
        };
    }


    /*
     * ALL POLICIES PASSED
     */

    return {
        decision: "APPROVE",
        action: "RETRY",
        reason:
            "All recovery policies passed"
    };
}


module.exports = {
    validateRecovery
};




/*const POLICY = {
    maxAutoRecoveryAmount: 10000,
    maxRetryAttempts: 2,
    minAIConfidence: 0.80
};

const ALLOWED_ACTIONS = [
    "RETRY",
    "SEND_REMINDER",
    "HUMAN_REVIEW"
];

const FAILURE_POLICIES = {
    NETWORK_TIMEOUT: {
        autoRecoverable: true
    },

    TEMPORARY_BANK_ERROR: {
        autoRecoverable: true
    },

    INSUFFICIENT_FUNDS: {
        autoRecoverable: false
    },

    FRAUD: {
        autoRecoverable: false
    },

    ACCOUNT_BLOCKED: {
        autoRecoverable: false
    },

    CHARGEBACK: {
        autoRecoverable: false
    }
};

function validateRecovery(transaction, decision) {

    // 1. Validate transaction
    if (!transaction) {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason: "Transaction not found"
        };
    }

    // 2. Transaction must be failed
    if (transaction.status !== "FAILED") {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason: "Transaction is not in a failed state"
        };
    }

    // 3. Validate AI decision
    if (!decision) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason: "No recovery decision available"
        };
    }

    // 4. Validate action
    if (!ALLOWED_ACTIONS.includes(decision.recommendedAction)) {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason: "Unsupported recovery action"
        };
    }

    // 5. Validate recovery score
    if (
        typeof decision.recoveryScore !== "number" ||
        decision.recoveryScore < 0 ||
        decision.recoveryScore > 100
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason: "Invalid recovery score"
        };
    }

    // 6. Validate AI confidence
    if (
        typeof decision.confidence !== "number" ||
        decision.confidence < 0 ||
        decision.confidence > 1
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason: "Invalid AI confidence"
        };
    }

    // 7. Check failure type
    const failurePolicy =
        FAILURE_POLICIES[transaction.failureReason];

    if (!failurePolicy) {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason: "Unknown failure type"
        };
    }

    if (!failurePolicy.autoRecoverable) {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason: "Failure type is not eligible for automatic recovery"
        };
    }

    // 8. Check amount
    if (
        transaction.amount >
        POLICY.maxAutoRecoveryAmount
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason: "Transaction amount exceeds automatic recovery limit"
        };
    }

    // 9. Check retry count
    if (
        transaction.retryCount >=
        POLICY.maxRetryAttempts
    ) {
        return {
            decision: "BLOCK",
            action: "NONE",
            reason: "Maximum retry attempts reached"
        };
    }

    // 10. Check AI confidence
    if (
        decision.recommendedAction === "RETRY" &&
        decision.confidence < POLICY.minAIConfidence
    ) {
        return {
            decision: "REVIEW",
            action: "HUMAN_REVIEW",
            reason: "AI confidence is below the automatic execution threshold"
        };
    }

    // 11. Everything passed

    if (
    decision.recommendedAction === "HUMAN_REVIEW"
) {
    return {
        decision: "REVIEW",
        action: "HUMAN_REVIEW",
        reason: "Recovery requires human review"
    };
}
    return {
        decision: "APPROVE",
        action: decision.recommendedAction,
        reason: "All recovery policies passed"
    };

   
}

module.exports = {
    validateRecovery
};*/