const transactions = [
    {
        id: "TXN_1001",
        customerId: "CUS_101",
        amount: 4999,
        currency: "INR",
        status: "FAILED",
        failureReason: "NETWORK_TIMEOUT",
        retryCount: 0
    },
    {
        id: "TXN_1002",
        customerId: "CUS_102",
        amount: 2499,
        currency: "INR",
        status: "FAILED",
        failureReason: "INSUFFICIENT_FUNDS",
        retryCount: 0
    },
    {
        id: "TXN_1003",
        customerId: "CUS_103",
        amount: 7999,
        currency: "INR",
        status: "SUCCESS",
        failureReason: null,
        retryCount: 0
    }
];

module.exports = transactions;