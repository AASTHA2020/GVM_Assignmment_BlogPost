import React, { useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePost, signup, login, logout, isAuthenticated, likePost, addComment } from '../api';
import { useTheme } from '../contexts/ThemeContext';

const BlogPage = () => {
    const theme = useTheme();
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [message, setMessage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [commentContent, setCommentContent] = useState({});
    const [showComments, setShowComments] = useState({});

    const fetchPosts = async () => {
        const data = await getPosts();
        setPosts(data);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login({ username, password });
        if (result.success) {
            setUser(result.data.user);
            setShowLogin(false);
            setMessage('Login successful');
            setUsername('');
            setPassword('');
        } else {
            setMessage(result.message);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const result = await signup({ username, password });
        if (result.success) {
            setUser(result.data.user);
            setShowLogin(false);
            setMessage('Account created successfully');
            setUsername('');
            setPassword('');
        } else {
            setMessage(result.message);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('Please login first');
            return;
        }

        const result = await createPost({ title, content }, imageFile);
        if (result.success) {
            setTitle('');
            setContent('');
            setImageFile(null);
            setMessage('Post created successfully');
            fetchPosts();
        } else {
            setMessage(result.message);
        }
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        if (!editingPost) return;

        const result = await updatePost(editingPost._id, { title, content }, imageFile);
        if (result.success) {
            setTitle('');
            setContent('');
            setImageFile(null);
            setEditingPost(null);
            setMessage('Post updated successfully');
            fetchPosts();
        } else {
            setMessage(result.message);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!user) return;

        const result = await deletePost(postId);
        if (result.success) {
            setMessage('Post deleted successfully');
            fetchPosts();
        } else {
            setMessage(result.message);
        }
    };

    const handleLikePost = async (postId) => {
        if (!user) {
            setMessage('Please login to like posts');
            return;
        }

        const result = await likePost(postId);
        if (result.success) {
            fetchPosts();
        }
    };

    const handleAddComment = async (postId) => {
        if (!user) {
            setMessage('Please login to comment');
            return;
        }

        const content = commentContent[postId];
        if (!content) return;

        const result = await addComment(postId, content);
        if (result.success) {
            setCommentContent({ ...commentContent, [postId]: '' });
            fetchPosts();
        } else {
            setMessage(result.message);
        }
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setTitle(post.title);
        setContent(post.content);
    };

    const cancelEdit = () => {
        setEditingPost(null);
        setTitle('');
        setContent('');
        setImageFile(null);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        setMessage('Logged out successfully');
    };

    const toggleComments = (postId) => {
        setShowComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    useEffect(() => {
        fetchPosts();
        if (isAuthenticated()) {
            setUser({ username: 'User' });
        }
    }, []);

    const containerStyle = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        minHeight: '100vh'
    };

    const cardStyle = {
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
    };

    const buttonStyle = (variant = 'primary') => ({
        padding: '10px 20px',
        backgroundColor: theme.colors[variant],
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '10px'
    });

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        marginBottom: '15px'
    };

    return (
        <div style={containerStyle}>
            <button
                className="theme-toggle"
                onClick={theme.toggleTheme}
                style={{ color: theme.colors.text, borderColor: theme.colors.text }}
            >
                {theme.isDark ? '☀️' : '🌙'}
            </button>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1>Simple Blog</h1>
                {user ? (
                    <div>
                        <span>Welcome, {user.username}! </span>
                        <button onClick={handleLogout} style={buttonStyle('danger')}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setShowLogin(!showLogin)} style={buttonStyle()}>
                        {showLogin ? 'Hide Login' : 'Login / Sign Up'}
                    </button>
                )}
            </div>

            {message && (
                <div style={{
                    ...cardStyle,
                    backgroundColor: message.includes('success') ? theme.colors.success : theme.colors.danger,
                    color: 'white'
                }}>
                    {message}
                </div>
            )}

            {showLogin && !user && (
                <div style={cardStyle}>
                    <h3>Login or Sign Up</h3>
                    <form>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="button" onClick={handleLogin} style={buttonStyle()}>
                            Login
                        </button>
                        <button type="button" onClick={handleSignup} style={buttonStyle('success')}>
                            Sign Up
                        </button>
                    </form>
                </div>
            )}

            {user && (
                <div style={cardStyle}>
                    <h3>{editingPost ? 'Edit Post' : 'Create New Post'}</h3>
                    <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
                        <input
                            type="text"
                            placeholder="Post Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={inputStyle}
                        />
                        <textarea
                            placeholder="Post Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="4"
                            style={inputStyle}
                        />
                       
                        <button type="submit" style={buttonStyle()}>
                            {editingPost ? 'Update Post' : 'Create Post'}
                        </button>
                        {editingPost && (
                            <button type="button" onClick={cancelEdit} style={buttonStyle('warning')}>
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            )}

            <div>
                <h2>All Posts ({posts.length})</h2>
                {posts.length === 0 ? (
                    <p>No posts yet. {user ? 'Create the first one!' : 'Login to create posts!'}</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3>{post.title}</h3>
                                    <p style={{ color: theme.colors.textSecondary, fontSize: '14px' }}>
                                        By: {post.author || post.username} | {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                    {post.image && (
                                        <img
                                            src={`http://localhost:3000${post.image}`}
                                            alt="Post"
                                            style={{ maxWidth: '100%', height: 'auto', margin: '10px 0', borderRadius: '4px' }}
                                        />
                                    )}
                                    <p>{post.content}</p>

                                    <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <button
                                            onClick={() => handleLikePost(post._id)}
                                            style={{
                                                ...buttonStyle(),
                                                backgroundColor: post.likes?.includes(user?.username) ? theme.colors.danger : theme.colors.primary
                                            }}
                                        >
                                            {post.likes?.includes(user?.username) ? '❤️' : '🤍'} {post.likes?.length || 0}
                                        </button>

                                        <button
                                            onClick={() => toggleComments(post._id)}
                                            style={buttonStyle('warning')}
                                        >
                                            💬 {post.comments?.length || 0}
                                        </button>
                                    </div>

                                    {showComments[post._id] && (
                                        <div style={{ marginTop: '15px' }}>
                                            {user && (
                                                <div style={{ marginBottom: '15px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Add a comment..."
                                                        value={commentContent[post._id] || ''}
                                                        onChange={(e) => setCommentContent({
                                                            ...commentContent,
                                                            [post._id]: e.target.value
                                                        })}
                                                        style={inputStyle}
                                                    />
                                                    <button
                                                        onClick={() => handleAddComment(post._id)}
                                                        style={buttonStyle()}
                                                    >
                                                        Add Comment
                                                    </button>
                                                </div>
                                            )}

                                            {post.comments?.map((comment, index) => (
                                                <div key={index} style={{
                                                    backgroundColor: theme.colors.background,
                                                    padding: '10px',
                                                    borderRadius: '4px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <strong>{comment.author}</strong>
                                                    <span style={{ color: theme.colors.textSecondary, fontSize: '12px', marginLeft: '10px' }}>
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <p>{comment.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {user && user.username === (post.author || post.username) && (
                                    <div>
                                        <button
                                            onClick={() => handleEditPost(post)}
                                            style={buttonStyle('warning')}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post._id)}
                                            style={buttonStyle('danger')}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BlogPage;
