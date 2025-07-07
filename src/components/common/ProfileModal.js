import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/api';

export const ProfileModal = ({ onClose }) => {
    const { user } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        
        setLoading(true);
        const result = await api.changePassword(user.id, newPassword, oldPassword);
        setLoading(false);

        if (result.success) {
            setSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setError(result.message || 'An error occurred.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">×</button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <p className="p-2 bg-gray-100 rounded-md text-gray-700">{user.username}</p>
                    </div>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Current Password"
                        className="form-input"
                        required
                    />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="form-input"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="form-input"
                        required
                    />
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Change Password'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
                </form>
            </div>
        </div>
    );
};
