import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { FormInput } from '../common';

const GlobalSettings = ({ showNotification }) => {
    const [globalSettings, setGlobalSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const data = await api.getGlobalSettings();
            setGlobalSettings(data);
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleInputChange = (category, key, value) => {
        setGlobalSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        await api.updateGlobalSettings(globalSettings);
        setLoading(false);
        showNotification('Global settings saved!', 'success');
    };

    const openPlaceholderEditor = () => {
        window.open('/?mode=placeholder_editor', '_blank');
    };

    if (loading || !globalSettings) {
        return <p>Loading global settings...</p>;
    }

    const imageUrls = globalSettings.imageUrls || {};
    
    // Group image URLs by category
    const imageCategories = {
        'Wallet Images': {
            appleWallet: imageUrls.appleWallet,
            googleWallet: imageUrls.googleWallet
        },
        'Social Media Icons': {
            socialX: imageUrls.socialX,
            socialFacebook: imageUrls.socialFacebook,
            socialLinkedIn: imageUrls.socialLinkedIn,
            socialInstagram: imageUrls.socialInstagram,
            socialYoutube: imageUrls.socialYoutube,
            socialMisc: imageUrls.socialMisc
        },
        'Contact Icons': {
            iconEmail: imageUrls.iconEmail,
            iconPhone: imageUrls.iconPhone,
            iconWebsite: imageUrls.iconWebsite
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Default Placeholder Text</h3>
                <div className="p-4 bg-gray-50 border rounded-lg flex justify-between items-center">
                    <p className="text-gray-600">Enter the placeholder editor to change the default text content seen by users.</p>
                    <button onClick={openPlaceholderEditor} className="nav-button-secondary">Open Editor</button>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Site-wide Image URLs</h3>
                <p className="text-sm text-gray-500 -mt-4">These image URLs are used across all templates.</p>
                
                {Object.entries(imageCategories).map(([categoryName, categoryUrls]) => (
                    <div key={categoryName} className="p-4 bg-white border rounded-lg">
                        <h4 className="font-semibold mb-3">{categoryName}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {Object.entries(categoryUrls).map(([key, value]) => (
                                <FormInput
                                    key={key}
                                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    value={value}
                                    onChange={(e) => handleInputChange('imageUrls', key, e.target.value)}
                                    onPaste={true}
                                    placeholder={`URL for ${key}`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 flex justify-end">
                <button onClick={handleSave} disabled={loading} className="nav-button-primary">
                    {loading ? 'Saving...' : 'Save Site Configuration'}
                </button>
            </div>
        </div>
    );
};

export default GlobalSettings;
