
require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("dotenv").config();

const transactions = require("./data/transactions");



const {
    generateRecoveryDecision
} = require("./services/ai/ai.service");



const {
    calculateRecoveryScore
} = require("./services/scoring.service");




const {
    generateBaselineDecision
} = require("./services/decision.service");


const {
    analyzeTransaction
} = require("./services/recovery.service");

const {
    validateRecovery
} = require("./services/policy.service");


const customers = require("./data/customers");

const {
    getCustomerById,
    buildCustomerContext
} = require("./services/customer.service");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "RecoverAI API"
    });
});

app.get("/api/transactions", (req, res) => {
    res.json(transactions);
});



app.get("/api/transactions/:id", (req, res) => {

    const transaction = transactions.find(
        (txn) => txn.id === req.params.id
    );

    if (!transaction) {
        return res.status(404).json({
            error: "Transaction not found"
        });
    }

    res.json(transaction);
});


app.post("/api/transactions/:id/retry", (req, res) => {

    const transaction = transactions.find(
        (txn) => txn.id === req.params.id
    );

    if (!transaction) {
        return res.status(404).json({
            error: "Transaction not found"
        });
    }

    if (transaction.status === "SUCCESS") {
        return res.status(400).json({
            error: "Transaction is already successful"
        });
    }

    transaction.retryCount += 1;
    transaction.status = "SUCCESS";
    transaction.failureReason = null;

    res.json({
        message: "Payment recovered successfully",
        transaction
    });
});


app.post("/api/recovery/:id/analyze", async (req, res) => {

    const transaction = transactions.find(
        (txn) => txn.id === req.params.id
    );

    if (!transaction) {
        return res.status(404).json({
            error: "Transaction not found"
        });
    }

    //const decision = analyzeTransaction(transaction);


     const customer =
        getCustomerById(transaction.customerId);

    if (!customer) {
        return res.status(404).json({
            error: "Customer not found"
        });
    }

    const customerContext =
        buildCustomerContext(customer);

        const scoring = calculateRecoveryScore(
    transaction,
    customer
);

    /* const decision = {
    classification:
        scoring.score >= 70
            ? "RECOVERABLE"
            : scoring.score >= 40
                ? "UNCERTAIN"
                : "NOT_RECOVERABLE",

    recoveryScore: scoring.score,

    recommendedAction:
        scoring.score >= 70
            ? "RETRY"
            : "HUMAN_REVIEW",

    confidence: scoring.score / 100,

    reason: "Decision generated from recovery scoring baseline",

    factors: scoring.factors
};*/

     const decision =
    generateBaselineDecision(scoring);


    const aiDecision =
    await generateRecoveryDecision({
        transaction,
        customerContext,
        scoring
    });


    const policy = validateRecovery(
        transaction,
        aiDecision
    );

    res.json({
        transaction,
        //decision,
        customer : customerContext,
        baseline : generateBaselineDecision,
        aiDecision,
        policy
    });
});

app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        error: "Internal server error",
        reason: err.message
    });
});
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`RecoverAI server running on port ${PORT}`);
});