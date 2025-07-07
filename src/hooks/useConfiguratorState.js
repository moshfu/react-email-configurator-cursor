import { useState, useReducer, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { useAuth } from '../auth/AuthContext';

const historyReducer = (state, action) => {
  const { past, present, future } = state;
  switch (action.type) {
    case 'SET_STATE':
      if (JSON.stringify(action.payload) === JSON.stringify(present)) return state;
      return { past: [...past, present], present: action.payload, future: [] };
    case 'UNDO':
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      return { past: past.slice(0, past.length - 1), present: previous, future: [present, ...future] };
    case 'REDO':
      if (future.length === 0) return state;
      const next = future[0];
      return { past: [...past, present], present: next, future: future.slice(1) };
    case 'RESET':
      return { past: [], present: action.payload || {}, future: [] }; 
    default:
      return state;
  }
};

export const useConfiguratorState = () => {
    const { user } = useAuth();
    const [initialState, setInitialState] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!user) {
                return; 
            }

            const savedConfig = sessionStorage.getItem('currentConfig');
            if (savedConfig) {
                try {
                    setInitialState(JSON.parse(savedConfig));
                    return;
                } catch (e) {
                    console.error("Could not parse saved config, clearing it.", e);
                    sessionStorage.removeItem('currentConfig');
                }
            }
            
            // Load global settings (templates not needed for default template)
            const globalSettings = await api.getGlobalSettings();
            
            // Create a default "none" template with all toggles off
            const defaultTemplate = {
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
                outerBorderColor: '#e5e7eb',
                banners: [],
                includeTopPadding: false,
                topPaddingHeight: 20,
                topPaddingBackgroundColor: '#f5f5f5',
                topPaddingTextColor: '#555555',
                topPaddingText: '',
                includeFooter: true,
                footerText: '',
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
            
            // Merge global settings placeholders with the default template
            const mergedTemplate = {
                ...defaultTemplate,
                // Override template placeholders with global settings if they exist
                salutationInput: globalSettings.placeholders?.salutation || defaultTemplate.salutationInput,
                eventAbbreviation: globalSettings.placeholders?.eventAbbreviation || defaultTemplate.eventAbbreviation,
                organizingTeamName: globalSettings.placeholders?.teamName || defaultTemplate.organizingTeamName,
                bannerImageAltText: globalSettings.placeholders?.bannerImageAltText || defaultTemplate.bannerImageAltText,
                socialTextInput: globalSettings.placeholders?.socialTextInput || defaultTemplate.socialTextInput,
                contactEmail: globalSettings.placeholders?.contactEmail || defaultTemplate.contactEmail,
                contactPhone: globalSettings.placeholders?.contactPhone || defaultTemplate.contactPhone,
                websiteUrl: globalSettings.placeholders?.websiteUrl || defaultTemplate.websiteUrl,
                // Additional fields from global settings
                copyrightYear: globalSettings.placeholders?.copyrightYear || defaultTemplate.copyrightYear,
                bodyBackgroundColor: globalSettings.placeholders?.bodyBackgroundColor || defaultTemplate.bodyBackgroundColor,
                bodyTextColor: globalSettings.placeholders?.bodyTextColor || defaultTemplate.bodyTextColor,
                linkColor: globalSettings.placeholders?.linkColor || defaultTemplate.linkColor,
                dividerColor: globalSettings.placeholders?.dividerColor || defaultTemplate.dividerColor,
                footerBackgroundColor: globalSettings.placeholders?.footerBackgroundColor || defaultTemplate.footerBackgroundColor,
                footerTextColor: globalSettings.placeholders?.footerTextColor || defaultTemplate.footerTextColor,
                templateFontFamily: globalSettings.placeholders?.templateFontFamily || defaultTemplate.templateFontFamily,
                bodyFontSize: globalSettings.placeholders?.bodyFontSize || defaultTemplate.bodyFontSize,
                paragraphLineHeight: globalSettings.placeholders?.paragraphLineHeight || defaultTemplate.paragraphLineHeight,
                tableBorderRadius: globalSettings.placeholders?.tableBorderRadius || defaultTemplate.tableBorderRadius,
                salutationFontSize: globalSettings.placeholders?.salutationFontSize || defaultTemplate.salutationFontSize,
                salutationStyles: globalSettings.placeholders?.salutationStyles || defaultTemplate.salutationStyles,
                teamNameFontSize: globalSettings.placeholders?.teamNameFontSize || defaultTemplate.teamNameFontSize,
                teamNameStyles: globalSettings.placeholders?.teamNameStyles || defaultTemplate.teamNameStyles,
                footerFontSize: globalSettings.placeholders?.footerFontSize || defaultTemplate.footerFontSize,
                footerStyles: globalSettings.placeholders?.footerStyles || defaultTemplate.footerStyles,
                footerPadding: globalSettings.placeholders?.footerPadding || defaultTemplate.footerPadding,
                footerBorderRadius: globalSettings.placeholders?.footerBorderRadius || defaultTemplate.footerBorderRadius,
                lineWidth: globalSettings.defaults?.lineWidth || defaultTemplate.lineWidth,
                outerBorderColor: globalSettings.defaults?.outerBorderColor || defaultTemplate.outerBorderColor,
                banners: defaultTemplate.banners,
                includeTopPadding: defaultTemplate.includeTopPadding,
                topPaddingHeight: defaultTemplate.topPaddingHeight,
                topPaddingBackgroundColor: defaultTemplate.topPaddingBackgroundColor,
                topPaddingTextColor: defaultTemplate.topPaddingTextColor,
                topPaddingText: defaultTemplate.topPaddingText,
                includeFooter: defaultTemplate.includeFooter,
                footerText: defaultTemplate.footerText,
                socialMediaBackgroundColor: globalSettings.placeholders?.socialMediaBackgroundColor || defaultTemplate.socialMediaBackgroundColor,
                walletBackgroundColor: globalSettings.placeholders?.walletBackgroundColor || defaultTemplate.walletBackgroundColor,
                walletIntroText: globalSettings.placeholders?.walletIntroText || defaultTemplate.walletIntroText,
                walletIntroFontSize: globalSettings.placeholders?.walletIntroFontSize || defaultTemplate.walletIntroFontSize,
                walletIntroStyles: globalSettings.placeholders?.walletIntroStyles || defaultTemplate.walletIntroStyles,
                walletInstructionsText: globalSettings.placeholders?.walletInstructionsText || defaultTemplate.walletInstructionsText,
                walletInstructionsFontSize: globalSettings.placeholders?.walletInstructionsFontSize || defaultTemplate.walletInstructionsFontSize,
                walletInstructionsStyles: globalSettings.placeholders?.walletInstructionsStyles || defaultTemplate.walletInstructionsStyles,
                walletPlacement: globalSettings.placeholders?.walletPlacement || defaultTemplate.walletPlacement,
            };
            
            setInitialState(mergedTemplate);
        };

        loadInitialData();
    }, [user]);

    const [state, dispatch] = useReducer(historyReducer, {
        past: [],
        present: initialState,
        future: [],
    });

    useEffect(() => {
        if (initialState) {
            dispatch({ type: 'RESET', payload: initialState });
        }
    }, [initialState]);
    
    useEffect(() => {
        if (state.present) {
            sessionStorage.setItem('currentConfig', JSON.stringify(state.present));
        }
    }, [state.present]);

    const setSettings = useCallback((newSettings) => {
        const payload = typeof newSettings === 'function' ? newSettings(state.present) : newSettings;
        dispatch({ type: 'SET_STATE', payload });
    }, [state.present]);

    const resetState = useCallback((newState) => {
        dispatch({ type: 'RESET', payload: newState || initialState });
    }, [initialState]);

    const undo = () => dispatch({ type: 'UNDO' });
    const redo = () => dispatch({ type: 'REDO' });

    return {
        settings: state.present,
        setSettings,
        resetState,
        undo,
        redo,
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
    };
};
