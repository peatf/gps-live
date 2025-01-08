import { Configuration, OpenAIApi } from "openai";

// This is your serverless function that calls OpenAI
export default async function handler(req, res) {
  try {
    // Prepare the OpenAI config from your Vercel env vars
    // Ensure that OPENAI_API_KEY and OPENAI_ASSISTANT_ID are set in Vercel
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // Get data from the request body (e.g., user input)
    const { userData } = req.body;

    // Build your prompt using the assistant ID if that’s part of your specialization
    // or just reference it as needed for advanced customization
    const prompt = `Use assistant ID ${process.env.OPENAI_ASSISTANT_ID} to generate text: ${userData}`;

    // Call the OpenAI text generation model
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    // Extract the generated text
    const generatedText = response.data.choices[0].text.trim();

    // Return data as JSON
    res.status(200).json({ result: generatedText });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: error.message || "An error occurred" });
  }
}
