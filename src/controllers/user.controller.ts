import { Request, Response } from 'express';
import User from '../models/User';

export const searchUser = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.query;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
        id: user._id,
        name: user.name,
        email: user.email
    });
};

export const addFriend = async (req: Request, res: Response): Promise<any> => {
    const { friendId } = req.body;
    const currentUserId = req.userId;

    if (!friendId) return res.status(400).json({ message: 'Friend ID is required' });

    if (friendId === currentUserId) return res.status(400).json({ message: 'You cannot add yourself' });

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    if (currentUser.friends.includes(friendId)) {
        return res.status(409).json({ message: 'Already friends' });
    }

    currentUser.friends.push(friendId);
    await currentUser.save();

    res.json({ message: 'Friend added' });
};

export const getFriends = async (req: Request, res: Response): Promise<any> => {
    const user = await User.findById(req.userId).populate('friends', 'name email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.friends);
};
