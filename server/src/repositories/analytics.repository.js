const pool = require("../config/database");


async function getAnalyticsOverview() {

    const result = await pool.query(`
        SELECT
            COUNT(*) FILTER (
                WHERE status = 'FAILED'
            ) AS failed_payments,

            COALESCE(
                SUM(amount) FILTER (
                    WHERE status = 'FAILED'
                ),
                0
            ) AS revenue_at_risk,

            COUNT(*) FILTER (
                WHERE status = 'SUCCESS'
            ) AS successful_transactions

        FROM transactions;
    `);

    return result.rows[0];
}


async function getDecisionMetrics() {

    const result = await pool.query(`
        SELECT

            COUNT(*) AS ai_analyzed,

            COUNT(*) FILTER (
                WHERE ai_classification = 'RECOVERABLE'
            ) AS ai_recoverable,

            COUNT(*) FILTER (
                WHERE ai_classification = 'UNCERTAIN'
            ) AS ai_uncertain,

            COUNT(*) FILTER (
                WHERE ai_classification = 'NOT_RECOVERABLE'
            ) AS ai_not_recoverable,

            COUNT(*) FILTER (
                WHERE policy_decision = 'APPROVE'
            ) AS policy_approved,

            COUNT(*) FILTER (
                WHERE policy_decision = 'REVIEW'
            ) AS policy_review,

            COUNT(*) FILTER (
                WHERE policy_decision = 'BLOCK'
            ) AS policy_blocked

        FROM audit_logs;
    `);

    return result.rows[0];
}

async function getRecoveryMetrics() {

    const result = await pool.query(`
        SELECT

            COUNT(*) AS retries_executed,

            COUNT(*) FILTER (
                WHERE status = 'SUCCESS'
            ) AS successful_recoveries,

            COUNT(*) FILTER (
                WHERE status = 'FAILED'
            ) AS failed_recoveries,

            COALESCE(
                SUM(amount) FILTER (
                    WHERE status = 'SUCCESS'
                ),
                0
            ) AS revenue_recovered

        FROM recovery_attempts;
    `);

    return result.rows[0];
}





module.exports = {
    getAnalyticsOverview,
    getDecisionMetrics,
    getRecoveryMetrics,
   

};