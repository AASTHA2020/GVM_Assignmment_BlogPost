import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import postRoutes from './src/routes/postRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        message: 'Simple Blog API with Authentication',
        endpoints: {
            'POST /api/auth/signup': 'Register new user',
            'POST /api/auth/login': 'Login user',
            'GET /api/posts': 'Get all posts',
            'POST /api/posts': 'Create new post (protected)',
            'DELETE /api/posts/:id': 'Delete post (protected)'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use((err, req, res, next) => {
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

const startServer = async () => {
    try {
        console.log('Starting server...');
        await connectDB();
        console.log('Database connected, starting HTTP server...');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};

startServer();
