import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/api';
import { CopyIcon, DownloadIcon, CheckIcon, NavButtons, PreviewToggle } from '../common';

const applyStylesToText = (text, styles) => {
    if (!text) return '';
    if (!styles || styles.includes('normal')) return text;
    let styledText = text;
    if (styles.includes('bold')) styledText = `<strong>${styledText}</strong>`;
    if (styles.includes('italic')) styledText = `<em>${styledText}</em>`;
    if (styles.includes('underline')) styledText = `<u>${styledText}</u>`;
    return styledText;
};

const GenerateSection = ({ settings, onNavigate, showNotification, onUpdate }) => {
    const { user } = useAuth();
    const [globalSettings, setGlobalSettings] = useState(null);
    const [copyStatus, setCopyStatus] = useState('Copy');
    const [isSaving, setIsSaving] = useState(false);
    const [preview, setPreview] = useState('desktop');

    useEffect(() => {
        const fetchGlobalSettings = async () => {
            const data = await api.getGlobalSettings();
            setGlobalSettings(data);
        };
        fetchGlobalSettings();
    }, []);

    const generatedHtml = useMemo(() => {
        if (!settings || !globalSettings) {
            return '';
        }

        // Email client compatible font stack
        const getFontStack = (fontFamily) => {
            const fallbacks = 'Arial, Helvetica, sans-serif';
            if (!fontFamily || fontFamily === 'Arial') return fallbacks;
            return `"${fontFamily}", ${fallbacks}`;
        };

        // Generate banner HTML
        const getBanners = (location, placement) => {
            return (settings.banners || [])
                .filter(b => b.enabled && b.url && b.location === location && b.placement === placement)
                .map(banner => `
                    <tr>
                        <td style="height: ${banner.height}px; overflow: hidden;">
                            <img src="${banner.url}" alt="${banner.altText}" style="width: 100%; height: 100%; object-fit: cover; display: block; border: 0;">
                        </td>
                    </tr>
                `)
                .join('');
        };

        // Generate header area HTML
        const generateHeaderAreaHtml = () => {
            if (!settings.includeTopPadding) return '';
            const paddingHeight = settings.topPaddingHeight || 20;
            const bgColor = settings.topPaddingBackgroundColor || settings.footerBackgroundColor;
            const textColor = settings.topPaddingTextColor || settings.footerTextColor;
            const paddingText = settings.topPaddingText || '';
            const fontSize = settings.topPaddingFontSize || settings.footerFontSize;
            
            if (paddingText) {
                return `
                    <tr>
                        <td style="padding: ${paddingHeight}px; background-color: ${bgColor}; color: ${textColor}; text-align: center; font-size: ${fontSize}px; font-family: ${getFontStack(settings.templateFontFamily)}; border-radius: ${settings.footerBorderRadius}px ${settings.footerBorderRadius}px 0 0;">
                            ${paddingText}
                        </td>
                    </tr>
                `;
            } else {
                return `
                    <tr>
                        <td style="height: ${paddingHeight}px; background-color: ${bgColor};">
                        </td>
                    </tr>
                `;
            }
        };

        // Generate footer HTML
        const generateFooterHtml = () => {
            if (settings.includeFooter === false) return '';
            const footerText = settings.footerText || `© ${settings.copyrightYear} ${settings.eventAbbreviation} - All rights reserved.`;
            return `
                <tr>
                    <td style="padding: ${settings.footerPadding}px; background-color: ${settings.footerBackgroundColor}; color: ${settings.footerTextColor}; text-align: center; font-size: ${settings.footerFontSize}px; font-family: ${getFontStack(settings.templateFontFamily)}; border-radius: 0 0 ${settings.footerBorderRadius}px ${settings.footerBorderRadius}px;">
                        ${applyStylesToText(footerText, settings.footerStyles)}
                    </td>
                </tr>
            `;
        };

        // Generate wallet section HTML
        const generateWalletHtml = (placement) => {
            if (!settings.includeWalletButtons || settings.walletPlacement !== placement) return '';
            
            const instructions = (settings.walletInstructionsText || '').split('\n').filter(line => line.trim()).map(line => `<li>${applyStylesToText(line, settings.walletInstructionsStyles)}</li>`).join('');
            
            return `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 20px 0;">
                    <tr>
                        <td style="background-color: ${settings.walletBackgroundColor}; padding: 15px; border-radius: 8px;">
                            <p style="font-size: ${settings.walletIntroFontSize}px; line-height: ${settings.paragraphLineHeight}; margin: 0 0 15px 0; color: ${settings.bodyTextColor};">
                                ${applyStylesToText((settings.walletIntroText || '').replace(/\n/g, '<br>'), settings.walletIntroStyles)}
                            </p>
                            <ol style="font-size: ${settings.walletInstructionsFontSize}px; line-height: ${settings.paragraphLineHeight}; margin: 0 0 15px 20px; padding: 0; color: ${settings.bodyTextColor};">
                                ${instructions}
                            </ol>
                            <div style="text-align: center;">
                                <a href="\${p.encryptedIdForUrl}" target="_blank" style="display: inline-block; margin-right: 10px;">
                                    <img src="${globalSettings?.imageUrls?.appleWallet || ''}" width="150" alt="Apple Wallet" style="border: 0; display: block;">
                                </a>
                                <a href="\${googlePassLink}" target="_blank" style="display: inline-block;">
                                    <img src="${globalSettings?.imageUrls?.googleWallet || ''}" width="171" alt="Google Wallet" style="border: 0; display: block;">
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>
            `;
        };

        // Generate CTA buttons HTML
        const generateCtaButtonsHtml = (placement) => {
            const buttons = (settings.ctaButtons || []).filter(b => b.placement === placement);
            if (buttons.length === 0) return '';
            
            return buttons.map(btn => `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 10px 0;">
                    <tr>
                        <td style="text-align: center;">
                            <a href="${btn.url}" target="_blank" style="display: inline-block; background-color: ${btn.backgroundColor}; color: ${btn.textColor}; font-family: ${getFontStack(settings.templateFontFamily)}; font-size: ${btn.fontSize}px; font-weight: bold; padding: ${btn.paddingY}px ${btn.paddingX}px; border-radius: ${btn.borderRadius}px; text-decoration: none; margin: 5px;">
                                ${btn.text}
                            </a>
                        </td>
                    </tr>
                </table>
            `).join('');
        };

        // Generate section titles HTML
        const generateSectionTitlesHtml = () => {
            return (settings.sectionTitles || []).map((sec, i) => `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 24px 0 16px 0;">
                    <tr>
                        <td>
                            <h3 style="color: ${sec.color}; font-size: ${sec.fontSize}px; border-bottom: ${settings.lineWidth || 1}px solid ${sec.color}; padding-bottom: 8px; margin: 0; font-family: ${getFontStack(settings.templateFontFamily)};">
                                ${applyStylesToText(sec.text, sec.styles)}
                            </h3>
                        </td>
                    </tr>
                </table>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 16px;">
                    <tr>
                        <td>
                            <p style="font-size: ${settings.bodyFontSize}px; line-height: ${settings.paragraphLineHeight}; margin: 0; color: ${settings.bodyTextColor}; font-family: ${getFontStack(settings.templateFontFamily)};">
                                Content for ${sec.text} goes here.
                            </p>
                        </td>
                    </tr>
                </table>
                ${generateWalletHtml(`after-section-${i}`)}
                ${generateCtaButtonsHtml(`after-section-${i}`)}
            `).join('');
        };

        // Generate signature HTML
        const generateSignatureHtml = () => {
            let signature = `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 24px 0;">
                    <tr>
                        <td style="border-top: ${settings.lineWidth || 1}px solid ${settings.dividerColor}; padding-top: 24px;">
                            <p style="font-size: ${settings.teamNameFontSize}px; line-height: 1.6; margin: 0; color: ${settings.bodyTextColor}; font-family: ${getFontStack(settings.templateFontFamily)};">
                                Best regards,<br>
                                ${applyStylesToText(settings.organizingTeamName, settings.teamNameStyles)}
            `;
            
            if (settings.includeCoName) signature += `<br><span style="font-size: ${settings.bodyFontSize}px; color: #666;">c./o. K.I.T. Group GmbH</span>`;
            if (settings.includeAssociation) signature += `<br><span style="font-size: ${settings.bodyFontSize}px; color: #666;">Association & Conference Management</span>`;
            if (settings.includeAddress) signature += `<br><span style="font-size: ${settings.bodyFontSize}px;">Kurfürstendamm 71<br>10709 Berlin, Germany</span>`;
            
            signature += `
                            </p>
                        </td>
                    </tr>
                </table>
            `;
            
            return signature;
        };

        // Generate contact info HTML
        const generateContactInfoHtml = () => {
            const hasContactInfo = (settings.showEmail && settings.contactEmail) || (settings.showPhone && settings.contactPhone) || (settings.showWebsite && settings.websiteUrl);
            if (!hasContactInfo) return '';
            
            return `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 16px;">
                    <tr>
                        <td>
                            <p style="font-size: ${settings.bodyFontSize}px; line-height: 1.6; margin: 0; color: ${settings.bodyTextColor}; font-family: ${getFontStack(settings.templateFontFamily)};">
                                ${settings.showEmail && settings.contactEmail ? `<img src="${globalSettings.imageUrls.iconEmail}" alt="Email" width="16" height="16" style="vertical-align: middle; margin-right: 8px; border: 0;"> <a href="mailto:${settings.contactEmail}" style="color: ${settings.linkColor}; text-decoration: none;">${settings.contactEmail}</a><br>` : ''}
                                ${settings.showPhone && settings.contactPhone ? `<img src="${globalSettings.imageUrls.iconPhone}" alt="Phone" width="16" height="16" style="vertical-align: middle; margin-right: 8px; border: 0;"> <a href="tel:${settings.contactPhone}" style="color: ${settings.linkColor}; text-decoration: none;">${settings.contactPhone}</a><br>` : ''}
                                ${settings.showWebsite && settings.websiteUrl ? `<img src="${globalSettings.imageUrls.iconWebsite}" alt="Website" width="16" height="16" style="vertical-align: middle; margin-right: 8px; border: 0;"> <a href="https://${settings.websiteUrl}" target="_blank" style="color: ${settings.linkColor}; text-decoration: none;">${settings.websiteUrl}</a><br>` : ''}
                            </p>
                        </td>
                    </tr>
                </table>
            `;
        };

        // Generate social media HTML
        const generateSocialMediaHtml = () => {
            if (!settings.showSocialMedia) return '';
            
            const socialLinks = [
                { key: 'facebookUrl', icon: 'socialFacebook', label: 'Facebook' },
                { key: 'twitterUrl', icon: 'socialX', label: 'X' },
                { key: 'linkedinUrl', icon: 'socialLinkedIn', label: 'LinkedIn' },
                { key: 'instagramUrl', icon: 'socialInstagram', label: 'Instagram' },
                { key: 'youtubeUrl', icon: 'socialYoutube', label: 'YouTube' },
                { key: 'miscUrl', icon: 'socialMisc', label: 'Other' }
            ];
            
            const hasSocialLinks = socialLinks.some(link => settings.socialLinks && settings.socialLinks[link.key]);
            if (!hasSocialLinks) return '';
            
            let socialHtml = `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 20px;">
                    <tr>
                        <td style="text-align: center; background-color: ${settings.socialMediaBackgroundColor}; padding: 15px; border-radius: 8px;">
                            <p style="font-size: 14px; color: ${settings.bodyTextColor}; margin: 0 0 10px 0; font-family: ${getFontStack(settings.templateFontFamily)};">
                                ${settings.socialTextInput || 'Follow us'}
                            </p>
            `;
            
            socialLinks.forEach(link => {
                if (settings.socialLinks && settings.socialLinks[link.key]) {
                    const iconSize = settings.socialIconSize || 24;
                    const borderRadius = settings.socialIconBorderRadius || 0;
                    socialHtml += `
                        <a href="${settings.socialLinks[link.key]}" style="text-decoration: none; margin: 0 5px; display: inline-block;">
                            <img src="${globalSettings.imageUrls[link.icon]}" alt="${link.label}" width="${iconSize}" height="${iconSize}" style="border: 0; border-radius: ${borderRadius}px;">
                        </a>
                    `;
                }
            });
            
            socialHtml += `
                        </td>
                    </tr>
                </table>
            `;
            
            return socialHtml;
        };

        // Generate main content HTML
        const generateMainContentHtml = () => {
            return `
                <tr>
                    <td style="padding: 24px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                            <tr>
                                <td>
                                    <p style="font-size: ${settings.salutationFontSize}px; line-height: ${settings.paragraphLineHeight}; margin: 0 0 16px 0; color: ${settings.bodyTextColor}; font-family: ${getFontStack(settings.templateFontFamily)};">
                                        ${applyStylesToText(settings.salutationInput, settings.salutationStyles)}
                                    </p>
                                </td>
                            </tr>
                        </table>
                        
                        ${generateWalletHtml('after-salutation')}
                        ${generateCtaButtonsHtml('after-salutation')}
                        
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 16px;">
                            <tr>
                                <td>
                                    <p style="font-size: ${settings.bodyFontSize}px; line-height: ${settings.paragraphLineHeight}; margin: 0; color: ${settings.bodyTextColor}; font-family: ${getFontStack(settings.templateFontFamily)};">
                                        This is a sample paragraph. Please replace this with your email content.
                                    </p>
                                </td>
                            </tr>
                        </table>
                        
                        ${generateWalletHtml('after-intro')}
                        ${generateCtaButtonsHtml('after-intro')}
                        
                        ${generateSectionTitlesHtml()}
                        
                        ${generateWalletHtml('before-signature')}
                        ${generateCtaButtonsHtml('before-signature')}
                        
                        ${generateSignatureHtml()}
                        ${generateContactInfoHtml()}
                        ${generateSocialMediaHtml()}
                    </td>
                </tr>
            `;
        };

        // Get banner sections
        const topBannersBefore = getBanners('top', 'before');
        const topBannersAfter = getBanners('top', 'after');
        const bottomBannersBefore = getBanners('bottom', 'before');
        const bottomBannersAfter = getBanners('bottom', 'after');
        const headerAreaHtml = generateHeaderAreaHtml();
        const footerHtml = generateFooterHtml();

        // Build the complete HTML
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Template</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Reset styles for email clients */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        /* Outlook-specific styles */
        .ReadMsgBody {
            width: 100%;
        }
        .ExternalClass {
            width: 100%;
        }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
            line-height: 100%;
        }
        /* Prevent WebKit and Windows mobile changing default text sizes */
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }
        /* Responsive design */
        @media only screen and (max-width: 600px) {
            .mobile-full {
                width: 100% !important;
                height: auto !important;
            }
            .mobile-padding {
                padding: 10px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${settings.bodyBackgroundColor}; font-family: ${getFontStack(settings.templateFontFamily)}; font-size: ${settings.bodyFontSize}px; color: ${settings.bodyTextColor}; line-height: ${settings.paragraphLineHeight};">
    <!--[if mso]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
    <td align="center">
    <![endif]-->
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: ${settings.includeOuterBorder ? '20px auto' : '0 auto'}; background: white; border-radius: ${settings.tableBorderRadius}px; overflow: hidden; border: ${settings.includeOuterBorder ? `${settings.lineWidth || 1}px solid ${settings.outerBorderColor || '#e5e7eb'}` : 'none'}; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        ${topBannersBefore}
        ${headerAreaHtml}
        ${topBannersAfter}
        ${generateMainContentHtml()}
        ${bottomBannersBefore}
        ${footerHtml}
        ${bottomBannersAfter}
    </table>
    
    <!--[if mso]>
    </td>
    </tr>
    </table>
    <![endif]-->
</body>
</html>`;

        return html;
    }, [settings, globalSettings]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedHtml.trim()).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        });
    };

    const handleDownload = () => {
        const blob = new Blob([generatedHtml.trim()], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${settings.name || 'email-template'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };
    
    const handleSaveTemplate = async () => {
        const templateName = prompt("Enter a name for this template:", settings.name || "My Custom Template");
        if (templateName) {
            setIsSaving(true);
            const templateData = { ...settings, name: templateName };
            await api.saveTemplate(user.id, templateData);
            setIsSaving(false);
            showNotification(`Template "${templateName}" saved successfully!`, 'success');
        }
    };
    
    const handleDeleteMyTemplate = async () => {
        if (settings.ownerId === user.id && window.confirm(`Are you sure you want to delete your template "${settings.name}"?`)) {
            await api.deleteUserTemplate(user.id, settings.id);
            showNotification('Template deleted.', 'success');
            const templates = await api.getTemplates(user);
            const standardTemplate = templates.global.find(t => t.id === 'standard-template-id' || t.visibility === 'global');
            onUpdate(null, standardTemplate || {});
            onNavigate('templateSelect');
        }
    };

    if (!globalSettings || !settings || Object.keys(settings).length === 0) {
        return (
            <div className="flex items-center justify-center h-48">
                <p>Loading template resources...</p>
            </div>
        );
    }

    return (
         <>
            <div className="bg-gray-800 rounded-lg overflow-hidden max-w-full">
                 <div className="flex justify-between items-center bg-gray-700 p-2 px-4">
                    <span className="font-mono text-sm text-gray-300">Generated HTML</span>
                    <div className="flex gap-4">
                        <button onClick={handleCopy} className="text-sm flex items-center gap-2 text-gray-300 hover:text-white"><CopyIcon/> {copyStatus}</button>
                        <button onClick={handleDownload} className="text-sm flex items-center gap-2 text-gray-300 hover:text-white"><DownloadIcon/> Download</button>
                    </div>
                </div>
                <pre className="p-4 text-xs text-gray-200 overflow-x-auto max-h-80 whitespace-pre-wrap break-all">{generatedHtml.trim()}</pre>
            </div>
            
            <div className="mt-6 flex justify-end gap-4">
                {settings.ownerId === user.id && (
                     <button onClick={handleDeleteMyTemplate} className="nav-button-secondary bg-red-100 text-red-700 hover:bg-red-200">
                        Delete This Template
                    </button>
                )}
                <button onClick={handleSaveTemplate} disabled={isSaving} className="nav-button-primary">
                    {isSaving ? 'Saving...' : 'Save as My Template'}
                </button>
            </div>

            <div className="flex justify-between items-center mt-8 mb-4">
                <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                <PreviewToggle view={preview} setView={setPreview} />
            </div>
            

            
            {preview === 'desktop' ? (
                <div className="flex justify-center">
                    <div className="relative">
                        {/* Computer screen mockup */}
                        <div className="w-[1000px] h-[700px] bg-gray-800 rounded-lg p-4 shadow-2xl">
                            <div className="w-full h-full bg-white rounded overflow-hidden relative">
                                {/* Browser chrome */}
                                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 flex items-center px-4 z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="ml-4 flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                                        Email Preview
                                    </div>
                                </div>
                                {/* Screen content with padding to show border */}
                                <div className="w-full h-full pt-8 p-4 bg-gray-100">
                                    <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                                        <iframe srcDoc={generatedHtml} title="Email Preview" className="w-full h-full border-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="relative">
                        {/* iPhone mockup */}
                        <div className="w-[400px] h-[812px] bg-gray-900 rounded-[60px] p-3 shadow-2xl">
                            <div className="w-full h-full bg-white rounded-[52px] overflow-hidden relative">
                                {/* Status bar */}
                                <div className="absolute top-0 left-0 right-0 h-6 bg-black rounded-t-[52px] flex items-center justify-between px-8 text-white text-xs z-10">
                                    <span>9:41</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                                        <div className="w-1 h-2 bg-white rounded-sm"></div>
                                        <div className="w-1 h-2 bg-white rounded-sm"></div>
                                    </div>
                                </div>
                                {/* Screen content */}
                                <div className="w-full h-full pt-6 bg-gray-100">
                                    <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                                        <iframe srcDoc={generatedHtml} title="Email Preview" className="w-full h-full border-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center p-8 mt-6 bg-gray-50/80 rounded-lg">
                <CheckIcon />
                <h3 className="text-xl font-bold mt-4">Configuration Complete!</h3>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">You can copy, download, or save the generated template. To make changes, go back to the previous sections.</p>
            </div>
            
             <div className="mt-10 flex justify-start">
                <NavButtons onPrev={() => onNavigate('contacts')} onNext={() => onNavigate('templateSelect')} prevLabel="Previous: Signature" nextLabel="Back to Top" />
            </div>
        </>
    );
};
export default GenerateSection;
