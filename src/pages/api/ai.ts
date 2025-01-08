/* src/pages/api/ai.ts */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai'; // (1) <-- This is now UN-commented!

// (2) Create a Configuration object with your OpenAI API key
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// (3) Create an OpenAIApi instance
const openai = new OpenAIApi(config);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    // The client will send something like { journeyData: {...} }
    // We grab that from the request body:
    const { journeyData } = req.body;

    // (4) Call OpenAI's ChatGPT model (gpt-3.5-turbo) or text-davinci-003
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.', 
        },
        {
          role: 'user',
          content: `Analyze this user data: ${JSON.stringify(journeyData)}. Provide a short suggestion.`,
        },
      ],
    });

    // (5) Extract the AI response text
    const aiResponse = completion.data.choices[0].message?.content || 'No response from AI.';

    // Send it back to the frontend
    res.status(200).json({ message: aiResponse });
  } catch (error: any) {
    console.error('AI Route Error:', error);
    res.status(500).json({ error: 'Something went wrong calling OpenAI.' });
  }
}
