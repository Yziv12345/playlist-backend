import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { searchUser, addFriend, getFriends } from '../controllers/user.controller';

const router = Router();

router.get('/search', requireAuth, searchUser);
router.post('/add-friend', requireAuth, addFriend);
router.get('/friends', requireAuth, getFriends);

export default router;
