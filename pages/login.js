export default function Login() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI);
    const scope = 'chat:write chat:write.customize chat:delete channels:history';

    const slackOAuthURL = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
    window.location.href = slackOAuthURL;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Sign in with Slack
      </button>
    </div>
  );
}
