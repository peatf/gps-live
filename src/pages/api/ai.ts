// src/pages/api/ai.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  // Optional: organization: 'org-id'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enforce POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { journeyData } = req.body || {};
    if (!journeyData) {
      return res.status(400).json({ error: 'Missing journeyData in request body.' });
    }

    // Call the Chat Completion endpoint
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides suggestions and guidance based on user data.',
        },
        {
          role: 'user',
          content: `Analyze this user data: ${JSON.stringify(journeyData)}. Provide a short suggestion.`,
        },
      ],
      max_tokens: 100,
    });

    const aiResponse = response.choices?.[0]?.message?.content || 'No response from AI.';

    return res.status(200).json({ message: aiResponse });
  } catch (error: any) {
    console.error('Error calling OpenAI:', error);
    return res.status(500).json({ error: 'Failed to process AI request.' });
  }
}
