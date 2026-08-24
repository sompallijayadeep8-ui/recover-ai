/*function buildRecoveryPrompt({
    transaction,
    customerContext,
    scoring
}) {

    return `
You are a payment recovery decision assistant.

Your job is to evaluate whether a failed payment
may be suitable for recovery.

IMPORTANT RULES:

1. You are advisory only.
2. You cannot authorize or execute payments.
3. You must use only the information provided.
4. Do not invent customer information.
5. Return ONLY valid JSON.
6. recommendedAction must be one of:
   RETRY
   SEND_REMINDER
   HUMAN_REVIEW
7. recoveryScore must be between 0 and 100.
8. confidence must be between 0 and 1.

TRANSACTION:

${JSON.stringify(transaction, null, 2)}

CUSTOMER CONTEXT:

${JSON.stringify(customerContext, null, 2)}

BASELINE SCORING:

${JSON.stringify(scoring, null, 2)}

Return exactly this structure:

{
    "classification": "RECOVERABLE | UNCERTAIN | NOT_RECOVERABLE",
    "recoveryScore": 0,
    "recommendedAction": "RETRY | SEND_REMINDER | HUMAN_REVIEW",
    "confidence": 0,
    "reason": "short explanation"
}
`;
}

module.exports = {
    buildRecoveryPrompt
};*/


function buildRecoveryPrompt({
    transaction,
    customerContext,
    scoring
}) {
    return `
You are RecoverAI, a payment recovery decision assistant.

Your task is to analyze ONE failed payment.

You are advisory only.
You cannot authorize, execute, or modify payments.

Use ONLY the supplied transaction, customer context,
and baseline scoring information.

You MUST return a decision containing ALL of these fields:

classification:
- RECOVERABLE
- UNCERTAIN
- NOT_RECOVERABLE

recoveryScore:
- number from 0 to 100

recommendedAction:
- RETRY
- SEND_REMINDER
- HUMAN_REVIEW

confidence:
- number from 0 to 1

reason:
- short explanation of the decision

Do not return an empty object.
Do not omit any field.
Do not invent information.

TRANSACTION:
${JSON.stringify(transaction, null, 2)}

CUSTOMER CONTEXT:
${JSON.stringify(customerContext, null, 2)}

BASELINE SCORING:
${JSON.stringify(scoring, null, 2)}
`;
}

module.exports = {
    buildRecoveryPrompt
};