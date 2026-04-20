// server/server.js

// Core requires
const path = require('path');
const express = require('express');
const cors = require('cors'); // Render/Vercel crossorigin
require('dotenv').config({
  path: path.join(__dirname, '.env.local'),
  override: true,
});

// App initialization
const app = express();

// Constants / config
const JAMENDO_API = 'https://api.jamendo.com/v3.0';

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://fullstack-music-player-seven.vercel.app',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Root route (simple health check)
app.get('/', (req, res) => {
  res.send('Music Player backend is running');
});

// API route must be first
app.get('/api/album', async (req, res) => {
  try {
    const albumId = req.query.album_id;
    if (!albumId) {
      return res.status(400).json({ error: 'Missing album_id' });
    }

    const albumUrl =
      `${JAMENDO_API}/albums/?format=json&` +
      `client_id=${process.env.JAMENDO_CLIENT_ID}&id=${albumId}`;
    // id == album art, may be inconsistent

    const tracksUrl =
      `${JAMENDO_API}/tracks/?format=json&` +
      `client_id=${process.env.JAMENDO_CLIENT_ID}&album_id=${albumId}&order=id_desc`;
    // id_asc or id_desc, playlist sort order

    const [albumRes, tracksRes] = await Promise.all([
      fetch(albumUrl),
      fetch(tracksUrl),
    ]);

    if (!albumRes.ok || !tracksRes.ok) {
      throw new Error(`Jamendo error ${albumRes.status} / ${tracksRes.status}`);
    }

    const albumData = await albumRes.json();
    const tracksData = await tracksRes.json();

    const album = albumData.results?.[0] || {};
    const rawTracks = tracksData.results || [];

    // Shape MusicControl.jsx wants
    const tracks = rawTracks.map((track) => ({
      name: track.name,
      artist_name: track.artist_name,
      album_name: album.name || 'Unknown Album',
      image: album.image || 'https://placehold.co/300x300?text=No+Cover',
      duration: track.duration,
      audio: track.audio, // direct streaming link
    }));

    res.set('Cache-Control', 'no-store');
    res.json({ tracks });
  } catch (err) {
    console.error('Jamendo proxy error:', err);
    res.status(500).json({ error: 'Failed to fetch from Jamendo' });
  }
});

// Removed static serving for Render

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
