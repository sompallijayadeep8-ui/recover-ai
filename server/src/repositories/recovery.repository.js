const pool = require("../config/database");


// client is optional — pass a pg PoolClient to run inside a transaction
async function createRecoveryAttempt({
    transactionId,
    auditId,
    attemptNumber,
    action,
    status,
    amount,
    reason
}, client) {

    const db = client || pool;

    const result = await db.query(
        `
        INSERT INTO recovery_attempts (
            transaction_id,
            audit_id,
            attempt_number,
            action,
            status,
            amount,
            reason
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        )
        RETURNING *
        `,
        [
            transactionId,
            auditId,
            attemptNumber,
            action,
            status,
            amount,
            reason
        ]
    );

    return result.rows[0];
}


async function getRecoveryAttemptsByTransactionId(
    transactionId
) {

    const result = await pool.query(
        `
        SELECT *
        FROM recovery_attempts
        WHERE transaction_id = $1
        ORDER BY attempt_number ASC
        `,
        [transactionId]
    );

    return result.rows;
}


async function getLatestAuditDecision(transactionId) {

    const result = await pool.query(
        `
        SELECT
            id,
            policy_decision,
            policy_action,
            policy_reason
        FROM audit_logs
        WHERE transaction_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [transactionId]
    );

    return result.rows[0] || null;
}

async function getAllRecoveryAttempts() {

    const result = await pool.query(
        `
        SELECT *
        FROM recovery_attempts
        ORDER BY created_at DESC
        `
    );

    return result.rows;
}


module.exports = {
    createRecoveryAttempt,
    getRecoveryAttemptsByTransactionId,
    getLatestAuditDecision,
    getAllRecoveryAttempts
};