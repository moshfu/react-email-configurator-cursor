import React from 'react';
import { FormGroup, ToggleSwitch, FormInput, NavButtons, Slider, AdvancedColorInput } from '../common';

const GeneralSection = ({ settings, onUpdate, onNavigate }) => (
    <>
        <FormGroup title="Display Options">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleSwitch label="Show Wallet Buttons" checked={settings.includeWalletButtons} onChange={v => onUpdate('includeWalletButtons', v)} tooltip="Shows Apple & Google Wallet buttons."/>
                <ToggleSwitch label="Add Outer Border" checked={settings.includeOuterBorder} onChange={v => onUpdate('includeOuterBorder', v)} tooltip="Adds a border around the entire email."/>
            </div>
            {settings.includeOuterBorder && (
                <div className="mt-4 space-y-4">
                    <AdvancedColorInput 
                        label="Outer Border Color" 
                        value={settings.outerBorderColor || settings.footerBackgroundColor} 
                        onChange={v => onUpdate('outerBorderColor', v)} 
                    />
                </div>
            )}
        </FormGroup>
        
        <FormGroup title="Line Widths">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Slider 
                    label="Line Width" 
                    value={settings.lineWidth || 1} 
                    onChange={v => onUpdate('lineWidth', v)} 
                    min={1} 
                    max={10} 
                    unit="px"
                    helpText="Controls the width of all lines: outer border, divider lines, and section title underlines."
                />
            </div>
        </FormGroup>

        <FormGroup title="Event Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Event Abbreviation" value={settings.eventAbbreviation} onChange={e => onUpdate('eventAbbreviation', e.target.value)} placeholder="e.g. REACT" helpText="Used in the copyright footer."/>
                <FormInput label="Copyright Year" value={settings.copyrightYear} onChange={e => onUpdate('copyrightYear', e.target.value)} type="number" placeholder="e.g. 2025"/>
            </div>
        </FormGroup>
        <NavButtons onPrev={() => onNavigate('templateSelect')} onNext={() => onNavigate('appearance')} />
    </>
);
export default GeneralSection;
