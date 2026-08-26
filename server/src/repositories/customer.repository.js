const pool = require("../config/database");


async function getCustomerById(id) {

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