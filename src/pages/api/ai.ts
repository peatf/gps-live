/* src/pages/api/ai.ts */
import type { NextApiRequest, NextApiResponse } from 'next';
// If you want to use the official OpenAI library, uncomment below:
// import { Configuration, OpenAIApi } from 'openai';

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY || '',
// });
// const openai = new OpenAIApi(config);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enforce POST so we only accept data from a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    // We'll receive "journeyData" from the client side
    const { journeyData } = req.body;

    // If you want to call OpenAI, uncomment and adapt:
    //
    // const completion = await openai.createCompletion({
    //   model: 'text-davinci-003',
    //   prompt: `User data: ${JSON.stringify(journeyData)}`,
    //   max_tokens: 100,
    // });
    // const aiResponse = completion.data.choices[0].text;

    // For now, just echo the data back:
    const aiResponse = `Echoing your journeyData: ${JSON.stringify(journeyData)}`;

    // Return the AI response to the client
    res.status(200).json({ message: aiResponse });
  } catch (error: any) {
    console.error('AI Route Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

