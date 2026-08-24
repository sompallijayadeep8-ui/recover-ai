const customers = require("../data/customers");

function getCustomerById(customerId) {

    return customers.find(
        customer => customer.id === customerId
    );
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
            : customer.totalSpent /
              customer.totalPayments;

    return {
        id: customer.id,

        paymentHistory: {
            totalPayments: customer.totalPayments,
            successfulPayments: customer.successfulPayments,
            failedPayments: customer.failedPayments,
            successRate: Number(successRate.toFixed(2))
        },

        riskSignals: {
            chargebacks: customer.chargebacks
        },

        recoveryHistory: {
            previousRecoveries: customer.previousRecoveries
        },

        spending: {
            totalSpent: customer.totalSpent,
            averageTransactionAmount:
                Number(averageTransactionAmount.toFixed(2))
        }
    };
}

module.exports = {
    getCustomerById,
    buildCustomerContext
};