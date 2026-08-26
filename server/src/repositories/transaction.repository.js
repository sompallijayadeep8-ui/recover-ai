const pool = require("../config/database");


async function getTransactionById(id) {

    const result = await pool.query(
        `
        SELECT
            id,
            customer_id,
            amount,
            currency,
            status,
            failure_reason,
            retry_count
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
            customer_id,
            amount,
            currency,
            status,
            failure_reason,
            retry_count
        FROM transactions
        ORDER BY id
        `
    );

    return result.rows;
}

async function recoverTransaction(id) {

    const result = await pool.query(
        `
        UPDATE transactions
        SET
            retry_count = retry_count + 1,
            status = 'SUCCESS',
            failure_reason = NULL,
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            id,
            customer_id,
            amount,
            currency,
            status,
            failure_reason,
            retry_count
        `,
        [id]
    );

    return result.rows[0] || null;
}


module.exports = {
    getTransactionById,
    getAllTransactions,
    recoverTransaction
};