/*function calculateRecoveryScore(transaction, customer) {

    let score = 0;
    const factors = [];

    // 1. Failure type
    const recoverableFailures = [
        "NETWORK_TIMEOUT",
        "TEMPORARY_BANK_ERROR"
    ];

   
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

if (recoverableFailures.includes(transaction.failureReason)) {

    score += 30;

    factors.push({
        factor: "recoverable_failure",
        impact: 30
    });

} else if (nonRecoverableFailures.includes(transaction.failureReason)) {

    score -= 40;

    factors.push({
        factor: "non_recoverable_failure",
        impact: -40
    });
}
    // 2. Customer payment success rate
    const successRate =
        customer.totalPayments === 0
            ? 0
            : customer.successfulPayments /
              customer.totalPayments;

    const successRateScore =
        Math.round(successRate * 25);

    score += successRateScore;

    factors.push({
        factor: "customer_success_rate",
        impact: successRateScore
    });

    // 3. Chargeback history
    if (customer.chargebacks === 0) {
        score += 15;

        factors.push({
            factor: "no_chargebacks",
            impact: 15
        });
    } else {
        const chargebackPenalty =
            Math.min(customer.chargebacks * 10, 15);

        score -= chargebackPenalty;

        factors.push({
            factor: "chargebacks",
            impact: -chargebackPenalty
        });
    }

    // 4. Previous successful recoveries
    const recoveryScore =
        Math.min(
            customer.previousRecoveries * 3,
            15
        );

    score += recoveryScore;

    factors.push({
        factor: "previous_recoveries",
        impact: recoveryScore
    });

    // 5. Retry history
    const retryPenalty =
        Math.min(
            transaction.retryCount * 10,
            15
        );

    score -= retryPenalty;

    factors.push({
        factor: "retry_history",
        impact: -retryPenalty
    });

    // 6. Transaction amount
    if (transaction.amount > 7500) {

        score -= 10;

        factors.push({
            factor: "high_transaction_amount",
            impact: -10
        });
    }

    // Keep score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    return {
        score,
        factors
    };
}

module.exports = {
    calculateRecoveryScore
};*/

function calculateRecoveryScore(transaction, customer) {

    let score = 0;
    const factors = [];

    // 1. Failure type
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

    if (recoverableFailures.includes(transaction.failureReason)) {

        score += 30;

        factors.push({
            factor: "recoverable_failure",
            impact: 30
        });

    } else if (nonRecoverableFailures.includes(transaction.failureReason)) {

        score -= 40;

        factors.push({
            factor: "non_recoverable_failure",
            impact: -40
        });
    }

    // 2. Customer payment success rate
    const successRate =
        customer.totalPayments === 0
            ? 0
            : customer.successfulPayments /
              customer.totalPayments;

    const successRateScore =
        Math.round(successRate * 25);

    score += successRateScore;

    factors.push({
        factor: "customer_success_rate",
        impact: successRateScore
    });

    // 3. Chargeback history
    if (customer.chargebacks === 0) {

        score += 15;

        factors.push({
            factor: "no_chargebacks",
            impact: 15
        });

    } else {

        const chargebackPenalty =
            Math.min(customer.chargebacks * 10, 15);

        score -= chargebackPenalty;

        factors.push({
            factor: "chargebacks",
            impact: -chargebackPenalty
        });
    }

    // 4. Previous successful recoveries
    const recoveryScore =
        Math.min(
            customer.previousRecoveries * 3,
            15
        );

    score += recoveryScore;

    factors.push({
        factor: "previous_recoveries",
        impact: recoveryScore
    });

    // 5. Retry history
    const retryPenalty =
        Math.min(
            transaction.retryCount * 10,
            15
        );

    score -= retryPenalty;

    factors.push({
        factor: "retry_history",
        impact: -retryPenalty
    });

    // 6. Transaction amount
    if (transaction.amount > 7500) {

        score -= 10;

        factors.push({
            factor: "high_transaction_amount",
            impact: -10
        });
    }

    // Keep score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    return {
        score,
        factors
    };
}

module.exports = {
    calculateRecoveryScore
};