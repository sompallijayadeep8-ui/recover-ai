
require("dotenv").config();

const express = require("express");
const cors = require("cors");








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
    getTransactionById,
    getAllTransactions,
    recoverTransaction
} = require("./repositories/transaction.repository");



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

/*app.get("/api/transactions", (req, res) => {
    res.json(transactions);
});*/


/*app.get("/api/transactions/:id", (req, res) => {

    const transaction = transactions.find(
        (txn) => txn.id === req.params.id
    );

    if (!transaction) {
        return res.status(404).json({
            error: "Transaction not found"
        });
    }

    res.json(transaction);
});*/


app.get("/api/transactions", async (req, res) => {

    const transactions =
        await getAllTransactions();

    res.json(transactions);
});

app.get(
    "/api/transactions/:id",
    async (req, res) => {

        const transaction =
            await getTransactionById(
                req.params.id
            );

        if (!transaction) {
            return res.status(404).json({
                error: "Transaction not found"
            });
        }

        res.json({
            id: transaction.id,
            customerId: transaction.customer_id,
            amount: Number(transaction.amount),
            currency: transaction.currency,
            status: transaction.status,
            failureReason: transaction.failure_reason,
            retryCount: transaction.retry_count
        });
    }
);


app.post("/api/transactions/:id/retry", async (req, res) => {

   /* const transaction = transactions.find(
        (txn) => txn.id === req.params.id
    );*/



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

   const updatedTransaction =
    await recoverTransaction(
        req.params.id
    );

    res.json({
    message: "Payment recovered successfully",
    transaction: {
        id: updatedTransaction.id,
        customerId: updatedTransaction.customer_id,
        amount: Number(updatedTransaction.amount),
        currency: updatedTransaction.currency,
        status: updatedTransaction.status,
        failureReason: updatedTransaction.failure_reason,
        retryCount: updatedTransaction.retry_count
    }
});
});

 app.get("/api/audit/:transactionId", async (req, res) => {

    const logs =
      await  getAuditLogByTransactionId(
            req.params.transactionId
        );

    res.json(logs);

});


    app.get("/api/audit", async (req, res) => {

   // res.json(getAuditLogs());

   const logs = await getAuditLogs();

   res.json(logs);

});

app.get("/api/audit/severity/:severity", async (req, res) => {

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
       await getAuditLogsBySeverity(severity);

    res.json(logs);
});


app.post("/api/recovery/:id/analyze", async (req, res) => {

    /*const transaction = transactions.find(
        (txn) => txn.id === req.params.id
    );*/

    const transaction =
    await getTransactionById(
        req.params.id
    );

    if (!transaction) {
        return res.status(404).json({
            error: "Transaction not found"
        });
    }


   

   // const decision = analyzeTransaction(transaction);

      const customer =
      await  getCustomerById(transaction.customerId);


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

    const auditLog =await createAuditLog({
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