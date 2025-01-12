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

    // Set headers for file download
    const fileName = `journey-data-${Date.now()}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Send the file content
    res.status(200).send(formattedData);
  } catch (error) {
    console.error('Error generating downloadable data:', error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}
