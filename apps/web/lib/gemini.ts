import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeFoodImage(base64Image: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Remove data:image/jpeg;base64, prefix
    const base64Data = base64Image.split(',')[1] || base64Image;

    const prompt = `
      Analyze this food image and provide nutritional information in JSON format.
      The output MUST be a valid JSON object with the following fields:
      {
        "name": "English name of the food (with Korean translation in parentheses)",
        "calories": number,
        "carbs": number (in grams),
        "protein": number (in grams),
        "fat": number (in grams),
        "confidence": number (0-100 score of how accurate you think this is)
      }
      Only return the JSON. No other text.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the text response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Failed to parse AI response as JSON");
  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);
    throw error;
  }
}
