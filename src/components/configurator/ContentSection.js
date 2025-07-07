import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormGroup, FormInput, Slider, StyleButtons, AdvancedColorInput, TrashIcon, ChevronUpIcon, ChevronDownIcon, ToggleSwitch, NavButtons } from '../common';

const ContentSection = ({ settings, onUpdate, onNavigate }) => {
    const updateListItem = (listName, index, field, value) => {
        const newList = [...settings[listName]];
        newList[index] = { ...newList[index], [field]: value };
        onUpdate(listName, newList);
    };

    const addListItem = (listName, newItem) => {
        onUpdate(listName, [...(settings[listName] || []), newItem]);
    };

    const removeListItem = (listName, index) => {
        onUpdate(listName, settings[listName].filter((_, i) => i !== index));
    };
    
    const reorderListItem = (listName, index, direction) => {
        const list = [...settings[listName]];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= list.length) return;
        [list[index], list[newIndex]] = [list[newIndex], list[index]];
        onUpdate(listName, list);
    };

    return (
        <>
            <FormGroup title="Display Options">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch label="Show Wallet Buttons" checked={settings.includeWalletButtons} onChange={v => onUpdate('includeWalletButtons', v)} tooltip="Shows Apple & Google Wallet buttons."/>
                </div>
            </FormGroup>

            <FormGroup title="Salutation">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <FormInput label="Salutation Text" value={settings.salutationInput} onChange={e => onUpdate('salutationInput', e.target.value)} placeholder="Dear Attendee,"/>
                    <Slider label="Font Size" value={settings.salutationFontSize} onChange={v => onUpdate('salutationFontSize', v)} min={10} max={36} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                        <StyleButtons styles={settings.salutationStyles} onToggle={v => onUpdate('salutationStyles', v)} targetId="salutation" />
                    </div>
                </div>
            </FormGroup>
            
            <FormGroup title="Section Titles">
                <div className="space-y-4">
                    {(settings.sectionTitles || []).map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-lg bg-white space-y-4 relative">
                            <div className="absolute top-3 right-3 flex gap-1">
                                <button onClick={() => reorderListItem('sectionTitles', index, 'up')} disabled={index === 0} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronUpIcon /></button>
                                <button onClick={() => reorderListItem('sectionTitles', index, 'down')} disabled={index === settings.sectionTitles.length - 1} className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDownIcon /></button>
                                <button onClick={() => removeListItem('sectionTitles', index)} className="p-1 rounded-full hover:bg-red-100"><TrashIcon /></button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput label="Title Text" value={item.text} onChange={e => updateListItem('sectionTitles', index, 'text', e.target.value)} placeholder="Section Title"/>
                                <AdvancedColorInput label="Title Color" value={item.color} onChange={v => updateListItem('sectionTitles', index, 'color', v)} />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <Slider label="Font Size" value={item.fontSize} onChange={v => updateListItem('sectionTitles', index, 'fontSize', v)} min={12} max={48} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                                    <StyleButtons styles={item.styles} onToggle={v => updateListItem('sectionTitles', index, 'styles', v)} targetId={`section-${item.id}`} />
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => addListItem('sectionTitles', { id: uuidv4(), text: 'New Section', color: settings.linkColor, fontSize: 18, styles: ['bold'] })} className="mt-4 text-sm font-semibold text-primary hover:text-blue-800">
                    + Add Section Title
                </button>
            </FormGroup>
            
            <NavButtons onPrev={() => onNavigate('appearance')} onNext={() => onNavigate('ctaButtons')} />
        </>
    );
};
export default ContentSection;
