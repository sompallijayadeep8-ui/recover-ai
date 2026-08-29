const {
    getAnalyticsOverview,
    getDecisionMetrics,
    getRecoveryMetrics
} = require("../repositories/analytics.repository");


async function buildAnalyticsOverview() {

    const overview =
        await getAnalyticsOverview();

    const decisions =
        await getDecisionMetrics();

    const recovery =
        await getRecoveryMetrics();


    const failedPayments =
        Number(overview.failed_payments);

    const revenueAtRisk =
        Number(overview.revenue_at_risk);


    const retriesExecuted =
        Number(recovery.retries_executed);

    const successfulRecoveries =
        Number(recovery.successful_recoveries);

    const revenueRecovered =
        Number(recovery.revenue_recovered);


    const recoveryRate =
        retriesExecuted === 0
            ? 0
            : (successfulRecoveries /
                retriesExecuted) * 100;


    const revenueRecoveryRate =
        revenueAtRisk === 0
            ? 0
            : (revenueRecovered /
                revenueAtRisk) * 100;


    return {

        overview: {
            failedPayments,
            revenueAtRisk,
            successfulTransactions:
                Number(
                    overview.successful_transactions
                )
        },

        decisions: {
            aiAnalyzed:
                Number(decisions.ai_analyzed),

            aiRecoverable:
                Number(decisions.ai_recoverable),

            aiUncertain:
                Number(decisions.ai_uncertain),

            aiNotRecoverable:
                Number(
                    decisions.ai_not_recoverable
                ),

            policyApproved:
                Number(
                    decisions.policy_approved
                ),

            policyReview:
                Number(
                    decisions.policy_review
                ),

            policyBlocked:
                Number(
                    decisions.policy_blocked
                )
        },

        recovery: {
            retriesExecuted,
            successfulRecoveries,
            failedRecoveries:
                Number(
                    recovery.failed_recoveries
                ),

            revenueRecovered,

            recoveryRate:
                Number(
                    recoveryRate.toFixed(2)
                ),

            revenueRecoveryRate:
                Number(
                    revenueRecoveryRate.toFixed(2)
                )
        }
    };
}


module.exports = {
    buildAnalyticsOverview
};