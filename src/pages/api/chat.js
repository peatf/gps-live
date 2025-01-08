export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // Adjust based on your model
        messages: [
          { role: "system", content: "You are a somatic awareness assistant." },
          { role: "user", content: message },
        ],
        assistant_id: process.env.OPENAI_ASSISTANT_ID,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      return res.status(response.status).json({ error: data.error });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
