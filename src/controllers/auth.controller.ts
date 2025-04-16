import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '7d'
    });
};

export const register = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: 'Email already registered' });

        const user = await User.create({ name, email, password }) as { _id: string, name: string, email: string };
        const token = generateToken(user._id);

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email and password required' });

    try {
        const user = await User.findOne({ email }) as { _id: string, name: string, email: string, comparePassword: (password: string) => Promise<boolean> };
        if (!user)
            return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = generateToken(user._id.toString());

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};  
