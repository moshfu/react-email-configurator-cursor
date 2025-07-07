import React from 'react';
import { FormGroup, Slider, StyleButtons, AdvancedColorInput, NavButtons } from '../common';

const WalletSection = ({ settings, onUpdate, onNavigate }) => (
    <>
        <FormGroup title="Wallet Button Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdvancedColorInput label="Background Color" value={settings.walletBackgroundColor} onChange={v => onUpdate('walletBackgroundColor', v)} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                    <select value={settings.walletPlacement} onChange={e => onUpdate('walletPlacement', e.target.value)} className="form-select block w-full">
                        <option value="after-salutation">After Salutation</option>
                        <option value="after-intro">After Intro</option>
                        {(settings.sectionTitles || []).map((sec, i) => (
                            <option key={i} value={`after-section-${i}`}>After "{sec.text}"</option>
                        ))}
                        <option value="before-signature">Before Signature</option>
                    </select>
                </div>
            </div>
        </FormGroup>

        <FormGroup title="Introduction Text">
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                <textarea 
                    rows="3" 
                    value={settings.walletIntroText || ''} 
                    onChange={e => onUpdate('walletIntroText', e.target.value)} 
                    className="form-textarea"
                    placeholder="Enter introductory text..."
                />
                <p className="mt-1.5 text-xs text-gray-500">Use line breaks for new lines.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Slider label="Font Size" value={settings.walletIntroFontSize} onChange={v => onUpdate('walletIntroFontSize', v)} min={8} max={24} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                        <StyleButtons styles={settings.walletIntroStyles} onToggle={v => onUpdate('walletIntroStyles', v)} targetId="walletIntro" />
                    </div>
                </div>
            </div>
        </FormGroup>

        <FormGroup title="Instructions Text">
            <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
                <textarea 
                    rows="4" 
                    value={settings.walletInstructionsText || ''} 
                    onChange={e => onUpdate('walletInstructionsText', e.target.value)}
                    className="form-textarea"
                    placeholder="Enter instruction points..."
                />
                <p className="mt-1.5 text-xs text-gray-500">Each line will become a numbered list item.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Slider label="Font Size" value={settings.walletInstructionsFontSize} onChange={v => onUpdate('walletInstructionsFontSize', v)} min={8} max={24} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                        <StyleButtons styles={settings.walletInstructionsStyles} onToggle={v => onUpdate('walletInstructionsStyles', v)} targetId="walletInstructions" />
                    </div>
                </div>
            </div>
        </FormGroup>

        <NavButtons onPrev={() => onNavigate('ctaButtons')} onNext={() => onNavigate('images')} />
    </>
);
export default WalletSection;
