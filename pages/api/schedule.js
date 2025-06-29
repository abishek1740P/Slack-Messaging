export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, postAt, channel } = req.body;

  // Validate input
  if (!text || !postAt || !channel) {
    return res.status(400).json({ error: 'Missing required fields: text, postAt, or channel' });
  }

  try {
    // Convert postAt to integer (UNIX timestamp in seconds)
    const parsedPostAt = parseInt(postAt, 10);

    const slackResponse = await fetch('https://slack.com/api/chat.scheduleMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        text,
        post_at: parsedPostAt,
      }),
    });

    const data = await slackResponse.json();

    if (!data.ok) {
      console.error('Slack API error:', data);
      return res.status(400).json({ error: data.error || 'Unknown error from Slack API' });
    }

    return res.status(200).json({
      ok: true,
      message: 'Message scheduled successfully',
      scheduled_message_id: data.scheduled_message_id,
      post_at: data.post_at,
      channel: data.channel,
    });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ error: 'Failed to schedule message due to internal error' });
  }
}
