import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormGroup, FormInput, ToggleSwitch, Slider, AdvancedColorInput, TrashIcon, ChevronUpIcon, ChevronDownIcon, NavButtons } from '../common';

const ImagesSection = ({ settings, onUpdate, onNavigate }) => {
    const updateBanner = (index, field, value) => {
        const newBanners = [...(settings.banners || [])];
        newBanners[index] = { ...newBanners[index], [field]: value };
        onUpdate('banners', newBanners);
    };

    const addBanner = () => {
        const currentBanners = settings.banners || [];
        const newBanner = {
            id: uuidv4(),
            url: '',
            altText: 'Banner Image',
            location: 'top', // 'top' or 'bottom'
            placement: 'after', // 'before' or 'after' (relative to header/footer)
            height: 200,
            enabled: true
        };
        onUpdate('banners', [...currentBanners, newBanner]);
    };

    const removeBanner = (index) => {
        const newBanners = (settings.banners || []).filter((_, i) => i !== index);
        onUpdate('banners', newBanners);
    };

    const reorderBanner = (index, direction) => {
        const banners = [...(settings.banners || [])];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= banners.length) return;
        [banners[index], banners[newIndex]] = [banners[newIndex], banners[index]];
        onUpdate('banners', banners);
    };

    const banners = settings.banners || [];

    return (
        <>
            <FormGroup title="Layout Options">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ToggleSwitch 
                        label="Add Outer Border" 
                        checked={settings.includeOuterBorder || false} 
                        onChange={v => onUpdate('includeOuterBorder', v)} 
                        tooltip="Adds a border around the entire email."
                    />
                    <ToggleSwitch 
                        label="Show Header Area" 
                        checked={settings.includeTopPadding || false} 
                        onChange={v => onUpdate('includeTopPadding', v)} 
                        tooltip="Adds a colored area at the top of the email (like the footer)."
                    />
                    <ToggleSwitch 
                        label="Show Footer" 
                        checked={settings.includeFooter !== false} 
                        onChange={v => onUpdate('includeFooter', v)} 
                        tooltip="Shows the footer with copyright information."
                    />
                </div>
                {settings.includeOuterBorder && (
                    <div className="mt-4">
                        <AdvancedColorInput 
                            label="Outer Border Color" 
                            value={settings.outerBorderColor || settings.footerBackgroundColor} 
                            onChange={v => onUpdate('outerBorderColor', v)} 
                        />
                    </div>
                )}
            </FormGroup>

            {settings.includeTopPadding && (
                <FormGroup title="Header Area">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Slider 
                                label="Header Area Height" 
                                value={settings.topPaddingHeight || 20} 
                                onChange={v => onUpdate('topPaddingHeight', v)} 
                                min={10} 
                                max={100} 
                                unit="px"
                            />
                            <Slider 
                                label="Header Font Size" 
                                value={settings.topPaddingFontSize || settings.footerFontSize} 
                                onChange={v => onUpdate('topPaddingFontSize', v)} 
                                min={8} 
                                max={24} 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdvancedColorInput 
                                label="Header Area Background Color" 
                                value={settings.topPaddingBackgroundColor || settings.footerBackgroundColor} 
                                onChange={v => onUpdate('topPaddingBackgroundColor', v)} 
                            />
                            <AdvancedColorInput 
                                label="Header Area Text Color" 
                                value={settings.topPaddingTextColor || settings.footerTextColor} 
                                onChange={v => onUpdate('topPaddingTextColor', v)} 
                            />
                        </div>
                        <FormInput 
                            label="Header Area Text" 
                            value={settings.topPaddingText || ''} 
                            onChange={e => onUpdate('topPaddingText', e.target.value)} 
                            placeholder="Optional text to display in the header area"
                            helpText="Leave empty for just colored area, or add text like a header."
                        />
                    </div>
                </FormGroup>
            )}

            {settings.includeFooter !== false && (
                <FormGroup title="Footer Area">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Slider 
                                label="Footer Height" 
                                value={settings.footerPadding || 20} 
                                onChange={v => onUpdate('footerPadding', v)} 
                                min={10} 
                                max={100} 
                                unit="px"
                            />
                            <Slider 
                                label="Footer Font Size" 
                                value={settings.footerFontSize} 
                                onChange={v => onUpdate('footerFontSize', v)} 
                                min={8} 
                                max={24} 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AdvancedColorInput 
                                label="Footer Background Color" 
                                value={settings.footerBackgroundColor} 
                                onChange={v => onUpdate('footerBackgroundColor', v)} 
                            />
                            <AdvancedColorInput 
                                label="Footer Text Color" 
                                value={settings.footerTextColor} 
                                onChange={v => onUpdate('footerTextColor', v)} 
                            />
                        </div>
                        <FormInput 
                            label="Footer Text" 
                            value={settings.footerText || `© ${settings.copyrightYear} ${settings.eventAbbreviation} - All rights reserved.`} 
                            onChange={e => onUpdate('footerText', e.target.value)} 
                            placeholder="Footer text content"
                            helpText="Default shows copyright info, but you can customize this text."
                        />
                    </div>
                </FormGroup>
            )}

            <FormGroup title="Banner Images">
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        <strong>Banner Placement:</strong> Choose if the banner is at the top or bottom, and if it appears before or after the header/footer area.
                    </p>
                </div>
                <div className="space-y-4">
                    {banners.map((banner, index) => (
                        <div key={banner.id} className="p-4 border rounded-lg bg-gray-50/50 space-y-4 relative">
                            <div className="absolute top-3 right-3 flex gap-1">
                                <button onClick={() => reorderBanner(index, 'up')} disabled={index === 0} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronUpIcon /></button>
                                <button onClick={() => reorderBanner(index, 'down')} disabled={index === banners.length - 1} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDownIcon /></button>
                                <button onClick={() => removeBanner(index)} className="p-1 rounded-full hover:bg-red-100"><TrashIcon /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput 
                                    label="Banner Image URL" 
                                    value={banner.url} 
                                    onChange={e => updateBanner(index, 'url', e.target.value)} 
                                    placeholder="https://example.com/banner.png" 
                                    helpText="URL of the banner image."
                                />
                                <FormInput 
                                    label="Alt Text" 
                                    value={banner.altText} 
                                    onChange={e => updateBanner(index, 'altText', e.target.value)} 
                                    placeholder="A description of the banner"
                                    helpText="Alternative text for accessibility."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <select 
                                        value={banner.location} 
                                        onChange={e => updateBanner(index, 'location', e.target.value)}
                                        className="form-select block w-full"
                                    >
                                        <option value="top">Top of Email</option>
                                        <option value="bottom">Bottom of Email</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                                    {banner.location === 'top' ? (
                                        <select value={banner.placement} onChange={e => updateBanner(index, 'placement', e.target.value)} className="form-select block w-full">
                                            <option value="before">Before Header Area</option>
                                            <option value="after">After Header Area</option>
                                        </select>
                                    ) : (
                                        <select value={banner.placement} onChange={e => updateBanner(index, 'placement', e.target.value)} className="form-select block w-full">
                                            <option value="before">Before Footer</option>
                                            <option value="after">After Footer</option>
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                                    <input 
                                        type="number" 
                                        value={banner.height} 
                                        onChange={e => updateBanner(index, 'height', parseInt(e.target.value))}
                                        min={50} 
                                        max={500} 
                                        className="form-input block w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <ToggleSwitch 
                                        label="Enable this banner" 
                                        checked={banner.enabled} 
                                        onChange={v => updateBanner(index, 'enabled', v)} 
                                    />
                                </div>
                                <span className="text-sm text-gray-500 flex-shrink-0">
                                    {banner.location === 'top' ? `Top Banner (${banner.placement === 'before' ? 'Before Header Area' : 'After Header Area'})` : `Bottom Banner (${banner.placement === 'before' ? 'Before Footer' : 'After Footer'})`}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={addBanner} 
                    className="mt-4 text-sm font-semibold text-primary hover:text-blue-800"
                >
                    + Add Banner Image
                </button>
            </FormGroup>
            <NavButtons onPrev={() => onNavigate(settings.includeWalletButtons ? 'wallet' : 'ctaButtons')} onNext={() => onNavigate('contacts')} />
        </>
    );
};

export default ImagesSection;
