export default async function handler(req, res) {
  const { ts, text, channel } = req.body;

  try {
    const response = await fetch('https://slack.com/api/chat.update', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ts, text, channel }),
    });

    const data = await response.json();
    if (!data.ok) return res.status(400).json(data);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit message' });
  }
}
