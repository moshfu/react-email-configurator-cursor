import React, { useState } from 'react';
import UserManagement from './UserManagement';
import GlobalSettings from './GlobalSettings';
import TemplateEditor from './TemplateEditor';
import RoleGroupManagement from './RoleGroupManagement';

export const AdminPanel = ({ onClose, currentSettings, showNotification }) => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="fixed inset-0 bg-gray-100 z-40 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Admin Panel</h2>
                    <button onClick={onClose} className="text-3xl font-light text-gray-500 hover:text-gray-800">×</button>
                </div>
                
                <div className="border-b border-gray-300">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('users')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            User Management
                        </button>
                        <button onClick={() => setActiveTab('templates')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'templates' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Template Management
                        </button>
                        <button onClick={() => setActiveTab('roles')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'roles' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Roles & Groups
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`py-4 px-1 border-b-2 font-medium text-base ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Site Configuration
                        </button>
                    </nav>
                </div>

                <div className="pt-8">
                    {activeTab === 'users' && <UserManagement showNotification={showNotification} />}
                    {activeTab === 'templates' && <TemplateEditor currentSettings={currentSettings} showNotification={showNotification} />}
                    {activeTab === 'roles' && <RoleGroupManagement showNotification={showNotification} />}
                    {activeTab === 'settings' && <GlobalSettings showNotification={showNotification} />}
                </div>
            </div>
        </div>
    );
};
