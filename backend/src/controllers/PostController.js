import Post from '../models/Post.js';

// Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching posts'
        });
    }
};

// Create new post
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        const post = new Post({
            title,
            content,
            username: req.user.username, // From JWT token
            author: req.user.username
        });

        const savedPost = await post.save();
        
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: savedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating post'
        });
    }
};

// Delete post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user owns the post
        if (post.username !== req.user.username) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own posts'
            });
        }

        await Post.findByIdAndDelete(id);
        
        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting post'
        });
    }
};
