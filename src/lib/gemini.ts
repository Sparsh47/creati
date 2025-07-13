import {GoogleGenerativeAI} from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const generateResponse = async (prompt: string) => {
    try {

        const model = genAi.getGenerativeModel({model: "gemini-2.5-flash"});

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text;
        const rawText = text();

        const jsonMatch = rawText.match(/```(?:json)(?:javascript)?\s*([\s\S]*?)\s*```/i);

        if (jsonMatch && jsonMatch[1]) {
            try {
                const parsedJson = JSON.parse(jsonMatch[1]);
                console.log(parsedJson);
                return parsedJson;
            } catch (e) {
                console.error("Failed to parse JSON:", e);
                throw new Error("Invalid JSON format in response.");
            }
        } else {
            console.warn("No JSON block found. Raw text:", rawText);
            throw new Error("No JSON found in the response.");
        }

    } catch (e: any) {
        throw new Error(`${e}`);
    }
}