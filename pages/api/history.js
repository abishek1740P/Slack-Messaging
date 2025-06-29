export default async function handler(req, res) {
  const { channel } = req.query;

  try {
    const response = await fetch(`https://slack.com/api/conversations.history?channel=${channel}`, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      },
    });

    const data = await response.json();
    if (!data.ok) return res.status(400).json(data);

    res.status(200).json({ ok: true, messages: data.messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch message history' });
  }
}
