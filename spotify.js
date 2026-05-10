// ============================================
// spotify.js — Spotify Web API Helper
// Handles getting access tokens + searching songs
// ============================================

// We cache the token so we don't fetch it on every search
let _spotifyToken = null;
let _tokenExpiry = 0;

/**
 * getSpotifyToken()
 * Uses the Client Credentials flow to get a Bearer token from Spotify.
 * This token lets us search the catalog without user login.
 * Tokens expire after 3600 seconds (1 hour), so we cache them.
 */
async function getSpotifyToken() {
  // If we already have a valid token, reuse it
  if (_spotifyToken && Date.now() < _tokenExpiry) {
    return _spotifyToken;
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = window.APP_CONFIG;

  // Encode credentials as base64 (required by Spotify)
  const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);

  // POST to Spotify's token endpoint
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify token. Check your Client ID and Secret in config.js');
  }

  const data = await response.json();

  // Cache the token and set expiry time (subtract 60s as buffer)
  _spotifyToken = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return _spotifyToken;
}

/**
 * searchSpotify(query)
 * Searches Spotify for tracks matching the query string.
 * Returns an array of simplified track objects.
 */
async function searchSpotify(query) {
  const token = await getSpotifyToken();

  // Build the search URL with encoded query
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Spotify search failed. Check your credentials.');
  }

  const data = await response.json();

  // Simplify the track objects to only what we need
  return data.tracks.items.map(track => ({
    id: track.id,
    name: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    album: track.album.name,
    // Use the small thumbnail (index 2 = 64x64)
    image: track.album.images[2]?.url || track.album.images[0]?.url || '',
    // Spotify's web player URL for the track
    url: track.external_urls.spotify,
    duration_ms: track.duration_ms
  }));
}

/**
 * formatDuration(ms)
 * Converts milliseconds to M:SS format (e.g. 213000 → "3:33")
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
