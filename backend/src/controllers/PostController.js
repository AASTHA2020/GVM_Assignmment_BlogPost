import Post from '../models/Post.js';

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
            username: req.user.username,
            author: req.user.username,
          
            likes: [],
            comments: []
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

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        if (post.username !== req.user.username) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own posts'
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                title: title || post.title,
                content: content || post.content,
            },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Post updated successfully',
            data: updatedPost
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating post'
        });
    }
};

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

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const username = req.user.username;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const hasLiked = post.likes.includes(username);

        if (hasLiked) {
            post.likes = post.likes.filter(user => user !== username);
        } else {
            post.likes.push(username);
        }

        await post.save();

        res.json({
            success: true,
            message: hasLiked ? 'Post unliked' : 'Post liked',
            data: { likes: post.likes.length, hasLiked: !hasLiked }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error liking post'
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const comment = {
            author: req.user.username,
            content,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding comment'
        });
    }
};
