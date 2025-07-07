import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const Logo = () => ( /* Using a local version to avoid dependency loops */
    <div className="flex items-center gap-3">
        <div className="w-16 h-16 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" rx="22" fill="var(--primary-color)" />
                <text x="50" y="55" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="48" fontWeight="bold">R</text>
                <circle cx="80" cy="20" r="10" fill="var(--accent-color)" />
            </svg>
        </div>
        <div className="flex flex-col leading-tight">
            <span className="font-bold text-xl text-gray-800">REACT</span>
            <span className="text-sm text-gray-500">Email Configurator</span>
        </div>
    </div>
);


export const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await login(username, password);
        if (!result.success) {
            setError(result.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
        // On success, the App component will handle the redirect.
    };
    
    return (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
                 <div className="mx-auto mb-8 flex justify-center">
                    <Logo />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="form-input text-center" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="form-input text-center" />
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};
