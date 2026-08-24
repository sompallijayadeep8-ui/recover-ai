/*async function generateAIResponse(prompt) {
    throw new Error("AI provider not configured");
}

module.exports = {
    generateAIResponse
};*/




const {
    generateOllamaResponse
} = require("./ollama.provider");


async function generateAIResponse(prompt) {

    const provider =
        process.env.AI_PROVIDER || "ollama";

    if (provider === "ollama") {

        return await generateOllamaResponse(prompt);
    }

    if (provider === "openai") {

        const OpenAI = require("openai");

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response =
            await client.responses.create({

                model:
                    process.env.OPENAI_MODEL ||
                    "gpt-5.6-luna",

                input: prompt,

                text: {
                    format: {
                        type: "json_schema",

                        name: "recovery_decision",

                        strict: true,

                        schema: {

                            type: "object",

                            additionalProperties: false,

                            properties: {

                                classification: {
                                    type: "string",
                                    enum: [
                                        "RECOVERABLE",
                                        "UNCERTAIN",
                                        "NOT_RECOVERABLE"
                                    ]
                                },

                                recoveryScore: {
                                    type: "number",
                                    minimum: 0,
                                    maximum: 100
                                },

                                recommendedAction: {
                                    type: "string",
                                    enum: [
                                        "RETRY",
                                        "SEND_REMINDER",
                                        "HUMAN_REVIEW"
                                    ]
                                },

                                confidence: {
                                    type: "number",
                                    minimum: 0,
                                    maximum: 1
                                },

                                reason: {
                                    type: "string"
                                }
                            },

                            required: [
                                "classification",
                                "recoveryScore",
                                "recommendedAction",
                                "confidence",
                                "reason"
                            ]
                        }
                    }
                }
            });

        return response.output_text;
    }

    throw new Error(
        `Unsupported AI provider: ${provider}`
    );
}


module.exports = {
    generateAIResponse
};




/*const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


async function generateAIResponse(prompt) {

    const response =
        await client.responses.create({

            model:
                process.env.OPENAI_MODEL || "gpt-5.6",

            input: prompt,

            text: {
                format: {
                    type: "json_schema",

                    name: "recovery_decision",

                    strict: true,

                    schema: {

                        type: "object",

                        additionalProperties: false,

                        properties: {

                            classification: {
                                type: "string",
                                enum: [
                                    "RECOVERABLE",
                                    "UNCERTAIN",
                                    "NOT_RECOVERABLE"
                                ]
                            },

                            recoveryScore: {
                                type: "number",
                                minimum: 0,
                                maximum: 100
                            },

                            recommendedAction: {
                                type: "string",
                                enum: [
                                    "RETRY",
                                    "SEND_REMINDER",
                                    "HUMAN_REVIEW"
                                ]
                            },

                            confidence: {
                                type: "number",
                                minimum: 0,
                                maximum: 1
                            },

                            reason: {
                                type: "string"
                            }

                        },

                        required: [
                            "classification",
                            "recoveryScore",
                            "recommendedAction",
                            "confidence",
                            "reason"
                        ]
                    }
                }
            }
        });

    return response.output_text;
}


module.exports = {
    generateAIResponse
};*/


