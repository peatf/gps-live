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

    // Determine if this is a Proximity Mapping request
    if (journeyData.type === 'ProximityMapping') {
      const scale = journeyData.scale || 100; // Slider value
      const goal = journeyData.goal || 'your goal';
      const reductionPercentage = 100 - scale;

      const proximityPrompt = `
        Based on the current scope adjustment (${scale}%), suggest a single scaled-down version of the user's goal:
        - Original goal: "${goal}"
        - Scope adjustment: ${reductionPercentage}% reduction in size, complexity, or timeline.

        Provide a clear, actionable suggestion for how the goal can be reduced while maintaining its essence. 
        The suggestion may be practical, symbolic, or abstract, depending on the goal's nature. Avoid reflective questions or multiple options.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an assistant for goal refinement, focused on practical and symbolic suggestions.' },
          { role: 'user', content: proximityPrompt }
        ],
        max_tokens: 200
      });

      return res.status(200).json({
        message: response.choices[0].message.content,
        success: true
      });
    }

    // Default logic for other types of requests
    const userMessage = journeyData.message
      ? journeyData.message
      : `Current goal: "${journeyData.goal}"
         Scale: ${journeyData.scale || 'N/A'}%
         Position: ${journeyData.currentPos || 'N/A'}
         Please suggest a modified version of this goal that feels more achievable.`;

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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userMessage }
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
