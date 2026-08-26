const {
    getCustomerById: findCustomerById
} = require("../repositories/customer.repository");


async function getCustomerById(customerId) {

    return await findCustomerById(customerId);
}


function buildCustomerContext(customer) {

    if (!customer) {
        return null;
    }

    const successRate =
        customer.total_payments === 0
            ? 0
            : customer.successful_payments /
              customer.total_payments;


    const averageTransactionAmount =
        customer.total_payments === 0
            ? 0
            : Number(customer.total_spent) /
              customer.total_payments;


    return {

        id: customer.id,

        paymentHistory: {

            totalPayments:
                customer.total_payments,

            successfulPayments:
                customer.successful_payments,

            failedPayments:
                customer.failed_payments,

            successRate:
                Number(
                    successRate.toFixed(2)
                )
        },

        riskSignals: {

            chargebacks:
                customer.chargebacks
        },

        recoveryHistory: {

            previousRecoveries:
                customer.previous_recoveries
        },

        spending: {

            totalSpent:
                Number(customer.total_spent),

            averageTransactionAmount:
                Number(
                    averageTransactionAmount.toFixed(2)
                )
        }
    };
}


module.exports = {
    getCustomerById,
    buildCustomerContext
};