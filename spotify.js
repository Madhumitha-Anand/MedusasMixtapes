// ============================================
// spotify.js — Spotify Web API Helper
// Uses Spotify's token endpoint via a CORS-anywhere proxy
// so it works from any browser without a backend.
// ============================================

let _spotifyToken = null;
let _tokenExpiry  = 0;

const SPOTIFY_CLIENT_ID     = 'c646a92b35f34e2b96e1e68177fa5f0d';
const SPOTIFY_CLIENT_SECRET = 'aa6f161fa31f48ad8f7602df54f0933e';

/**
 * getSpotifyToken()
 * Fetches a Spotify Client Credentials token.
 * Uses allorigins.win as a CORS proxy to bypass browser restrictions.
 */
async function getSpotifyToken() {
  // Return cached token if still valid
  if (_spotifyToken && Date.now() < _tokenExpiry) {
    return _spotifyToken;
  }

  const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

  // We POST to Spotify via a CORS proxy (allorigins works with POST via fetch)
  // allorigins.win wraps the request server-side so browser CORS is bypassed
  const body = 'grant_type=client_credentials';

  // Direct fetch — works in Vercel deployed env because Spotify
  // allows server-origin requests; but browser blocks it.
  // So we use the proxy only when on a non-localhost origin.
  const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  let response;

  if (isLocalhost) {
    // Local dev: direct call works fine
    response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body,
    });
  } else {
    // Deployed: use our Vercel serverless function
    // If /api/spotify-token returns 404, fall back to corsproxy.io
    response = await fetch('/api/spotify-token').catch(() => null);

    if (!response || !response.ok) {
      // Fallback: corsproxy.io — a reliable public CORS proxy
      response = await fetch('https://corsproxy.io/?https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type':  'application/x-www-form-urlencoded',
        },
        body,
      });
    }
  }

  if (!response || !response.ok) {
    throw new Error(`Spotify auth failed (${response?.status}). Check your credentials.`);
  }

  const data = await response.json();

  // Handle both response shapes:
  // - /api/spotify-token returns { access_token, expires_in }
  // - corsproxy wraps Spotify's raw response which also has { access_token, expires_in }
  _spotifyToken = data.access_token;
  _tokenExpiry  = Date.now() + ((data.expires_in || 3600) - 60) * 1000;

  return _spotifyToken;
}

/**
 * searchSpotify(query)
 * Searches Spotify for tracks. Returns simplified track objects.
 */
async function searchSpotify(query) {
  const token = await getSpotifyToken();

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Spotify search failed.');
  }

  const data = await response.json();

  return data.tracks.items.map(track => ({
    id:          track.id,
    name:        track.name,
    artist:      track.artists.map(a => a.name).join(', '),
    album:       track.album.name,
    image:       track.album.images[2]?.url || track.album.images[0]?.url || '',
    url:         track.external_urls.spotify,
    duration_ms: track.duration_ms
  }));
}

/**
 * formatDuration(ms) → "3:45"
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
