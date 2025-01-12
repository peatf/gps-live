import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { journeyData } = req.body;
    if (!journeyData) {
      return res.status(400).json({ error: 'Missing journeyData in request body' });
    }

    // Organize data as JSON or any desired format
    const formattedData = JSON.stringify(journeyData, null, 2);

    // Prepare downloadable content
    const fileName = `journey-data-${Date.now()}.json`;
    const filePath = path.join(process.cwd(), 'public', fileName);
    fs.writeFileSync(filePath, formattedData);

    return res.status(200).json({ fileName });
  } catch (error) {
    console.error('Error generating downloadable data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
