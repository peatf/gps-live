import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  try {
    // Prepare the OpenAI config with your environment variables
    // Make sure OPENAI_API_KEY is set in your Vercel project settings (or .env.local)
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // Get data from the request body (e.g., user input or state)
    const { userData } = req.body;

    // If you want to incorporate an assistant ID, you can do so:
    // For example, use process.env.OPENAI_ASSISTANT_ID in your prompt or messages
    // Otherwise, remove references to the assistant ID if you don’t use it.
    const prompt = process.env.OPENAI_ASSISTANT_ID
      ? `Use assistant ID ${process.env.OPENAI_ASSISTANT_ID} to generate text:\n${JSON.stringify(userData)}`
      : `Generate text based on user data:\n${JSON.stringify(userData)}`;

    // Call the OpenAI text generation model
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    // Extract the generated text
    const generatedText = response.data?.choices?.[0]?.text?.trim() || "";

    // Return the AI's response as JSON
    res.status(200).json({ result: generatedText });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    res.status(500).json({ error: error.message || "An error occurred" });
  }
}
