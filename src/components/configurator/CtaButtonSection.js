import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormGroup, FormInput, Slider, AdvancedColorInput, TrashIcon, ChevronUpIcon, ChevronDownIcon, NavButtons } from '../common';

const CtaButtonSection = ({ settings, onUpdate, onNavigate }) => {
    const updateButton = (index, field, value) => {
        const newButtons = [...settings.ctaButtons];
        newButtons[index] = { ...newButtons[index], [field]: value };
        onUpdate('ctaButtons', newButtons);
    };

    const addButton = () => {
        const newButton = {
            id: uuidv4(),
            text: 'Click Here',
            url: 'https://example.com',
            backgroundColor: '#00519e',
            textColor: '#ffffff',
            fontSize: 14,
            paddingX: 20,
            paddingY: 10,
            borderRadius: 5,
            placement: 'after-intro'
        };
        onUpdate('ctaButtons', [...(settings.ctaButtons || []), newButton]);
    };

    const removeButton = (index) => {
        onUpdate('ctaButtons', settings.ctaButtons.filter((_, i) => i !== index));
    };
    
    const reorderButton = (index, direction) => {
        const buttons = [...settings.ctaButtons];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= buttons.length) return;
        [buttons[index], buttons[newIndex]] = [buttons[newIndex], buttons[index]];
        onUpdate('ctaButtons', buttons);
    };

    const placementOptions = [
        { value: 'after-salutation', label: 'After Salutation' },
        { value: 'after-intro', label: 'After Intro Paragraph' },
        ...(settings.sectionTitles || []).map((sec, i) => ({
            value: `after-section-${i}`,
            label: `After "${sec.text.substring(0, 20)}..."`
        })),
        { value: 'before-signature', label: 'Before Signature' }
    ];

    return (
        <>
            <FormGroup title="Call-to-Action Buttons">
                <div className="space-y-4">
                    {(settings.ctaButtons || []).map((button, index) => (
                        <div key={button.id} className="p-4 border rounded-lg bg-white space-y-4 relative">
                            <div className="absolute top-3 right-3 flex gap-1">
                                <button onClick={() => reorderButton(index, 'up')} disabled={index === 0} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronUpIcon /></button>
                                <button onClick={() => reorderButton(index, 'down')} disabled={index === settings.ctaButtons.length - 1} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDownIcon /></button>
                                <button onClick={() => removeButton(index)} className="p-1 rounded-full hover:bg-red-100"><TrashIcon /></button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormInput label="Button Text" value={button.text} onChange={e => updateButton(index, 'text', e.target.value)} placeholder="Click Here"/>
                                <FormInput label="URL" value={button.url} onChange={e => updateButton(index, 'url', e.target.value)} placeholder="https://example.com"/>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                                    <select value={button.placement} onChange={e => updateButton(index, 'placement', e.target.value)} className="form-select block w-full">
                                        {placementOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AdvancedColorInput label="Background Color" value={button.backgroundColor} onChange={v => updateButton(index, 'backgroundColor', v)} />
                                <AdvancedColorInput label="Text Color" value={button.textColor} onChange={v => updateButton(index, 'textColor', v)} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Slider label="Font Size" value={button.fontSize} onChange={v => updateButton(index, 'fontSize', v)} min={10} max={24} />
                                <Slider label="X Padding" value={button.paddingX} onChange={v => updateButton(index, 'paddingX', v)} min={10} max={50} />
                                <Slider label="Y Padding" value={button.paddingY} onChange={v => updateButton(index, 'paddingY', v)} min={5} max={30} />
                                <Slider label="Border Radius" value={button.borderRadius} onChange={v => updateButton(index, 'borderRadius', v)} min={0} max={20} />
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addButton} className="mt-4 text-sm font-semibold text-primary hover:text-blue-800">
                    + Add CTA Button
                </button>
            </FormGroup>
            <NavButtons onPrev={() => onNavigate('content')} onNext={() => onNavigate(settings.includeWalletButtons ? 'wallet' : 'images')} />
        </>
    );
};
export default CtaButtonSection;


