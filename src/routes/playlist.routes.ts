import { Router } from 'express';
import { createPlaylist, getUserPlaylists } from '../controllers/playlist.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { sharePlaylist } from '../controllers/playlist.controller';
import { castPlaylist } from '../controllers/playlist.controller';


const router = Router();

router.post('/', requireAuth, createPlaylist);
router.get('/', requireAuth, getUserPlaylists);
router.patch('/:id/share', requireAuth, sharePlaylist);
router.post('/:id/cast', requireAuth, castPlaylist);

export default router;
