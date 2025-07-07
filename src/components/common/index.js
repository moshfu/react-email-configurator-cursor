import React, { useState, useEffect, useMemo } from 'react';

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLowerCase();
};

export const UndoIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M3 10h10a5 5 0 0 1 5 5v3M3 10l6-6M3 10l6 6"/></svg>;
export const RedoIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 10H11a5 5 0 0 0-5 5v3M21 10l-6-6M21 10l-6 6"/></svg>;
export const CopyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
export const DownloadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;

export const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-500 hover:text-red-600 transition-colors"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
export const PasteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
export const CheckIcon = () => <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
export const ChevronUpIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>;
export const ChevronDownIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
export const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
export const ClearIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.512 10.488A9 9 0 1010.488 19.512M19.512 10.488L10.488 19.512m9.024-9.024a9 9 0 00-12.76 0M3.488 13.512a9 9 0 0012.76 0" /></svg>;
export const ProfileIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;


export const Logo = () => (
    <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" rx="22" fill="var(--primary-color)" />
                <text x="50" y="55" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="52" fontWeight="bold">R</text>
                <circle cx="80" cy="20" r="10" fill="var(--accent-color)" />
            </svg>
        </div>
        <div className="flex flex-col leading-tight">
            <span className="font-bold text-lg text-gray-800">REACT</span>
            <span className="text-sm text-gray-500">Email Configurator</span>
        </div>
    </div>
);

export const Sidebar = ({ activeSection, onNavigate, showWallet, logout, clearConfig, onProfileClick }) => {
  const navItems = [
    { key: 'templateSelect', label: 'Templates' },
    { key: 'appearance', label: 'Appearance' },
    { key: 'content', label: 'Content & Text' },
    { key: 'ctaButtons', label: 'CTA Buttons' },
    { key: 'wallet', label: 'Wallet Customization', hidden: !showWallet },
    { key: 'images', label: 'Layout & Media' },
    { key: 'contacts', label: 'Contact Information' },
    { key: 'generate', label: 'Generate HTML' },
  ];

  return (
    <aside className="w-80 bg-white border-r border-gray-200/80 h-screen fixed top-0 left-0 flex flex-col">
      <div className="p-4 border-b border-gray-200/80 h-[72px] flex items-center">
        <Logo />
      </div>
      <nav className="p-2 flex-grow overflow-y-auto">
        <ul>
          {navItems.filter(item => !item.hidden).map(({ key, label }) => (
            <li key={key} onClick={() => onNavigate(key)} className={`px-3 py-2.5 my-1 rounded-md text-sm font-medium cursor-pointer transition-colors ${activeSection === key ? 'bg-blue-50 text-primary' : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}`}>
              {label}
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200/80 space-y-3">
            <button onClick={onProfileClick} className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-2 rounded-md bg-gray-100 hover:bg-blue-50">
                <ProfileIcon /> My Profile
            </button>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors py-2 rounded-md bg-gray-100 hover:bg-blue-50">
                <LogoutIcon /> Logout
            </button>
            <button onClick={() => { if(window.confirm('Are you sure you want to clear all settings and start over? This cannot be undone.')) clearConfig(); }} className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors py-2 rounded-md bg-gray-100 hover:bg-red-50">
                <ClearIcon /> Clear All
            </button>
        <div className="text-xs text-center text-gray-400 mt-2">
            <p>K.I.T. Group GmbH</p>
            <p>© 2025</p>
        </div>
      </div>
    </aside>
  );
};

export const Section = ({ title, description, isActive, children }) => {
    if (!isActive) return null;
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-gray-500 mb-8">{description}</p>
            <div className="space-y-8">{children}</div>
        </div>
    );
};

export const FormGroup = ({ title, children, className }) => (
    <div className={className}>
        {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
        <div className="space-y-6">{children}</div>
    </div>
);

export const NavButtons = ({ onPrev, onNext, prevLabel = "Previous", nextLabel = "Next" }) => (
    <div className="mt-10 flex justify-between">
        <button onClick={onPrev} className="nav-button-secondary">{prevLabel}</button>
        <button onClick={onNext} className="nav-button-primary">{nextLabel}</button>
    </div>
);

export const ToggleSwitch = ({ label, checked, onChange, tooltip }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-lg border border-gray-200/80">
        <label className="text-sm font-medium text-gray-800 flex items-center">
            {label}
            {tooltip && (
                <span className="ml-2 text-gray-400 cursor-help relative group">?
                    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">{tooltip}</span>
                </span>
            )}
        </label>
        <button type="button" onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-300'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const PasteButton = ({ onPaste }) => (
    <button type="button" onClick={onPaste} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
        <PasteIcon />
    </button>
);

export const FormInput = ({ label, value, onChange, placeholder, helpText, type = "text", onPaste, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (onChange) {
                onChange({ target: { value: text } });
            }
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    };
    
    const showPlaceholder = !isFocused && !value;

    return (
        <div className="relative">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <div className="relative">
                <span 
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity duration-300 pointer-events-none ${showPlaceholder ? 'opacity-100' : 'opacity-0'}`}
                >
                    {placeholder}
                </span>
                <input 
                    value={value || ''}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={onChange} 
                    type={type} 
                    className="form-input bg-transparent" 
                    {...props}
                />
                {onPaste && <PasteButton onPaste={handlePaste} />}
            </div>
            {helpText && <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>}
        </div>
    );
};

export const FormSelect = ({ label, value, onChange, children, helpText, ...props }) => {
    return (
        <div className="relative">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
            <select
                value={value || ''}
                onChange={onChange}
                className="form-select"
                {...props}
            >
                {children}
            </select>
            {helpText && <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>}
        </div>
    );
};

export const AdvancedColorInput = ({ label, value, onChange }) => {
    const [rgb, setRgb] = useState(hexToRgb(value) || { r: 0, g: 0, b: 0 });

    useEffect(() => {
        setRgb(hexToRgb(value) || { r: 0, g: 0, b: 0 });
    }, [value]);

    const handleHexChange = (e) => {
        onChange(e.target.value);
    };

    const handleRgbChange = (color, val) => {
        const newRgb = { ...rgb, [color]: parseInt(val) || 0 };
        setRgb(newRgb);
        onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <div className="flex items-center gap-2 p-2 border border-gray-200/80 rounded-lg bg-gray-50/30">
                <input type="color" value={value} onChange={handleHexChange} className="p-0 w-10 h-10 border border-gray-300 rounded-md cursor-pointer bg-transparent"/>
                <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">HEX</span>
                    <input type="text" value={value} onChange={handleHexChange} className="form-input w-28 pl-9 text-center"/>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400 ml-2">RGB</span>
                    {['r', 'g', 'b'].map(c => (
                         <input key={c} type="number" min="0" max="255" value={rgb[c]} onChange={(e) => handleRgbChange(c, e.target.value)} className="form-input w-20 text-center" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Slider = ({ label, value, onChange, min, max, step = 1, unit = 'px' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <div className="flex items-center gap-3">
            <input 
               type="range" min={min} max={max} step={step} value={value} 
               onChange={e => onChange(parseFloat(e.target.value))} 
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
               style={{'--slider-value': `${((value-min)/(max-min))*100}%`}}
            />
            <div className="relative">
                <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value))} className="w-20 text-center pl-2 pr-7 py-1.5 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{unit}</span>
            </div>
        </div>
    </div>
);

export const StyleButtons = ({ styles = [], onToggle, targetId }) => {
    const handleToggle = (style) => {
        const currentStyles = styles || []; 
        let newStyles;

        if (style === 'normal') {
            newStyles = ['normal'];
        } else {
            newStyles = currentStyles.includes('normal') ? [] : [...currentStyles];
            if (newStyles.includes(style)) {
                newStyles = newStyles.filter(s => s !== style);
            } else {
                newStyles.push(style);
            }
            if (newStyles.length === 0) newStyles = ['normal'];
        }
        onToggle(newStyles);
    };

    return (
        <div className="flex bg-gray-100/80 p-1 rounded-lg w-max">
            {['bold', 'italic', 'underline', 'normal'].map(style => (
                <button 
                   key={`${targetId}-${style}`} 
                   onClick={() => handleToggle(style)} 
                   className={`w-9 h-9 border-transparent rounded-md flex items-center justify-center transition-all duration-200 ${(styles || []).includes(style) ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-gray-600 hover:bg-white/60'}`}
                 >
                     {style === 'bold' && <span className="font-bold">B</span>}
                     {style === 'italic' && <i className="font-serif text-lg">I</i>}
                     {style === 'underline' && <u className="font-serif">U</u>}
                     {style === 'normal' && <span className="text-xs">N</span>}
                 </button>
             ))}
         </div>
     );
 };

 export const FontFamilySelector = ({ value, onChange }) => {
     const [searchTerm, setSearchTerm] = useState('');
     const fontFamilies = useMemo(() => ({
         'Sans-Serif': ['Arial', 'Helvetica', 'Verdana', 'Calibri', 'Segoe UI', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Nunito', 'Inter', 'Poppins', 'Source Sans Pro'],
         'Serif': ['Times New Roman', 'Georgia', 'Garamond', 'Playfair Display', 'Merriweather', 'PT Serif', 'Lora', 'Domine', 'EB Garamond'],
         'Monospace': ['Courier New', 'Lucida Console', 'Fira Code', 'Roboto Mono', 'Source Code Pro', 'Inconsolata'],
         'Display': ['Oswald', 'Raleway', 'Lobster', 'Pacifico']
     }), []);

     const filteredFonts = useMemo(() => {
         if (!searchTerm) return fontFamilies;
         const lowerSearch = searchTerm.toLowerCase();
         const filtered = {};
         for (const group in fontFamilies) {
             const fonts = fontFamilies[group].filter(font => font.toLowerCase().includes(lowerSearch));
             if (fonts.length > 0) {
                 filtered[group] = fonts;
             }
         }
         return filtered;
     }, [searchTerm, fontFamilies]);

     return (
         <div>
             <label className="block text-sm font-medium text-gray-700 mb-1.5">Font Family</label>
             <input
                 type="text"
                 placeholder="Search fonts..."
                 className="form-input mb-2"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
             />
             <select value={value} onChange={onChange} className="form-select">
                 {Object.entries(filteredFonts).map(([group, fonts]) => (
                     <optgroup key={group} label={group}>
                         {fonts.map(font => (
                             <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                         ))}
                     </optgroup>
                 ))}
             </select>
         </div>
     )
 };

 export const PreviewToggle = ({ view, setView }) => (
     <div className="flex bg-gray-200 p-1 rounded-lg">
         <button onClick={() => setView('desktop')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'desktop' ? 'bg-white text-primary shadow' : 'text-gray-600'}`}>
             Desktop
         </button>
         <button onClick={() => setView('mobile')} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'mobile' ? 'bg-white text-primary shadow' : 'text-gray-600'}`}>
             Mobile
         </button>
     </div>
 );