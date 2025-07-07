import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import NewUserCredentialsModal from './NewUserCredentialsModal';

const UserManagement = ({ showNotification }) => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUserCreds, setNewUserCreds] = useState(null);

    const [newUsername, setNewUsername] = useState('');
    const [newUserRole, setNewUserRole] = useState('user');
    const [newUserGroup, setNewUserGroup] = useState('none');

    const fetchData = async () => {
        setLoading(true);
        const [userList, rolesData, groupsData] = await Promise.all([
            api.getUsers(),
            api.getRoles(),
            api.getGroups()
        ]);
        setUsers(userList);
        setRoles(rolesData);
        setGroups(groupsData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!newUsername) return;
        // Ensure role and group IDs are integers
        const roleId = parseInt(newUserRole, 10);
        const groupId = parseInt(newUserGroup, 10);
        const result = await api.createUser(newUsername, roleId, groupId);
        if (result.success) {
            // Pass the password to the modal
            setNewUserCreds({ ...result.newUser, password: result.password });
            setNewUsername('');
            fetchData();
        } else {
            showNotification(result.message || 'Failed to create user.', 'error');
        }
    };
    
    const handleDeleteUser = async (userId, username) => {
        if (username === 'admin') {
            alert("The default admin user cannot be deleted.");
            return;
        }
        if (window.confirm(`Are you sure you want to permanently delete user "${username}"? This cannot be undone.`)) {
            await api.deleteUser(userId);
            showNotification(`User "${username}" has been deleted.`, 'success');
            fetchData();
        }
    };

    const handleResetPassword = async (userId, username) => {
        if (window.confirm(`Are you sure you want to reset the password for ${username}?`)) {
            const result = await api.resetUserPassword(userId);
            if (result.success) {
                showNotification(`Password for ${username} reset. New Password: ${result.newPassword}`, 'success');
                fetchData();
            }
        }
    };

    const handleGroupChange = async (userId, newGroup) => {
        await api.updateUser(userId, { group: newGroup });
        fetchData(); 
    };

    if (loading) return <p>Loading users...</p>;

    return (
        <div className="space-y-8">
            {newUserCreds && <NewUserCredentialsModal user={newUserCreds} onClose={() => setNewUserCreds(null)} />}
            
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New User</h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-4 items-end gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="form-input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="form-select">
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
                        <select value={newUserGroup} onChange={e => setNewUserGroup(e.target.value)} className="form-select">
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="nav-button-primary">Create User</button>
                </form>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Users</h3>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                        {roles.find(r => r.id === user.role)?.name || user.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select value={user.group} onChange={(e) => handleGroupChange(user.id, e.target.value)} className="form-select py-1 text-sm">
                                            {groups.map(group => (
                                                <option key={group.id} value={group.id}>{group.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.mustChangePassword ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Password Reset</span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => handleResetPassword(user.id, user.username)} className="text-indigo-600 hover:text-indigo-900">Reset Password</button>
                                        <button onClick={() => handleDeleteUser(user.id, user.username)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default UserManagement;
