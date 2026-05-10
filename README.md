# 🐍 Medusa's Mixtapes

A funky, retro cassette-tape themed playlist app built with vanilla HTML/CSS/JS,
Spotify Web API for song search, and Firebase Firestore for saving playlists.

---

## 📁 Project Structure

```
medusas-mixtapes/
├── index.html        ← Landing page
├── library.html      ← Song search (Spotify API)
├── create.html       ← Name & save your playlist (Firebase)
├── mixtape.html      ← Shareable playlist view
├── style.css         ← All shared styles
├── config.js         ← 🔑 YOUR KEYS GO HERE
├── spotify.js        ← Spotify API helpers
├── firebase-db.js    ← Firestore helpers
├── vercel.json       ← Vercel deployment config
└── README.md
```

---

## ⚡ Setup Instructions

### Step 1 — Get a Spotify Client ID & Secret

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (free account works!)
3. Click **"Create App"**
4. Fill in:
   - App name: `Medusas Mixtapes` (or anything)
   - Redirect URI: `http://localhost` (just needs something — we don't use OAuth)
   - Check the "Web API" checkbox
5. Click **Save**
6. On your app page, click **"Settings"** → copy **Client ID** and **Client Secret**

### Step 2 — Set Up Firebase Firestore

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → give it a name → Continue through the steps
3. Once created, click the **`</>`** (Web) icon to add a web app
4. Register the app (any nickname) — Firebase will show you a `firebaseConfig` object
5. Copy the whole config object
6. In the Firebase console sidebar: **Build → Firestore Database**
7. Click **"Create database"** → choose **"Start in test mode"** (allows all reads/writes for 30 days — perfect for dev)
8. Pick a region and click **Enable**

### Step 3 — Fill In Your Keys

Open `config.js` and replace the placeholder values:

```js
const SPOTIFY_CLIENT_ID     = 'your_client_id_here';
const SPOTIFY_CLIENT_SECRET = 'your_client_secret_here';

const firebaseConfig = {
  apiKey:            "AIza...",
  authDomain:        "your-project.firebaseapp.com",
  projectId:         "your-project-id",
  storageBucket:     "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc..."
};
```

> ⚠️ **Security note:** For a personal/demo project, keeping credentials in a frontend JS file is fine.
> For a production app, move Spotify token generation to a serverless backend function to hide your Client Secret.

### Step 4 — Run Locally

Because we use `fetch()` and Firebase, you need a local web server (not just `file://`).

**Option A — VS Code Live Server** (easiest)
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click `index.html` → **Open with Live Server**

**Option B — Python**
```bash
cd medusas-mixtapes
python3 -m http.server 8000
# Open http://localhost:8000
```

**Option C — Node.js `serve`**
```bash
npx serve .
# Open the URL it prints
```

### Step 5 — Deploy to Vercel (Free)

1. Push your project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo
3. Vercel auto-detects it as a static site — click **Deploy**
4. Your site is live at `https://your-project.vercel.app`!

---

## 🎮 How to Use the App

1. **🏠 Landing Page (`index.html`)** — The welcome screen with a floating cassette. Click "Search Songs" or "Build My Tape".

2. **🔍 Search Page (`library.html`)** — Type an artist or song name and hit Search. Results come from Spotify. Click **+ Add** on any song to add it to your basket (saved in `localStorage`).

3. **✨ Create Page (`create.html`)** — See all your basket songs. Give your mixtape a name and click **Save & Get Link**. The playlist is saved to Firebase Firestore and you get a unique shareable URL.

4. **👁️ Mixtape Page (`mixtape.html?id=XYZ`)** — The shareable page. Anyone with the link can view the playlist. Each track links to Spotify.

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| Search returns nothing / error | Double-check `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `config.js` |
| "Failed to save" on create page | Check Firebase credentials + make sure Firestore is in **test mode** |
| CORS error on Spotify token | You must run on a local server, not `file://` |
| Mixtape page shows "not found" | Make sure the `?id=` in the URL matches a real Firestore document |
| Blank page on deploy | Check browser console for errors; make sure all files are committed |

---

## 🎨 Customization Ideas

- **Change colors**: Edit the CSS variables in `style.css` (`:root` block)
- **Change the font**: Swap the Google Fonts URL in `style.css`
- **Add more songs per search**: Change `limit=10` in `spotify.js` → up to `limit=50`
- **Add drag-to-reorder**: Use the HTML5 Drag and Drop API on `#song-list-preview`
- **Add user auth**: Integrate Firebase Auth so users have their own profiles

---

## 📄 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Song Search | [Spotify Web API](https://developer.spotify.com/documentation/web-api) |
| Database | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| Hosting | [Vercel](https://vercel.com) |
| Fonts | [Google Fonts](https://fonts.google.com) (Bangers, Permanent Marker, Nunito) |

---

Made with 🐍 and 🎵 by Medusa's Mixtapes
