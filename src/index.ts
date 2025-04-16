import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import playlistRoutes from './routes/playlist.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Register the route
app.use('/api/auth', authRoutes); 
// ✅ Register the playlist route
app.use('/api/playlists', playlistRoutes);
// ✅ Register the user route
app.use('/api/users', userRoutes);

app.get('/', (_req, res) => {
  res.send('Hello from Playlist API 🎧');
});

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
