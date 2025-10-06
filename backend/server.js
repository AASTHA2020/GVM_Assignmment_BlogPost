import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import postRoutes from './src/routes/postRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));
app.use(express.json());


const PORT = process.env.PORT || 3000;

// Routes
app.get('/', (req, res) => {
    res.json({
        message: ' Simple Blog API with Authentication',
        endpoints: {
            'POST /api/auth/signup': 'Register new user',
            'POST /api/auth/login': 'Login user',
            'GET /api/auth/me': 'Get current user (protected)',
            'GET /api/posts': 'Get all posts',
            'POST /api/posts': 'Create new post (protected)',
            'DELETE /api/posts/:id': 'Delete post (protected)'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});



// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
            
        });
    } catch (error) {
        process.exit(1);
    }
};

startServer();
