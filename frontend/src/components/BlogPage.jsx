import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [message, setMessage] = useState('');

    // Get token from localStorage
    const getToken = () => localStorage.getItem('token');
    
    // Save token to localStorage
    const saveToken = (token) => localStorage.setItem('token', token);
    
    // Remove token from localStorage
    const removeToken = () => localStorage.removeItem('token');

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/posts`);
            const data = await response.json();
            setPosts(data.success ? data.data : []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            
            if (data.success) {
                saveToken(data.data.token);
                setUser(data.data.user);
                setShowLogin(false);
                setMessage('Login successful!');
                setUsername('');
                setPassword('');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Login failed');
        }
    };

    // Signup
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            
            if (data.success) {
                saveToken(data.data.token);
                setUser(data.data.user);
                setShowLogin(false);
                setMessage('Account created successfully!');
                setUsername('');
                setPassword('');
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Signup failed');
        }
    };

    // Create post
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('Please login first');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ title, content })
            });
            const data = await response.json();
            
            if (data.success) {
                setTitle('');
                setContent('');
                setMessage('Post created successfully!');
                fetchPosts(); // Refresh posts
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Failed to create post');
        }
    };

    // Delete post
    const handleDeletePost = async (postId) => {
        if (!user) return;
        
        try {
            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setMessage('Post deleted successfully!');
                fetchPosts(); // Refresh posts
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Failed to delete post');
        }
    };

    // Logout
    const handleLogout = () => {
        removeToken();
        setUser(null);
        setMessage('Logged out successfully');
    };

    // Load posts on component mount
    useEffect(() => {
        fetchPosts();
        // Check if user is already logged in
        const token = getToken();
        if (token) {
            // Simple token check - in real app, verify with server
            setUser({ username: 'User' }); // Simplified
        }
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1>📝 Simple Blog</h1>
                {user ? (
                    <div>
                        <span>Welcome, {user.username}! </span>
                        <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setShowLogin(!showLogin)}>
                        {showLogin ? 'Hide Login' : 'Login / Sign Up'}
                    </button>
                )}
            </div>

            {/* Message */}
            {message && (
                <div style={{
                    padding: '10px',
                    marginBottom: '20px',
                    backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
                    color: message.includes('success') ? '#155724' : '#721c24',
                    borderRadius: '4px'
                }}>
                    {message}
                </div>
            )}

            {/* Login/Signup Form */}
            {showLogin && !user && (
                <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h3>Login or Sign Up</h3>
                    <form>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleLogin}
                            style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={handleSignup}
                            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            )}

            {/* Create Post Form */}
            {user && (
                <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                    <h3>Create New Post</h3>
                    <form onSubmit={handleCreatePost}>
                        <div style={{ marginBottom: '15px' }}>
                            <input
                                type="text"
                                placeholder="Post Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <textarea
                                placeholder="Post Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows="4"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            Create Post
                        </button>
                    </form>
                </div>
            )}

            {/* Posts List */}
            <div>
                <h2>All Posts ({posts.length})</h2>
                {posts.length === 0 ? (
                    <p>No posts yet. {user ? 'Create the first one!' : 'Login to create posts!'}</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '20px',
                            backgroundColor: 'white'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <h3>{post.title}</h3>
                                    <p style={{ color: '#666', fontSize: '14px' }}>
                                        By: {post.author || post.username} | {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                    <p>{post.content}</p>
                                </div>
                                {user && (
                                    <button
                                        onClick={() => handleDeletePost(post._id)}
                                        style={{
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
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
