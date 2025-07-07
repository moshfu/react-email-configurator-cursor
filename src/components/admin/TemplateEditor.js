import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { TrashIcon } from '../common';

const TemplateEditor = ({ currentSettings, showNotification }) => {
    const [templates, setTemplates] = useState([]);
    const [userTemplates, setUserTemplates] = useState([]);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllTemplates = async () => {
        setLoading(true);
        const data = await api.getAllTemplatesForAdmin();
        setTemplates(data.global);
        setUserTemplates(data.user);
        setLoading(false);
    };

    const fetchUsers = async () => {
        const userList = await api.getUsers();
        setUsers(userList);
    };

    const fetchGroups = async () => {
        const groupsData = await api.getGroups();
        setGroups(groupsData);
    };

    useEffect(() => {
        fetchAllTemplates();
        fetchUsers();
        fetchGroups();
    }, []);

    const handleSaveCurrentAsNew = async () => {
        const name = prompt("Enter a name for the new global template:");
        if (!name) return;
        const category = prompt("Enter a category (e.g., General, Registration):", "General");
        const visibilityOptions = ["global", ...groups.map(g => g.id)].join(", ");
        const visibility = prompt(`Set visibility (${visibilityOptions}):`, "global");

        if (["global", ...groups.map(g => g.id)].includes(visibility)) {
            const newTemplate = { ...currentSettings, id: null, name, category, visibility };
            await api.saveGlobalTemplate(newTemplate);
            showNotification(`Template "${name}" created!`, 'success');
            fetchAllTemplates();
        } else {
            alert(`Invalid visibility. Please use one of: ${visibilityOptions}`);
        }
    };
    
    const handleDelete = async (templateId, templateName) => {
        if(window.confirm(`Are you sure you want to permanently delete the "${templateName}" template?`)) {
            await api.deleteGlobalTemplate(templateId);
            showNotification('Template deleted.', 'success');
            fetchAllTemplates();
        }
    };

    const handleTemplateUpdate = async (templateId, field, value) => {
        const templateToUpdate = templates.find(t => t.id === templateId);
        if (templateToUpdate) {
            const updatedTemplate = { ...templateToUpdate, [field]: value };
            await api.updateGlobalTemplate(updatedTemplate);
            fetchAllTemplates();
            showNotification('Template updated!', 'success');
        }
    };

    const handleSetUserTemplateAsGlobal = async (template) => {
        const name = prompt("Enter a name for the new global template:", template.name);
        if (!name) return;
        const category = prompt("Enter a category (e.g., General, Registration):", template.category || "General");
        const visibilityOptions = ["global", ...groups.map(g => g.id)].join(", ");
        const visibility = prompt(`Set visibility (${visibilityOptions}):`, "global");
        if (["global", ...groups.map(g => g.id)].includes(visibility)) {
            const newTemplate = { ...template, id: null, name, category, visibility };
            delete newTemplate.ownerId;
            await api.saveGlobalTemplate(newTemplate);
            showNotification(`User template "${name}" set as global!`, 'success');
            fetchAllTemplates();
        } else {
            alert(`Invalid visibility. Please use one of: ${visibilityOptions}`);
        }
    };

    const getUsernameById = (id) => {
        const user = users.find(u => u.id === id);
        return user ? user.username : 'Unknown';
    };

    if (loading) return <p>Loading templates...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 border rounded-lg">
                <div>
                    <h3 className="text-lg font-medium">Create Template from Current Config</h3>
                    <p className="text-sm text-gray-500">The current settings in the main configurator will be saved as a new global or group template.</p>
                </div>
                <button onClick={handleSaveCurrentAsNew} className="nav-button-primary flex-shrink-0">
                    Save Current Config as New Template
                </button>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Existing Global & Group Templates</h3>
            <div className="space-y-3 mb-10">
                {templates.length > 0 ? templates.map(t => (
                    <div key={t.id} className="p-4 bg-white border rounded-lg grid grid-cols-4 gap-4 items-center">
                        <div className="col-span-1">
                            <p className="font-semibold text-gray-800">{t.name}</p>
                        </div>
                        <div className="col-span-1">
                            <label className="text-xs text-gray-500">Category</label>
                            <input type="text" value={t.category || ''} onChange={(e) => handleTemplateUpdate(t.id, 'category', e.target.value)} className="form-input text-sm py-1" />
                        </div>
                        <div className="col-span-1">
                            <label className="text-xs text-gray-500">Visibility</label>
                            <select value={t.visibility || 'global'} onChange={(e) => handleTemplateUpdate(t.id, 'visibility', e.target.value)} className="form-select text-sm py-1">
                                <option value="global">Global</option>
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-1 text-right">
                            <button onClick={() => handleDelete(t.id, t.name)} className="p-2 rounded-full hover:bg-red-100">
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                )) : <p className="text-gray-500">No global templates found.</p>}
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-4">User Templates</h3>
            <div className="space-y-3">
                {userTemplates.length > 0 ? userTemplates.map(t => (
                    <div key={t.id} className="p-4 bg-gray-50 border rounded-lg grid grid-cols-4 gap-4 items-center">
                        <div className="col-span-1">
                            <p className="font-semibold text-gray-800">{t.name}</p>
                            <p className="text-xs text-gray-500">By: {getUsernameById(t.ownerId)}</p>
                        </div>
                        <div className="col-span-2">
                            <span className="text-xs text-gray-400">Category: {t.category || 'My Templates'}</span>
                        </div>
                        <div className="col-span-1 text-right">
                            <button onClick={() => handleSetUserTemplateAsGlobal(t)} className="nav-button-primary text-xs py-1 px-3">Set as Global</button>
                        </div>
                    </div>
                )) : <p className="text-gray-500">No user templates found.</p>}
            </div>
        </div>
    );
};

export default TemplateEditor;
