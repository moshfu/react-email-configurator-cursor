import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth/AuthContext';
import { useConfiguratorState } from './hooks/useConfiguratorState';
import { loadGoogleFont } from './utils/fontLoader';
import { api } from './api/api';

import {
    Sidebar, Section, UndoIcon, RedoIcon
} from './components/common';
import { ProfileModal } from './components/common/ProfileModal';

import { AdminPanel } from './components/admin/AdminPanel';
import TemplateSelectSection from './components/configurator/TemplateSelectSection';

import AppearanceSection from './components/configurator/AppearanceSection';
import ContentSection from './components/configurator/ContentSection';
import CtaButtonSection from './components/configurator/CtaButtonSection';
import WalletSection from './components/configurator/WalletSection';
import ImagesSection from './components/configurator/ImagesSection';
import ContactsSection from './components/configurator/ContactsSection';
import GenerateSection from './components/configurator/GenerateSection';

const PlaceholderEditorBar = ({ onSave, onExit }) => (
    <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-black p-3 text-center z-50 shadow-lg flex justify-between items-center px-8">
        <p className="font-semibold">
            <span className="font-bold">Default Settings Editor Mode:</span> Any changes you make will become the new defaults for all users.
        </p>
        <div>
            <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4">
                Save Placeholders
            </button>
            <button onClick={onExit} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Exit Editor Mode
            </button>
        </div>
    </div>
);

export function Configurator() {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('templateSelect');
    const [notification, setNotification] = useState('');
    const { settings, setSettings, resetState, undo, redo, canUndo, canRedo } = useConfiguratorState();
    
    const urlParams = new URLSearchParams(window.location.search);
    const isEditorMode = urlParams.get('mode') === 'placeholder_editor';

    const [isAdminPanelVisible, setAdminPanelVisible] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                if (user?.role === 'admin') {
                    e.preventDefault();
                    setAdminPanelVisible(v => !v);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [user]);

    const handleNavigate = (sectionKey) => {
        setActiveSection(sectionKey);
        window.scrollTo(0, 0);
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(''), 3000);
    };

    const updateSetting = useCallback((key, value) => {
        if (key === null) {
          setSettings(value);
        } else {
          setSettings(prev => ({ ...prev, [key]: value }));
        }
    }, [setSettings]);

    useEffect(() => {
        if (settings?.templateFontFamily) {
            loadGoogleFont(settings.templateFontFamily);
        }
    }, [settings?.templateFontFamily]);
    

    
    const handleSavePlaceholders = async () => {
        const currentGlobalSettings = await api.getGlobalSettings();
        const newPlaceholders = {
            ...currentGlobalSettings.placeholders,
            // Basic text fields
            salutation: settings.salutationInput,
            eventAbbreviation: settings.eventAbbreviation,
            teamName: settings.organizingTeamName,
            banners: settings.banners,
            includeTopPadding: settings.includeTopPadding,
            topPaddingHeight: settings.topPaddingHeight,
            topPaddingBackgroundColor: settings.topPaddingBackgroundColor,
            topPaddingTextColor: settings.topPaddingTextColor,
            topPaddingText: settings.topPaddingText,
            socialTextInput: settings.socialTextInput,
            contactEmail: settings.contactEmail,
            contactPhone: settings.contactPhone,
            websiteUrl: settings.websiteUrl,
            // Additional default values
            copyrightYear: settings.copyrightYear,
            bodyBackgroundColor: settings.bodyBackgroundColor,
            bodyTextColor: settings.bodyTextColor,
            linkColor: settings.linkColor,
            dividerColor: settings.dividerColor,
            footerBackgroundColor: settings.footerBackgroundColor,
            footerTextColor: settings.footerTextColor,
            templateFontFamily: settings.templateFontFamily,
            bodyFontSize: settings.bodyFontSize,
            paragraphLineHeight: settings.paragraphLineHeight,
            tableBorderRadius: settings.tableBorderRadius,
            salutationFontSize: settings.salutationFontSize,
            salutationStyles: settings.salutationStyles,
            teamNameFontSize: settings.teamNameFontSize,
            teamNameStyles: settings.teamNameStyles,
            footerFontSize: settings.footerFontSize,
            footerStyles: settings.footerStyles,
            footerPadding: settings.footerPadding,
            footerBorderRadius: settings.footerBorderRadius,
                    lineWidth: settings.lineWidth,
            socialMediaBackgroundColor: settings.socialMediaBackgroundColor,
            walletBackgroundColor: settings.walletBackgroundColor,
            walletIntroText: settings.walletIntroText,
            walletIntroFontSize: settings.walletIntroFontSize,
            walletIntroStyles: settings.walletIntroStyles,
            walletInstructionsText: settings.walletInstructionsText,
            walletInstructionsFontSize: settings.walletInstructionsFontSize,
            walletInstructionsStyles: settings.walletInstructionsStyles,
            walletPlacement: settings.walletPlacement,
        };

        // Update global settings
        await api.updateGlobalSettings({ ...currentGlobalSettings, placeholders: newPlaceholders });
        
        // Also update the standard template to ensure new users get the updated placeholders
        const templates = await api.getTemplates(user);
        const standardTemplate = templates.global.find(t => t.id === 'standard-template-id');
        if (standardTemplate) {
            const updatedTemplate = {
                ...standardTemplate,
                salutationInput: settings.salutationInput,
                eventAbbreviation: settings.eventAbbreviation,
                organizingTeamName: settings.organizingTeamName,
                banners: settings.banners,
                includeTopPadding: settings.includeTopPadding,
                topPaddingHeight: settings.topPaddingHeight,
                topPaddingBackgroundColor: settings.topPaddingBackgroundColor,
                topPaddingTextColor: settings.topPaddingTextColor,
                topPaddingText: settings.topPaddingText,
                socialTextInput: settings.socialTextInput,
                contactEmail: settings.contactEmail,
                contactPhone: settings.contactPhone,
                websiteUrl: settings.websiteUrl,
            };
            await api.updateGlobalTemplate(updatedTemplate);
        }
        
        // Clear session storage to ensure users get fresh data on next login
        sessionStorage.removeItem('currentConfig');
        
        showNotification('Default placeholders have been updated!', 'success');
    };

    const handleExitEditorMode = () => {
        window.location.search = '';
    };

    if (!settings) {
        return <div className="flex items-center justify-center h-screen bg-gray-100"><p>Loading configurator...</p></div>;
    }

    const sections = [
        { key: 'templateSelect', title: 'Template Selection', description: 'Choose a template to start with.', Component: TemplateSelectSection, props: { onNavigate: handleNavigate, showNotification } },
        { key: 'appearance', title: 'Appearance', description: 'Customize the visual style of your email template.', Component: AppearanceSection },
        { key: 'content', title: 'Content & Text', description: 'Configure the salutation, signature, and dynamic content sections.', Component: ContentSection },
        { key: 'ctaButtons', title: 'CTA Buttons', description: 'Add and customize call-to-action buttons.', Component: CtaButtonSection },
        { key: 'wallet', title: 'Wallet Customization', description: 'Settings for Apple & Google Wallet buttons.', Component: WalletSection, hidden: !settings.includeWalletButtons },
        { key: 'images', title: 'Layout & Media', description: 'Configure layout options, header/footer areas, and banner images.', Component: ImagesSection },
        { key: 'contacts', title: 'Contact Information', description: 'Configure contact details and social media links.', Component: ContactsSection },
        { key: 'generate', title: 'Generate HTML', description: 'Review your settings and generate the final HTML.', Component: GenerateSection, props: { onNavigate: handleNavigate, showNotification, onUpdate: updateSetting } },
    ];

    return (
        <div className={`bg-gray-100 min-h-screen font-sans text-gray-800 ${isAdminPanelVisible ? 'overflow-hidden h-screen' : ''} ${isEditorMode ? 'pt-20' : ''}`}>
            {isEditorMode && <PlaceholderEditorBar onSave={handleSavePlaceholders} onExit={handleExitEditorMode} />}
            
            {notification && (
                <div className={`fixed bottom-5 right-5 ${notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white px-5 py-3 rounded-lg shadow-lg z-[60] animate-fadeIn`}>
                    {notification.message}
                </div>
            )}
            {isAdminPanelVisible && user.role === 'admin' && <AdminPanel onClose={() => setAdminPanelVisible(false)} currentSettings={settings} showNotification={showNotification} />}
            {isProfileModalVisible && <ProfileModal onClose={() => setIsProfileModalVisible(false)} />}
      
            <div className="flex">
                <Sidebar 
                    activeSection={activeSection} 
                    onNavigate={handleNavigate} 
                    showWallet={settings.includeWalletButtons} 
                    logout={logout}
                    clearConfig={() => resetState()}
                    onProfileClick={() => setIsProfileModalVisible(true)}
                />
                <main className="flex-1 ml-80 p-8">
                    <div className="fixed top-4 right-8 z-20 flex gap-2">
                        <button onClick={undo} disabled={!canUndo} className="history-btn"><UndoIcon /> Undo</button>
                        <button onClick={redo} disabled={!canRedo} className="history-btn"><RedoIcon /> Redo</button>
                    </div>
                    <div className="mt-12">
                        {sections.filter(s => !s.hidden).map(({ key, title, description, Component, props }) => (
                            <Section key={key} title={title} description={description} isActive={activeSection === key}>
                                <Component settings={settings} onUpdate={updateSetting} onNavigate={handleNavigate} showNotification={showNotification} {...props} />
                            </Section>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
