const pool = require("../config/database");


async function createAuditLog({
    transaction,
    baseline,
    aiDecision,
    comparison,
    policy
}) {

    const query = `
        INSERT INTO audit_logs (

            transaction_id,
            baseline_classification,
            baseline_score,
            baseline_action,
            baseline_confidence,

            ai_classification,
            ai_score,
            ai_action,
            ai_confidence,

            classification_agreement,
            action_agreement,
            score_difference,
            severity,

            policy_decision,
            policy_action,
            policy_reason

        )

        VALUES (

            $1,
            $2,
            $3,
            $4,
            $5,

            $6,
            $7,
            $8,
            $9,

            $10,
            $11,
            $12,
            $13,

            $14,
            $15,
            $16

        )

        RETURNING id, transaction_id, created_at;
    `;


    const values = [

        transaction.id,

        baseline.classification,
        baseline.recoveryScore,
        baseline.recommendedAction,
        baseline.confidence,

        aiDecision.classification,
        aiDecision.recoveryScore,
        aiDecision.recommendedAction,
        aiDecision.confidence,

        comparison.classificationAgreement,
        comparison.actionAgreement,
        comparison.scoreDifference,
        comparison.severity,

        policy.decision,
        policy.action,
        policy.reason
    ];

   // console.log("INSERTING AUDIT INTO POSTGRESQL...");


    const result =
        await pool.query(
            query,
            values
        );

     //   console.log(
    //"POSTGRES INSERT RESULT:",
   // result.rows
//);


    const row = result.rows[0];


    return {
        id: `AUDIT_${row.id}`,   // public label e.g. "AUDIT_11"
        dbId: row.id,            // raw BIGINT numeric id for FK use

        timestamp: row.created_at,

        transactionId: row.transaction_id
    };
}


async function getAuditLogs() {

    const result = await pool.query(`
        SELECT *
        FROM audit_logs
        ORDER BY created_at DESC
    `);

    return result.rows;
}


async function getAuditLogByTransactionId(
    transactionId
) {

    const result = await pool.query(
        `
        SELECT *
        FROM audit_logs
        WHERE transaction_id = $1
        ORDER BY created_at DESC
        `,
        [transactionId]
    );

    return result.rows;
}


async function getAuditLogsBySeverity(
    severity
) {


    const result = await pool.query(
        `
        SELECT *
        FROM audit_logs
        WHERE severity = $1
        ORDER BY created_at DESC
        `,
        [severity]
    );

    return result.rows;
}


module.exports = {
    createAuditLog,
    getAuditLogs,
    getAuditLogByTransactionId,
    getAuditLogsBySeverity
};