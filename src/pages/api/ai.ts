// src/pages/api/ai.ts

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

    // 1. Use the final prompt sent from the front end (journeyData.message).
    //    If it's not present, fallback to a generic "modify your goal" text.
    const userMessage = journeyData.message
      ? journeyData.message
      : `Current goal: "${journeyData.goal}"
         Scale: ${journeyData.scale || 'N/A'}%
         Position: ${journeyData.currentPos || 'N/A'}
         Please suggest a modified version of this goal that feels more achievable.`;

    // 2. Strengthen the system instruction to mention all alignment categories.
    //    This ensures the AI can handle queries from multiple sections of the app.
    const systemContent = `You are an AI assistant helping users adjust their goals based on their journey progress.
      Provide supportive, actionable (if needed) customized suggestions for goal adjustments.
      The user may be focusing on a particular alignment category, such as: 
        - Safety (feeling open and secure)
        - Confidence (strong belief in abilities)
        - Anticipation (consistent expectation of receiving desired outcomes)
        - Openness (staying focused and allowing time for results)
        - Deserving (feeling worthy of the goal)
        - Belief (knowing it is possible)
        - Appreciation (gratitude and recognition of current progress)
      If the user indicates they are working on 'appreciation', prioritize gratitude and positive reflection rather than just step-by-step instructions.
      However, remain flexible and provide what the user needs, whether it's mindset shifts, action steps, or clarifications.`;

    // 3. Call the OpenAI Chat Completion API with the system and user messages.
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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

    // Return the AI's response
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
