import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisResult {
    explanation: string;
    predictedOutput: string;
    bugsAndErrors: string;
    correctedCode: string;
}

export const analyzeCode = async (code: string, language: string): Promise<AnalysisResult> => {
    const model = 'gemini-2.5-flash';
    const prompt = `
You are an expert code analyst and execution engine. Your task is to provide a clear, concise, and structured analysis for the following ${language} code snippet.

**Code Snippet:**
\`\`\`${language}
${code}
\`\`\`

**Your Tasks:**
1.  **Analyze the code:** Provide a structured explanation using Markdown. The explanation should include:
    *   **High-Level Summary:** A brief description of the code's purpose.
    *   **Step-by-Step Breakdown:** An explanation of the code in logical blocks.
    *   **Potential Improvements:** Suggestions for optimization or best practices. If none, state that.
2.  **Predict the output:** Emulate the code execution and provide the standard output (stdout).
    *   If the code produces no output, state that clearly.
    *   If the code would result in an error, describe the error as the output.
    *   If the code is incomplete (e.g., just a function definition without a call), state that no output is produced.
3.  **Identify Bugs and Errors:** Thoroughly check for syntax errors, runtime errors, and logical bugs. Describe them clearly in Markdown, referencing line numbers and code snippets where possible. If no bugs are found, state "No bugs or errors were found.".
4.  **Provide Corrected Code:** If you identified any errors, provide the complete, corrected code snippet. Return only the raw code, do not wrap it in a markdown block. If no corrections are needed, return the original code snippet.

Return your response as a single JSON object matching the provided schema. Do not include any text outside of the JSON object.
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        explanation: {
                            type: Type.STRING,
                            description: "A detailed explanation of the code in Markdown format, covering summary, breakdown, and improvements.",
                        },
                        predictedOutput: {
                            type: Type.STRING,
                            description: "The predicted standard output (stdout) of the code. If the code has no output, this should be an empty string. If it has an error, this should describe the error.",
                        },
                        bugsAndErrors: {
                            type: Type.STRING,
                            description: "A Markdown explanation of any bugs or errors found in the code. If none, it should state that.",
                        },
                        correctedCode: {
                            type: Type.STRING,
                            description: "The raw corrected code snippet, without any markdown formatting. If no corrections, return original code.",
                        }
                    },
                    required: ["explanation", "predictedOutput", "bugsAndErrors", "correctedCode"],
                },
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (
            typeof result.explanation === 'string' && 
            typeof result.predictedOutput === 'string' &&
            typeof result.bugsAndErrors === 'string' &&
            typeof result.correctedCode === 'string'
        ) {
            return result;
        } else {
            console.error("AI response did not match the expected format:", result);
            throw new Error("AI response did not match the expected format.");
        }

    } catch (error) {
        console.error("Error analyzing code with Gemini API:", error);
        if (error instanceof SyntaxError) {
            throw new Error("Failed to parse the AI's response. The format was invalid.");
        }
        throw new Error("Failed to get analysis from the AI model.");
    }
};
