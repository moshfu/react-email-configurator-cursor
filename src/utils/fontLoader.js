const loadedFonts = new Set();
const systemFonts = new Set(['Arial', 'Helvetica', 'Verdana', 'Calibri', 'Segoe UI', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Lucida Console']);

export const loadGoogleFont = (fontFamily) => {
    if (!fontFamily || loadedFonts.has(fontFamily) || systemFonts.has(fontFamily)) {
        // Avoid loading system fonts or already loaded fonts
        return;
    }

    const fontQuery = fontFamily.replace(/ /g, '+');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';

    document.head.appendChild(link);
    loadedFonts.add(fontFamily);
};
