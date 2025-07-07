import React from 'react';
import { FormGroup, ToggleSwitch, FormInput, Slider, StyleButtons, NavButtons, AdvancedColorInput } from '../common';

const ContactsSection = ({ settings, onUpdate, onNavigate }) => {
    const handleSocialLinkChange = (platform, value) => {
        const newLinks = { ...settings.socialLinks, [platform]: value };
        onUpdate('socialLinks', newLinks);
    };

    return (
        <>
            <FormGroup title="Signature Options">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ToggleSwitch label="Show 'c./o. K.I.T. Group GmbH'" checked={settings.includeCoName} onChange={v => onUpdate('includeCoName', v)} />
                    <ToggleSwitch label="Show 'Association Management'" checked={settings.includeAssociation} onChange={v => onUpdate('includeAssociation', v)} />
                    <ToggleSwitch label="Show KIT Group Address" checked={settings.includeAddress} onChange={v => onUpdate('includeAddress', v)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <FormInput 
                        label="Organizing Team Name" 
                        value={settings.organizingTeamName} 
                        onChange={e => onUpdate('organizingTeamName', e.target.value)} 
                        placeholder="e.g., The Event Team"
                    />
                    <Slider label="Font Size" value={settings.teamNameFontSize} onChange={v => onUpdate('teamNameFontSize', v)} min={8} max={24} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                        <StyleButtons styles={settings.teamNameStyles} onToggle={v => onUpdate('teamNameStyles', v)} targetId="teamName" />
                    </div>
                </div>
            </FormGroup>
            <FormGroup title="Contact Methods">
                <div className="p-4 bg-gray-50/80 rounded-lg border border-gray-200/80">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <ToggleSwitch label="Show Email" checked={settings.showEmail} onChange={v => onUpdate('showEmail', v)} />
                         <ToggleSwitch label="Show Phone" checked={settings.showPhone} onChange={v => onUpdate('showPhone', v)} />
                         <ToggleSwitch label="Show Website" checked={settings.showWebsite} onChange={v => onUpdate('showWebsite', v)} />
                    </div>
                    {(settings.showEmail || settings.showPhone || settings.showWebsite) &&
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 border-t border-gray-200/80 pt-4">
                            {settings.showEmail && <FormInput label="Contact Email" value={settings.contactEmail} onChange={e => onUpdate('contactEmail', e.target.value)} onPaste={true} placeholder="info@example.com"/>}
                            {settings.showPhone && <FormInput label="Contact Phone" value={settings.contactPhone} onChange={e => onUpdate('contactPhone', e.target.value)} onPaste={true} placeholder="+1 234 567 890"/>}
                            {settings.showWebsite && <FormInput label="Website URL" value={settings.websiteUrl} onChange={e => onUpdate('websiteUrl', e.target.value)} onPaste={true} placeholder="www.example.com"/>}
                        </div>
                    }
                 </div>
            </FormGroup>
             <FormGroup title="Social Media">
                <ToggleSwitch label="Show Social Media Links" checked={settings.showSocialMedia} onChange={v => onUpdate('showSocialMedia', v)} />
                {settings.showSocialMedia && (
                    <div className="p-4 border rounded-lg bg-gray-50/80 space-y-4">
                        <FormInput label="Social Media Header" value={settings.socialTextInput} onChange={e => onUpdate('socialTextInput', e.target.value)} placeholder="Follow us" />
                        <AdvancedColorInput label="Box Background Color" value={settings.socialMediaBackgroundColor} onChange={v => onUpdate('socialMediaBackgroundColor', v)} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Slider label="Icon Size" value={settings.socialIconSize || 24} onChange={v => onUpdate('socialIconSize', v)} min={16} max={48} unit="px" />
                            <Slider label="Icon Border Radius" value={settings.socialIconBorderRadius || 0} onChange={v => onUpdate('socialIconBorderRadius', v)} min={0} max={12} unit="px" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Facebook URL" value={settings.socialLinks?.facebookUrl || ''} onChange={e => handleSocialLinkChange('facebookUrl', e.target.value)} onPaste={true} />
                            <FormInput label="X (Twitter) URL" value={settings.socialLinks?.twitterUrl || ''} onChange={e => handleSocialLinkChange('twitterUrl', e.target.value)} onPaste={true}/>
                            <FormInput label="LinkedIn URL" value={settings.socialLinks?.linkedinUrl || ''} onChange={e => handleSocialLinkChange('linkedinUrl', e.target.value)} onPaste={true}/>
                            <FormInput label="Instagram URL" value={settings.socialLinks?.instagramUrl || ''} onChange={e => handleSocialLinkChange('instagramUrl', e.target.value)} onPaste={true}/>
                            <FormInput label="YouTube URL" value={settings.socialLinks?.youtubeUrl || ''} onChange={e => handleSocialLinkChange('youtubeUrl', e.target.value)} onPaste={true}/>
                            <FormInput label="Miscellaneous URL" value={settings.socialLinks?.miscUrl || ''} onChange={e => handleSocialLinkChange('miscUrl', e.target.value)} onPaste={true} placeholder="https://example.com/other"/>
                        </div>
                    </div>
                )}
            </FormGroup>
            <NavButtons onPrev={() => onNavigate('images')} onNext={() => onNavigate('generate')} />
        </>
    );
};
export default ContactsSection;
