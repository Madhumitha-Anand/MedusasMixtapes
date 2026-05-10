// api/spotify-token.js
// Vercel serverless function — fetches Spotify token server-side.
// No CORS issues because this runs on Vercel's servers, not the browser.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const CLIENT_ID     = 'c646a92b35f34e2b96e1e68177fa5f0d';
  const CLIENT_SECRET = 'aa6f161fa31f48ad8f7602df54f0933e';
  const credentials   = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method:  'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json({
      access_token: data.access_token,
      expires_in:   data.expires_in
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
