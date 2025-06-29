export default async function handler(req, res) {
  const { ts, channel } = req.body;

  try {
    const response = await fetch('https://slack.com/api/chat.delete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ts, channel }),
    });

    const data = await response.json();
    if (!data.ok) return res.status(400).json(data);

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
}
