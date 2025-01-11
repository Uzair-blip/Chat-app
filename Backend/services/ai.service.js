import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",
    systemInstruction:  `you are expert in MERn stack you have 10 year experience in development
                        you always write code in modular way and break the code in possible ways  and follow best practices
                        you use understanding comments in code you never misses the edge cases
                        `
});

export const generateResult = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate content");
    }
};

