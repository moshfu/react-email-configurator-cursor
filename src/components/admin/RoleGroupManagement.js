import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
// import { TrashIcon } from '../common'; // Removed unused import

const RoleGroupManagement = ({ showNotification }) => {
    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('roles');

    // Role form state
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [editingRole, setEditingRole] = useState(null);

    // Group form state
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [editingGroup, setEditingGroup] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        const [rolesData, groupsData] = await Promise.all([
            api.getRoles(),
            api.getGroups()
        ]);
        setRoles(rolesData);
        setGroups(groupsData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Role management functions
    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) {
            showNotification('Role name is required.', 'error');
            return;
        }

        if (roles.some(r => r.name.toLowerCase() === newRoleName.toLowerCase())) {
            showNotification('A role with this name already exists.', 'error');
            return;
        }

        const roleData = {
            name: newRoleName.trim(),
            description: newRoleDescription.trim() || ''
        };

        await api.saveRole(roleData);
        showNotification(`Role "${newRoleName}" created successfully!`, 'success');
        setNewRoleName('');
        setNewRoleDescription('');
        fetchData();
    };

    const handleEditRole = async (e) => {
        e.preventDefault();
        if (!editingRole.name.trim()) {
            showNotification('Role name is required.', 'error');
            return;
        }

        const existingRole = roles.find(r => r.name.toLowerCase() === editingRole.name.toLowerCase() && r.id !== editingRole.id);
        if (existingRole) {
            showNotification('A role with this name already exists.', 'error');
            return;
        }

        await api.updateRole(editingRole);
        showNotification(`Role "${editingRole.name}" updated successfully!`, 'success');
        setEditingRole(null);
        fetchData();
    };

    const handleDeleteRole = async (roleId, roleName) => {
        if (roleName === 'admin' || roleName === 'user') {
            showNotification('Cannot delete default roles (admin, user).', 'error');
            return;
        }

        if (window.confirm(`Are you sure you want to delete the role "${roleName}"? This will affect all users with this role.`)) {
            await api.deleteRole(roleId);
            showNotification(`Role "${roleName}" deleted successfully!`, 'success');
            fetchData();
        }
    };

    // Group management functions
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName.trim()) {
            showNotification('Group name is required.', 'error');
            return;
        }

        if (groups.some(g => g.name.toLowerCase() === newGroupName.toLowerCase())) {
            showNotification('A group with this name already exists.', 'error');
            return;
        }

        const groupData = {
            name: newGroupName.trim(),
            description: newGroupDescription.trim() || '',
            canSeeGroups: newGroupCanSeeGroups.length > 0 ? newGroupCanSeeGroups : []
        };

        await api.saveGroup(groupData);
        showNotification(`Group "${newGroupName}" created successfully!`, 'success');
        setNewGroupName('');
        setNewGroupDescription('');
        setNewGroupCanSeeGroups([]);
        fetchData();
    };

    const [newGroupCanSeeGroups, setNewGroupCanSeeGroups] = useState([]);
    const [editingGroupCanSeeGroups, setEditingGroupCanSeeGroups] = useState([]);

    const handleEditGroup = async (e) => {
        e.preventDefault();
        if (!editingGroup.name.trim()) {
            showNotification('Group name is required.', 'error');
            return;
        }

        const existingGroup = groups.find(g => g.name.toLowerCase() === editingGroup.name.toLowerCase() && g.id !== editingGroup.id);
        if (existingGroup) {
            showNotification('A group with this name already exists.', 'error');
            return;
        }

        await api.updateGroup({ ...editingGroup, canSeeGroups: editingGroupCanSeeGroups });
        showNotification(`Group "${editingGroup.name}" updated successfully!`, 'success');
        setEditingGroup(null);
        setEditingGroupCanSeeGroups([]);
        fetchData();
    };

    const handleDeleteGroup = async (groupId, groupName) => {
        if (groupName === 'None') {
            showNotification('Cannot delete the default "None" group.', 'error');
            return;
        }

        if (window.confirm(`Are you sure you want to delete the group "${groupName}"? This will affect all users in this group.`)) {
            await api.deleteGroup(groupId);
            showNotification(`Group "${groupName}" deleted successfully!`, 'success');
            fetchData();
        }
    };

    if (loading) return <p>Loading roles and groups...</p>;

    return (
        <div className="space-y-8">
            <div className="border-b border-gray-300">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('roles')} 
                        className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'roles' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Roles Management
                    </button>
                    <button 
                        onClick={() => setActiveTab('groups')} 
                        className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'groups' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Groups Management
                    </button>
                </nav>
            </div>

            {activeTab === 'roles' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Role</h3>
                        <form onSubmit={handleCreateRole} className="grid grid-cols-3 items-end gap-4 p-4 bg-gray-50 rounded-lg border">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                                <input 
                                    type="text" 
                                    value={newRoleName} 
                                    onChange={e => setNewRoleName(e.target.value)} 
                                    className="form-input" 
                                    placeholder="e.g., Moderator"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input 
                                    type="text" 
                                    value={newRoleDescription} 
                                    onChange={e => setNewRoleDescription(e.target.value)} 
                                    className="form-input" 
                                    placeholder="e.g., Can moderate content"
                                />
                            </div>
                            <button type="submit" className="nav-button-primary">Create Role</button>
                        </form>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Roles</h3>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {roles.map(role => (
                                        <tr key={role.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {editingRole?.id === role.id ? (
                                                    <input 
                                                        type="text" 
                                                        value={editingRole.name} 
                                                        onChange={e => setEditingRole({...editingRole, name: e.target.value})} 
                                                        className="form-input text-sm py-1" 
                                                    />
                                                ) : (
                                                    role.name
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingRole?.id === role.id ? (
                                                    <input 
                                                        type="text" 
                                                        value={editingRole.description} 
                                                        onChange={e => setEditingRole({...editingRole, description: e.target.value})} 
                                                        className="form-input text-sm py-1" 
                                                    />
                                                ) : (
                                                    role.description || '-'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                                {editingRole?.id === role.id ? (
                                                    <>
                                                        <button onClick={handleEditRole} className="text-green-600 hover:text-green-900">Save</button>
                                                        <button onClick={() => setEditingRole(null)} className="text-gray-600 hover:text-gray-900">Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => setEditingRole(role)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                        <button onClick={() => handleDeleteRole(role.id, role.name)} className="text-red-600 hover:text-red-900">Delete</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'groups' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Group</h3>
                        <form onSubmit={handleCreateGroup} className="grid grid-cols-3 items-end gap-4 p-4 bg-gray-50 rounded-lg border">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                <input 
                                    type="text" 
                                    value={newGroupName} 
                                    onChange={e => setNewGroupName(e.target.value)} 
                                    className="form-input" 
                                    placeholder="e.g., Marketing Team"
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input 
                                    type="text" 
                                    value={newGroupDescription} 
                                    onChange={e => setNewGroupDescription(e.target.value)} 
                                    className="form-input" 
                                    placeholder="e.g., Marketing team access"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Can See Groups</label>
                                <div className="max-h-32 overflow-y-auto border rounded p-2 bg-white">
                                    {groups.map(g => (
                                        <label key={g.id} className="flex items-center space-x-2 text-sm">
                                            <input 
                                                type="checkbox" 
                                                checked={newGroupCanSeeGroups.includes(g.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewGroupCanSeeGroups([...newGroupCanSeeGroups, g.id]);
                                                    } else {
                                                        setNewGroupCanSeeGroups(newGroupCanSeeGroups.filter(id => id !== g.id));
                                                    }
                                                }}
                                                className="rounded"
                                            />
                                            <span>{g.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="nav-button-primary">Create Group</button>
                        </form>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Groups</h3>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can See Groups</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {groups.map(group => (
                                        <tr key={group.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {editingGroup?.id === group.id ? (
                                                    <input 
                                                        type="text" 
                                                        value={editingGroup.name} 
                                                        onChange={e => setEditingGroup({...editingGroup, name: e.target.value})} 
                                                        className="form-input text-sm py-1" 
                                                    />
                                                ) : (
                                                    group.name
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingGroup?.id === group.id ? (
                                                    <input 
                                                        type="text" 
                                                        value={editingGroup.description} 
                                                        onChange={e => setEditingGroup({...editingGroup, description: e.target.value})} 
                                                        className="form-input text-sm py-1" 
                                                    />
                                                ) : (
                                                    group.description || '-'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {editingGroup?.id === group.id ? (
                                                    <div className="max-h-32 overflow-y-auto border rounded p-2 bg-white">
                                                        {groups.map(g => (
                                                            <label key={g.id} className="flex items-center space-x-2 text-xs">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={editingGroupCanSeeGroups.includes(g.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setEditingGroupCanSeeGroups([...editingGroupCanSeeGroups, g.id]);
                                                                        } else {
                                                                            setEditingGroupCanSeeGroups(editingGroupCanSeeGroups.filter(id => id !== g.id));
                                                                        }
                                                                    }}
                                                                    className="rounded"
                                                                />
                                                                <span>{g.name}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs">
                                                        {group.canSeeGroups && group.canSeeGroups.length > 0 ? (
                                                            group.canSeeGroups.map(groupId => {
                                                                const targetGroup = groups.find(g => g.id === groupId);
                                                                return targetGroup ? (
                                                                    <span key={groupId} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1 mb-1">
                                                                        {targetGroup.name}
                                                                    </span>
                                                                ) : null;
                                                            })
                                                        ) : (
                                                            <span className="text-gray-400">None</span>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                                {editingGroup?.id === group.id ? (
                                                    <>
                                                        <button onClick={handleEditGroup} className="text-green-600 hover:text-green-900">Save</button>
                                                        <button onClick={() => { setEditingGroup(null); setEditingGroupCanSeeGroups([]); }} className="text-gray-600 hover:text-gray-900">Cancel</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => { setEditingGroup(group); setEditingGroupCanSeeGroups(group.canSeeGroups || []); }} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                        <button onClick={() => handleDeleteGroup(group.id, group.name)} className="text-red-600 hover:text-red-900">Delete</button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleGroupManagement; 