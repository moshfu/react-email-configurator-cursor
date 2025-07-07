import React from 'react';
import { FormGroup, AdvancedColorInput, Slider, FontFamilySelector, NavButtons } from '../common';

const AppearanceSection = ({ settings, onUpdate, onNavigate }) => (
    <>
        <FormGroup title="Colors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <AdvancedColorInput label="Body Background" value={settings.bodyBackgroundColor} onChange={v => onUpdate('bodyBackgroundColor', v)} />
                <AdvancedColorInput label="Default Text" value={settings.bodyTextColor} onChange={v => onUpdate('bodyTextColor', v)} />
                <AdvancedColorInput label="Link Color" value={settings.linkColor} onChange={v => onUpdate('linkColor', v)} />
                <AdvancedColorInput label="Divider Line" value={settings.dividerColor} onChange={v => onUpdate('dividerColor', v)} />
            </div>
        </FormGroup>
         <FormGroup title="Fonts & Spacing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                 <FontFamilySelector value={settings.templateFontFamily} onChange={e => onUpdate('templateFontFamily', e.target.value)} />
                <Slider label="Default Font Size" value={settings.bodyFontSize} onChange={v => onUpdate('bodyFontSize', v)} min={8} max={24} />
                <Slider label="Line Height" value={settings.paragraphLineHeight} onChange={v => onUpdate('paragraphLineHeight', v)} min={1} max={3} step={0.1} unit="" />
                <Slider label="Container Radius" value={settings.tableBorderRadius} onChange={v => onUpdate('tableBorderRadius', v)} min={0} max={40} />
            </div>
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
                    tooltip="This setting controls the thickness of all lines in your email including the outer border, divider lines between sections, and underlines for section titles."
                />
            </div>
        </FormGroup>
        <NavButtons onPrev={() => onNavigate('templateSelect')} onNext={() => onNavigate('content')} />
    </>
);
export default AppearanceSection;
