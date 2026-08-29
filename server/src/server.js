
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");


const {
    simulateRecoveryOutcome
} = require("./services/recovery-simulator.service");


const {
    createAuditLog,
    getAuditLogs,
    getAuditLogByTransactionId,
    getAuditLogsBySeverity
} = require("./services/audit.service");


const {
    buildAnalyticsOverview
} = require("./services/analytics.service");



const {
    createRecoveryAttempt,
   getLatestAuditDecision,
    getRecoveryAttemptsByTransactionId,
    getAllRecoveryAttempts
} = require("./repositories/recovery.repository");


/*const {
    createRecoveryAttempt,
    getLatestAuditId
} = require("./repositories/recovery.repository");*/



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
       customerId : transaction.customerId,
       amount: Number(transaction.amount),
        currency: transaction.currency,
        status: transaction.status,
        failureReason: transaction.failureReason,
        retryCount: transaction.retryCount
        });
    }
);





app.post("/api/transactions/:id/retry", async (req, res) => {

    try {

        const transaction =
            await getTransactionById(
                req.params.id
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


        // Get the latest AI + policy decision from audit_logs
        // audit.id here is the raw numeric BIGINT from PostgreSQL (e.g. 11)
        const audit =
            await getLatestAuditDecision(
                req.params.id
            );


        // No analysis has been performed
        if (!audit) {
            return res.status(403).json({
                error: "Recovery analysis required before retry"
            });
        }


        // Policy did not approve the retry
        if (
            audit.policy_decision !== "APPROVE" ||
            audit.policy_action !== "RETRY"
        ) {

            return res.status(403).json({
                error: "Recovery retry blocked by policy",
                policyDecision:
                    audit.policy_decision,
                policyAction:
                    audit.policy_action,
                reason:
                    audit.policy_reason
            });
        }

        const outcome =
            simulateRecoveryOutcome(
                transaction
            );

        if (outcome.status === "BLOCKED") {

            return res.status(403).json({
                error: "Recovery attempt blocked",
                reason: outcome.reason
            });
        }


        // --- Atomic update: BEGIN / COMMIT / ROLLBACK ---
        const client = await pool.connect();

        let updatedTransaction;

        try {

            await client.query("BEGIN");

            // Policy approved → execute recovery (inside transaction)
            updatedTransaction =
                await recoverTransaction(
                    req.params.id,
                    outcome,
                    client
                );

            console.log("CREATING RECOVERY ATTEMPT...");

            // audit.id is the raw numeric DB id returned by getLatestAuditDecision
            await createRecoveryAttempt({

                transactionId:
                    updatedTransaction.id,

                auditId:
                    audit.id,

                attemptNumber:
                    updatedTransaction.retryCount,

                action: "RETRY",

                status:
                    updatedTransaction.status,

                amount:
                    updatedTransaction.amount,

                reason:
                     outcome.reason

            }, client);

            await client.query("COMMIT");

            console.log("RECOVERY ATTEMPT CREATED");

        } catch (dbError) {

            await client.query("ROLLBACK");
            throw dbError;

        } finally {

            client.release();
        }
        // --- End atomic update ---


        res.json({

            message:
                outcome.status === "SUCCESS"
                    ? "Payment recovered successfully"
                    : "Payment recovery failed",

            transaction: {

                id:
                    updatedTransaction.id,

                customerId:
                    updatedTransaction.customerId,

                amount:
                    Number(
                        updatedTransaction.amount
                    ),

                currency:
                    updatedTransaction.currency,

                status:
                    updatedTransaction.status,

                failureReason:
                    updatedTransaction.failureReason,

                retryCount:
                    updatedTransaction.retryCount
            }
        });

    } catch (error) {

        console.error(
            "Recovery retry error:",
            error.message,
            error.stack
        );

        res.status(500).json({
            error: "Failed to process recovery retry",
            reason: error.message
        });
    }
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


   console.log(
    "ANALYSIS TRANSACTION:",
    transaction
);

console.log(
    "CUSTOMER ID:",
    transaction.customerId
);

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


  /* return res.json({
    debug: {
        scoring,
        baseline: baselineDecision,
        aiDecision,
        comparison,
        policy
     }
});*/

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


app.get("/api/recovery-attempts", async (req, res) => {

    try {

        const attempts =
            await getAllRecoveryAttempts();

        res.json(attempts);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Failed to fetch recovery attempts"
        });
    }
});


app.get(
    "/api/recovery-attempts/:transactionId",
    async (req, res) => {

        try {

            const attempts =
                await getRecoveryAttemptsByTransactionId(
                    req.params.transactionId
                );

            res.json(attempts);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: "Failed to fetch recovery attempts"
            });
        }
    }
);


app.get("/api/analytics/overview", async (req, res) => {

    try {

        const analytics =
            await buildAnalyticsOverview();

        res.json(analytics);

    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );

        res.status(500).json({
            error: "Failed to generate analytics"
        });
    }
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