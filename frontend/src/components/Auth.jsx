import React, { useState } from 'react';
import { signup, login } from '../api';

const Auth = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let result;
            if (isLogin) {
                result = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                result = await signup({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });
            }

            if (result.success) {
                setMessage(`${isLogin ? 'Login' : 'Signup'} successful!`);
                onAuthSuccess(result.data.user);
                // Clear form
                setFormData({ username: '', email: '', password: '' });
            } else {
                setMessage(result.message || `${isLogin ? 'Login' : 'Signup'} failed`);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage('');
        setFormData({ username: '', email: '', password: '' });
    };

    return (
        <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #dee2e6',
            maxWidth: '400px',
            margin: '0 auto 30px auto'
        }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '20px',
                color: '#333'
            }}>
                {isLogin ? '🔐 Login' : '📝 Sign Up'}
            </h2>

            {message && (
                <div style={{
                    padding: '10px',
                    marginBottom: '20px',
                    borderRadius: '4px',
                    backgroundColor: message.includes('successful') ? '#d4edda' : '#f8d7da',
                    color: message.includes('successful') ? '#155724' : '#721c24',
                    border: `1px solid ${message.includes('successful') ? '#c3e6cb' : '#f5c6cb'}`,
                    textAlign: 'center'
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Username *"
                            required={!isLogin}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email *"
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password *"
                        required
                        minLength="6"
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        backgroundColor: loading ? '#ccc' : '#007bff',
                        color: 'white',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>

                <div style={{ textAlign: 'center' }}>
                    <button
                        type="button"
                        onClick={toggleMode}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '14px'
                        }}
                    >
                        {isLogin 
                            ? "Don't have an account? Sign up" 
                            : "Already have an account? Login"
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Auth;
