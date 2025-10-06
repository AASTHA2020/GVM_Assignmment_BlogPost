// Simple API functions using fetch
const API_BASE_URL = 'https://gvm-assignmment-blogpost.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

// Get auth headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

// Get all posts
export const getPosts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
};

// Create a new post (requires authentication)
export const createPost = async (postData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(postData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, message: 'Failed to create post' };
    }
};

// Delete a post (requires authentication)
export const deletePost = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, message: 'Failed to delete post' };
    }
};

// Authentication API calls
export const signup = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const data = await response.json();

        if (data.success && data.data.token) {
            setAuthToken(data.data.token);
        }

        return data;
    } catch (error) {
        console.error('Error signing up:', error);
        return { success: false, message: 'Failed to sign up' };
    }
};

export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();

        if (data.success && data.data.token) {
            setAuthToken(data.data.token);
        }

        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, message: 'Failed to log in' };
    }
};

export const logout = () => {
    setAuthToken(null);
};

export const getCurrentUser = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting current user:', error);
        return { success: false, message: 'Failed to get user data' };
    }
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

