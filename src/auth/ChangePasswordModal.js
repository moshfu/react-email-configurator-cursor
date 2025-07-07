import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export const ChangePasswordModal = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, forcePasswordUpdate } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setLoading(true);
        const result = await forcePasswordUpdate(user.id, newPassword);
        if (!result.success) {
            setError(result.message || 'An error occurred. Please try again.');
            setLoading(false);
        }
        // On success, the modal will disappear as the user state updates in AuthContext
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center transform transition-all animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Your New Password</h2>
                <p className="text-gray-600 mb-6">For security reasons, you must set a new password for your account.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="form-input"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="form-input"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Set Password'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};
