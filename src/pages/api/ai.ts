import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  // Optional: organization: 'org-id'
});

// /api/ai.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { journeyData } = req.body;
    if (!journeyData) {
      return res.status(400).json({ error: 'Missing journeyData in request body.' });
    }

    // 1. Pull the final user prompt from `journeyData.message` (constructed in your front end).
    //    If none is provided, fall back to the original text.
    const userMessage = journeyData.message
      ? journeyData.message
      : `Current goal: "${journeyData.goal}"
         Scale: ${journeyData.scale || 'N/A'}%
         Position: ${journeyData.currentPos || 'N/A'}
         Please suggest a modified version of this goal that feels more achievable.`;

    // 2. Optional: Strengthen the system instruction to mention alignment categories:
    const systemContent = `You are an AI assistant helping users adjust their goals 
      based on their journey progress and alignment category. 
      If the category is 'appreciation', focus on gratitude and positive reflection 
      rather than just providing step-by-step instructions.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemContent
        },
        {
          role: 'user',
          content: userMessage
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
