// ============================================
// config.js — Firebase + Spotify Configuration
// ============================================

const SPOTIFY_CLIENT_ID = 'c646a92b35f34e2b96e1e68177fa5f0d';
const SPOTIFY_CLIENT_SECRET = 'aa6f161fa31f48ad8f7602df54f0933e';

const firebaseConfig = {
  apiKey: "AIzaSyAr_WwVTUgYWd1w3xieRyG6MkJHyXGWs38",
  authDomain: "medusa-s-mixtapes.firebaseapp.com",
  projectId: "medusa-s-mixtapes",
  storageBucket: "medusa-s-mixtapes.firebasestorage.app",
  messagingSenderId: "359898276860",
  appId: "1:359898276860:web:5209249a433fb56addc879",
  measurementId: "G-GGECCK46F7"
};

window.APP_CONFIG = {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  firebaseConfig
};
