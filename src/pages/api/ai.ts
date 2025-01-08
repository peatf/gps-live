// src/pages/api/ai.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  // Optional: organization: 'org-id'
});

// /api/ai.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { journeyData } = req.body;
    if (!journeyData) {
      return res.status(400).json({ error: 'Missing journeyData in request body.' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant helping users adjust their goals based on their journey progress.
                   Provide specific, actionable suggestions for goal adjustments.`
        },
        {
          role: 'user',
          content: `Current goal: "${journeyData.goal}"
                   Scale: ${journeyData.scale}%
                   Position: ${journeyData.currentPos}
                   Please suggest a modified version of this goal that feels more achievable.`
        }
      ],
      max_tokens: 200
    });

    return res.status(200).json({ 
      message: response.choices[0].message.content,
      success: true
    });
  } catch (error: any) {
    console.error('Error calling OpenAI:', error);
    return res.status(500).json({ 
      error: 'Failed to process AI request.',
      details: error.message 
    });
  }
}
