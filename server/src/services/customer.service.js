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
        customer.totalPayments === 0
            ? 0
            : customer.successfulPayments /
              customer.totalPayments;


    const averageTransactionAmount =
        customer.totalPayments === 0
            ? 0
            : Number(customer.totalSpent) /
              customer.totalPayments;


    return {

        id: customer.id,

        paymentHistory: {

            totalPayments:
                customer.totalPayments,

            successfulPayments:
                customer.successfulPayments,

            failedPayments:
                customer.failedPayments,

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
                customer.previousRecoveries
        },

        spending: {

            totalSpent:
                Number(customer.totalSpent),

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