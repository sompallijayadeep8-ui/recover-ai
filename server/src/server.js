
require("dotenv").config();

const express = require("express");
const cors = require("cors");



const transactions = require("./data/transactions");


const {
    createAuditLog,
    getAuditLogs,
    getAuditLogByTransactionId,
    getAuditLogsBySeverity
} = require("./services/audit.service");



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


const {
    compareDecisions
} = require("./services/comparison.service");

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

 app.get("/api/audit/:transactionId", (req, res) => {

    const logs =
        getAuditLogByTransactionId(
            req.params.transactionId
        );

    res.json(logs);

});


    app.get("/api/audit", (req, res) => {

    res.json(getAuditLogs());

});

app.get("/api/audit/severity/:severity", (req, res) => {

    const severity =
        req.params.severity.toUpperCase();

    const validSeverities = [
        "LOW",
        "MEDIUM",
        "HIGH"
    ];

    if (!validSeverities.includes(severity)) {
        return res.status(400).json({
            error: "Invalid severity",
            allowedValues: validSeverities
        });
    }

    const logs =
        getAuditLogsBySeverity(severity);

    res.json(logs);
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

    
    const baselineDecision = generateBaselineDecision(scoring);
    



    const aiDecision =
    await generateRecoveryDecision({
        transaction,
        customerContext,
        scoring
    });

    const comparison =
    compareDecisions(
        baselineDecision,
        aiDecision
    );


    const policy = validateRecovery(
        transaction,
        aiDecision,
        customer
    );

    const auditLog = createAuditLog({
    transaction,
    baseline: baselineDecision,
    aiDecision,
    comparison,
    policy
});

    res.json({
        transaction,
        //decision,

        customer : customerContext,
        baseline : baselineDecision,
        aiDecision,
        comparison,
        policy,
        auditId: auditLog.id
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