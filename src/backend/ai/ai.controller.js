import { getAiResponse } from "./ai.service.js";

export async function handleAiRequest(req, res) {
  const { prompt } = req.body;

  try {
    const aiResponse = await getAiResponse(prompt);
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("AI API error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to get AI response" });
  }
}
