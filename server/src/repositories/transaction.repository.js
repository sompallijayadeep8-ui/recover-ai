const pool = require("../config/database");


async function getTransactionById(id) {

    const result = await pool.query(
        `
        SELECT
            id,
            customer_id AS "customerId",
            amount,
            currency,
            status,
            failure_reason AS "failureReason",
            retry_count AS "retryCount"
        FROM transactions
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
}


async function getAllTransactions() {

    const result = await pool.query(
        `
        SELECT
            id,
            customer_id AS "customerId",
            amount,
            currency,
            status,
            failure_reason AS "failureReason",
            retry_count AS "retryCount"
        FROM transactions
        ORDER BY id
        `
    );

    return result.rows;
}


// client is optional — pass a pg PoolClient to run inside a transaction
async function recoverTransaction(id, outcome, client) {

    const db = client || pool;

    const result = await db.query(
        `
        UPDATE transactions
        SET
            retry_count = retry_count + 1,
            status = $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            id,
            customer_id AS "customerId",
            amount,
            currency,
            status,
            failure_reason AS "failureReason",
            retry_count AS "retryCount"
        `,
        [
            id,
            outcome.status
        ]
    );

    if (!result.rows[0]) {
        throw new Error(
            `recoverTransaction: no transaction found with id="${id}"`
        );
    }

    return result.rows[0];
}


module.exports = {
    getTransactionById,
    getAllTransactions,
    recoverTransaction
};