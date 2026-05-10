// ============================================
// firebase-db.js — Firestore Database Helper
// ============================================

let _db = null;

function initFirebase() {
  if (_db) return _db;
  const { firebaseConfig } = window.APP_CONFIG;
  firebase.initializeApp(firebaseConfig);
  _db = firebase.firestore();
  return _db;
}

// Save a playlist (with optional note) to Firestore
// Returns the auto-generated document ID
async function savePlaylist(name, songs, note) {
  const db = initFirebase();
  const docRef = await db.collection('playlists').add({
    name: name,
    songs: songs,
    note: note || '',          // personal note from the curator
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    songCount: songs.length
  });
  return docRef.id;
}

// Fetch a playlist by its Firestore document ID
async function getPlaylist(id) {
  const db = initFirebase();
  const doc = await db.collection('playlists').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}
