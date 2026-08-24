const recoverySchema = {
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
};


async function generateOllamaResponse(prompt) {

    const response = await fetch(
        "http://127.0.0.1:11434/api/generate",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL,
                prompt,
                stream: false,
                format: recoverySchema,

                options: {
                    temperature: 0
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            `Ollama request failed: ${response.status}`
        );
    }

    const data = await response.json();

    return data.response;
}


module.exports = {
    generateOllamaResponse
};