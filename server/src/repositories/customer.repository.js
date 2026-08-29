const pool = require("../config/database");


async function getCustomerById(id) {

    const result = await pool.query(
        `
       SELECT
    id,
    total_payments AS "totalPayments",
    successful_payments AS "successfulPayments",
    failed_payments AS "failedPayments",
    chargebacks,
    previous_recoveries AS "previousRecoveries",
    total_spent AS "totalSpent",
    average_transaction_amount AS "averageTransactionAmount"
    FROM customers
    WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
}


async function getAllCustomers() {

    const result = await pool.query(
        `
        SELECT
            id,
            total_payments,
            successful_payments,
            failed_payments,
            chargebacks,
            previous_recoveries,
            total_spent,
            average_transaction_amount
        FROM customers
        ORDER BY id
        `
    );

    return result.rows;
}


module.exports = {
    getCustomerById,
    getAllCustomers
};