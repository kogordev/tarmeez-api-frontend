export function isRTL(text) {
    // Pattern matching for RTL characters
    const rtlPattern = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlPattern.test(text);
}

export function safeParse(str) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return null
    }
}

