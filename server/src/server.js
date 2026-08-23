const express = require("express");
const cors = require("cors");

const transactions = require("./data/transactions");


const {
    analyzeTransaction
} = require("./services/recovery.service");

const {
    validateRecovery
} = require("./services/policy.service");

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


app.post("/api/recovery/:id/analyze", (req, res) => {

    const transaction = transactions.find(
        (txn) => txn.id === req.params.id
    );

    if (!transaction) {
        return res.status(404).json({
            error: "Transaction not found"
        });
    }

    const decision = analyzeTransaction(transaction);

    const policy = validateRecovery(
        transaction,
        decision
    );

    res.json({
        transaction,
        decision,
        policy
    });
});
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`RecoverAI server running on port ${PORT}`);
});