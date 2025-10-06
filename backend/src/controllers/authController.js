import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = 'simple-secret-key';

// Simple signup
export const signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password required'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Create user
        const user = new User({ username, password });
        await user.save();

        // Create token
        const token = jwt.sign({ userId: user._id, username }, JWT_SECRET);

        res.json({
            success: true,
            message: 'User created successfully',
            data: { user: { username }, token }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
};

// Simple login
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password required'
            });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Check password
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Create token
        const token = jwt.sign({ userId: user._id, username }, JWT_SECRET);

        res.json({
            success: true,
            message: 'Login successful',
            data: { user: { username }, token }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during login'
        });
    }
};
