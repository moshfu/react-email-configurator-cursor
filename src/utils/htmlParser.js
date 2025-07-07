export const parseHtmlForSettings = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const settings = {};

    const mainTable = doc.querySelector('table[role="presentation"]');
    if (mainTable) {
        settings.includeOuterBorder = mainTable.style.border.includes('solid');
        settings.tableBorderRadius = parseInt(mainTable.style.borderRadius, 10) || 0;
        const footerCell = mainTable.querySelector('td[style*="background-color"]');
        if (footerCell) {
            settings.footerBackgroundColor = footerCell.style.backgroundColor || '#f5f5f5';
            settings.footerTextColor = footerCell.style.color || '#555555';
            settings.footerPadding = parseInt(footerCell.style.padding, 10) || 20;
        }
    }
    
    // Check for both wallet URL variables defined in the mock API
    settings.includeWalletButtons = !!doc.querySelector('a[href*="${p.encryptedIdForUrl}"]') || !!doc.querySelector('a[href*="${googlePassLink}"]');

    const styleTag = doc.querySelector('style');
    if (styleTag) {
        const css = styleTag.innerHTML;
        const getStyleValue = (regex) => (css.match(regex) || [])[1] || null;
        
        settings.bodyBackgroundColor = doc.body.style.backgroundColor || getStyleValue(/body\s*{[^}]*background-color:\s*([^;]+)/) || '#ffffff';
        settings.bodyTextColor = getStyleValue(/body\s*{[^}]*color:\s*([^;]+)/) || '#333333';
        settings.linkColor = getStyleValue(/a\s*{\s*color:\s*([^;]+)/) || '#00519e';
        settings.templateFontFamily = getStyleValue(/font-family:\s*'([^']+)'/) || getStyleValue(/font-family:\s*([^,;]+)/)?.trim() || 'Arial';
        settings.bodyFontSize = parseInt(getStyleValue(/font-size:\s*(\d+)/), 10) || 14;
        settings.paragraphLineHeight = parseFloat(getStyleValue(/line-height:\s*([\d.]+)/)) || 1.6;
    }
    
    const bannerImg = doc.querySelector('img[alt*="Banner"]');
    if (bannerImg) {
        settings.bannerImageUrl = bannerImg.src;
        settings.bannerImageAltText = bannerImg.alt;
    }
    
    const salutation = doc.querySelector('p[style*="font-size"]');
    if (salutation) {
        settings.salutationInput = salutation.textContent;
        settings.salutationFontSize = parseInt(salutation.style.fontSize, 10) || 16;
        const styles = [];
        if (salutation.querySelector('strong')) styles.push('bold');
        if (salutation.querySelector('em')) styles.push('italic');
        if (salutation.querySelector('u')) styles.push('underline');
        settings.salutationStyles = styles.length > 0 ? styles : ['normal'];
    }

    const signatureParagraph = Array.from(doc.querySelectorAll('p')).find(p => p.textContent.includes('Best regards'));
    if (signatureParagraph) {
        const teamNameText = signatureParagraph.innerHTML.split('<br>')[1]?.trim();
        settings.organizingTeamName = teamNameText?.replace(/<[^>]*>/g, '') || 'The Event Team';
        settings.includeCoName = signatureParagraph.innerHTML.includes('c./o. K.I.T. Group GmbH');
        settings.includeAssociation = signatureParagraph.innerHTML.includes('Association & Conference Management');
        settings.includeAddress = signatureParagraph.innerHTML.includes('Kurfürstendamm 71');
    }
    
    settings.showEmail = !!doc.querySelector('a[href*="mailto:"]');
    settings.showPhone = !!doc.querySelector('a[href*="tel:"]');
    settings.showWebsite = !!(doc.querySelector('a[href*="https"]')?.textContent.includes('www'));
    
    if (settings.showEmail) settings.contactEmail = doc.querySelector('a[href*="mailto:"]')?.textContent;
    if (settings.showPhone) settings.contactPhone = doc.querySelector('a[href*="tel:"]')?.textContent;
    if (settings.showWebsite) settings.websiteUrl = doc.querySelector('a[href*="https"]')?.textContent;

    return settings;
};
