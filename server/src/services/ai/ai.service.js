/*const {                    // manual al response test 
    validateAIResponse
} = require("./response.validator");

async function generateRecoveryDecision(context) {

    // Temporary mock.
    // Real LLM integration comes next.

    const response = {
        classification:
            context.scoring.score >= 70
                ? "RECOVERABLE"
                : context.scoring.score >= 40
                    ? "UNCERTAIN"
                    : "NOT_RECOVERABLE",

        recoveryScore: context.scoring.score,
         // recoveryscore : 999,

        recommendedAction:
            context.scoring.score >= 70
                ? "RETRY"
                : "HUMAN_REVIEW",

        confidence:
            context.scoring.score / 100,

        reason:
            "Temporary AI decision generated from baseline context"
    };

    const validation =
        validateAIResponse(response);

    if (!validation.valid) {
        throw new Error(
            `Invalid AI response: ${validation.reason}`
        );
    }


   

    return response;
}

module.exports = {
    generateRecoveryDecision
};*/
                // LLM

 const {
    generateAIResponse
} = require("./provider");

const {
    buildRecoveryPrompt
} = require("./prompt.service");

const {
    validateAIResponse
} = require("./response.validator");


async function generateRecoveryDecision(context) {

    const prompt =
        buildRecoveryPrompt(context);

    const rawResponse =
        await generateAIResponse(prompt);


       console.log("RAW AI RESPONSE:");
       console.log(rawResponse);
    let parsedResponse;

    try {

        parsedResponse =
            JSON.parse(rawResponse);

    } catch (error) {

        throw new Error(
            "AI returned invalid JSON"
        );
    }

    const validation =
        validateAIResponse(parsedResponse);

    if (!validation.valid) {

        throw new Error(
            `Invalid AI response: ${validation.reason}`
        );
    }

    return parsedResponse;
}


module.exports = {
    generateRecoveryDecision
};