import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/api';
import { TrashIcon } from '../common';

const TemplateSelectSection = ({ onNavigate, showNotification, onUpdate, settings }) => {
    const { user } = useAuth();
    const [templates, setTemplates] = useState({ global: [], user: [] });
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    useEffect(() => {
        if (!user) return; // Wait for user object to be available

        const fetchTemplates = async () => {
            setLoading(true);
            const data = await api.getTemplates(user);
            setTemplates(data);
            setLoading(false);
        };
        fetchTemplates();
    }, [user]);

    // Set selected template when settings change
    useEffect(() => {
        if (settings?.id) {
            setSelectedTemplate(settings.id);
        } else if (!selectedTemplate) {
            // Default to "none" if no template is selected
            setSelectedTemplate('none');
        }
    }, [settings?.id, selectedTemplate]);

    const handleSelect = (templateId) => {
        if (templateId === 'none') {
            // Create a "none" template with all toggles off and defaults
            const noneTemplate = {
                id: 'none',
                name: 'None',
                category: 'Start Fresh',
                includeWalletButtons: false,
                includeOuterBorder: false,
                includeCoName: false,
                includeAssociation: false,
                includeAddress: false,
                showEmail: false,
                showPhone: false,
                showWebsite: false,
                showSocialMedia: false,
                // Set other defaults
                eventAbbreviation: 'EVENT',
                copyrightYear: '2025',
                bodyBackgroundColor: '#ffffff',
                bodyTextColor: '#333333',
                linkColor: '#00519e',
                dividerColor: '#dddddd',
                footerBackgroundColor: '#f5f5f5',
                footerTextColor: '#555555',
                templateFontFamily: 'Roboto',
                bodyFontSize: 14,
                paragraphLineHeight: 1.6,
                tableBorderRadius: 10,
                salutationInput: 'Dear Attendee,',
                salutationFontSize: 16,
                salutationStyles: ['normal'],
                organizingTeamName: 'The Event Team',
                teamNameFontSize: 14,
                teamNameStyles: ['bold'],
                footerFontSize: 12,
                footerStyles: ['normal'],
                footerPadding: 20,
                footerBorderRadius: 10,
                lineWidth: 1,
                banners: [],
                includeTopPadding: false,
                topPaddingHeight: 20,
                topPaddingBackgroundColor: '#f5f5f5',
                topPaddingTextColor: '#555555',
                topPaddingText: '',
                contactEmail: 'info@example.com',
                contactPhone: '+1 234 567 890',
                websiteUrl: 'www.example.com',
                socialTextInput: 'Follow us on social media',
                socialMediaBackgroundColor: '#f8f9fa',
                socialLinks: { facebookUrl: '', twitterUrl: '', linkedinUrl: '', instagramUrl: '', youtubeUrl: '' },
                socialIconSize: 24,
                socialIconBorderRadius: 0,
                sectionTitles: [],
                ctaButtons: [],
                walletPlacement: 'after-intro',
                walletBackgroundColor: '#f8f9fa',
                walletIntroText: 'Please open this e-mail on your mobile phone.\n\nClick the buttons below to add your conference ticket to your wallet.',
                walletIntroFontSize: 12,
                walletIntroStyles: ['normal'],
                walletInstructionsText: 'Please open this e-mail on your mobile phone.\nClick the buttons below to add your conference ticket to your wallet.\nAt the venue, please proceed to the self-printing terminals to print your badge.',
                walletInstructionsFontSize: 12,
                walletInstructionsStyles: ['normal'],
            };
            setSelectedTemplate('none');
            onUpdate(null, noneTemplate);
            showNotification('Starting with a blank template!', 'success');
            onNavigate('appearance');
            return;
        }

        const allTemplates = [...templates.global, ...templates.user];
        const selected = allTemplates.find(t => t.id === templateId);
        if (selected) {
            setSelectedTemplate(templateId);
            onUpdate(null, selected);
            showNotification(`Template "${selected.name}" loaded successfully!`);
            onNavigate('appearance');
        }
    };

    const handleDeleteUserTemplate = async (templateId, templateName) => {
        if (window.confirm(`Are you sure you want to delete "${templateName}"?`)) {
            try {
                await api.deleteUserTemplate(user.id, templateId);
                showNotification(`Template "${templateName}" deleted successfully!`, 'success');
                // Refresh templates
                const data = await api.getTemplates(user);
                setTemplates(data);
                // Clear selection if the deleted template was selected
                if (selectedTemplate === templateId) {
                    setSelectedTemplate('');
                }
            } catch (error) {
                showNotification('Failed to delete template.', 'error');
            }
        }
    };
    
    const groupTemplates = (templateList, defaultCategory) => {
        return (templateList || []).reduce((acc, t) => {
            const category = t.category || defaultCategory;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(t);
            return acc;
        }, {});
    };

    const groupedGlobal = groupTemplates(templates.global, "Global Templates");
    const groupedUser = groupTemplates(templates.user, "My Templates");

    if (loading) {
        return <p>Loading templates...</p>;
    }

    return (
        <>
            <label htmlFor="template-select" className="block text-sm font-medium text-gray-700">Select a Template</label>
            
            {/* Global Templates */}
            {Object.keys(groupedGlobal).length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Global Templates</h4>
                    <select 
                        value={selectedTemplate}
                        onChange={(e) => handleSelect(e.target.value)} 
                        className="form-select block w-full md:w-1/2" 
                    >
                        <option value="none">-- Start Fresh (None) --</option>
                        {Object.keys(groupedGlobal).map(group => (
                            <optgroup key={group} label={`— ${group} —`}>
                                {groupedGlobal[group].map(template => (
                                    <option key={template.id} value={template.id}>{template.name}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            )}

            {/* User Templates with Delete Options */}
            {Object.keys(groupedUser).length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">My Templates</h4>
                    <div className="space-y-2">
                        {Object.keys(groupedUser).map(group => (
                            <div key={group}>
                                <h5 className="text-xs font-medium text-gray-500 mb-1">{group}</h5>
                                {groupedUser[group].map(template => (
                                    <div key={template.id} className={`flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 ${selectedTemplate === template.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                                        <button 
                                            onClick={() => handleSelect(template.id)}
                                            className={`flex-1 text-left text-sm hover:text-primary ${selectedTemplate === template.id ? 'text-primary font-medium' : 'text-gray-700'}`}
                                        >
                                            {template.name}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUserTemplate(template.id, template.name)}
                                            className="p-1 rounded-full hover:bg-red-100 text-red-600 hover:text-red-800"
                                            title="Delete template"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {Object.keys(groupedGlobal).length === 0 && Object.keys(groupedUser).length === 0 && (
                <p className="text-gray-500">No templates available.</p>
            )}

            <p className="mt-2 text-sm text-gray-500">Select a template to load pre-configured settings. You can change everything afterwards.</p>
            <div className="mt-10 flex justify-end">
                <button onClick={() => onNavigate('appearance')} className="nav-button-primary">Next: General Settings</button>
            </div>
        </>
    );
};

export default TemplateSelectSection;
