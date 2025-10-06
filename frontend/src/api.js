const API_BASE_URL = 'http://localhost:3000/api';

const getAuthToken = () => localStorage.getItem('token');
const setAuthToken = (token) => localStorage.setItem('token', token);
const removeAuthToken = () => localStorage.removeItem('token');

const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

export const getPosts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        const data = await response.json();
        return data.success ? data.data : [];
    } catch (error) {
        return [];
    }
};

export const createPost = async (postData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(postData),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Failed to create post' };
    }
};

export const updatePost = async (id, postData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(postData),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Failed to update post' };
    }
};

export const deletePost = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Failed to delete post' };
    }
};

export const signup = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();

        if (data.success && data.data.token) {
            setAuthToken(data.data.token);
        }

        return data;
    } catch (error) {
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
        return { success: false, message: 'Failed to log in' };
    }
};

export const logout = () => {
    removeAuthToken();
};

export const likePost = async (postId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
            method: 'POST',
            headers: getAuthHeaders(),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Failed to like post' };
    }
};

export const addComment = async (postId, content) => {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ content }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, message: 'Failed to add comment' };
    }
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

