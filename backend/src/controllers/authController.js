import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password required'
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        const user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ userId: user._id, username }, process.env.JWT_SECRET);

        res.json({
            success: true,
            message: 'User created successfully',
            data: { user: { username }, token }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password required'
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const token = jwt.sign({ userId: user._id, username }, process.env.JWT_SECRET);

        res.json({
            success: true,
            message: 'Login successful',
            data: { user: { username }, token }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};
