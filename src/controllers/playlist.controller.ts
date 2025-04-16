import { Request, Response } from 'express';
import Playlist from '../models/Playlist';

export const createPlaylist = async (req: Request, res: Response): Promise<any> => {
    const { title, url, platform } = req.body;
    const userId = req.userId; // from auth middleware

    if (!title || !url || !platform)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        const playlist = await Playlist.create({
            title,
            url,
            platform,
            owner: userId
        });

        res.status(201).json(playlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserPlaylists = async (req: Request, res: Response): Promise<any> => {
    try {
        const playlists = await Playlist.find({
            $or: [
                { owner: req.userId },
                { sharedWith: req.userId }
            ]
        }).populate('owner', 'name email');

        res.json(playlists);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching playlists' });
    }
};

export const sharePlaylist = async (req: Request, res: Response): Promise<any> => {
    const { friendId } = req.body;
    const playlistId = req.params.id;

    if (!friendId) {
        return res.status(400).json({ message: 'Friend ID is required' });
    }

    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        if (playlist.owner.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to share this playlist' });
        }

        if (playlist.sharedWith.includes(friendId)) {
            return res.status(409).json({ message: 'Already shared with this friend' });
        }

        playlist.sharedWith.push(friendId);
        await playlist.save();

        res.json({ message: 'Playlist shared successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sharing playlist' });
    }
};

export const castPlaylist = async (req: Request, res: Response): Promise<any> => {
    const { targetPlatform } = req.body;
    const playlistId = req.params.id;
  
    if (!['spotify', 'youtube'].includes(targetPlatform)) {
      return res.status(400).json({ message: 'Invalid target platform' });
    }
  
    try {
      const original = await Playlist.findById(playlistId);
      if (!original) return res.status(404).json({ message: 'Original playlist not found' });
  
      // Optional: restrict who can cast
      if (original.owner.toString() !== req.userId) {
        return res.status(403).json({ message: 'Not authorized to cast this playlist' });
      }
  
      const newUrl = '#'; // placeholder, or allow user to input if needed
  
      const cloned = await Playlist.create({
        title: `${original.title} (Cast to ${targetPlatform})`,
        url: newUrl,
        platform: targetPlatform,
        owner: req.userId,
        sharedWith: []
      });
  
      res.status(201).json(cloned);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error casting playlist' });
    }
  };
  