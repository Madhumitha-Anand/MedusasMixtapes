// ============================================
// spotify.js — Spotify Web API Helper
// Token is fetched via /api/spotify-token (Vercel serverless function)
// This avoids CORS issues when running on a deployed domain.
// ============================================

let _spotifyToken = null;
let _tokenExpiry  = 0;

/**
 * getSpotifyToken()
 * Calls our own /api/spotify-token serverless function,
 * which fetches the token server-side (no CORS block).
 * Caches the token until it expires.
 */
async function getSpotifyToken() {
  if (_spotifyToken && Date.now() < _tokenExpiry) {
    return _spotifyToken;
  }

  const response = await fetch('/api/spotify-token');

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Token fetch failed: ${err.error || response.status}`);
  }

  const data = await response.json();

  _spotifyToken = data.access_token;
  // Expire 60s early as a buffer
  _tokenExpiry  = Date.now() + (data.expires_in - 60) * 1000;

  return _spotifyToken;
}

/**
 * searchSpotify(query)
 * Searches Spotify for tracks matching the query.
 * Returns simplified track objects.
 */
async function searchSpotify(query) {
  const token = await getSpotifyToken();

  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`;

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Spotify search failed. Check your credentials.');
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
