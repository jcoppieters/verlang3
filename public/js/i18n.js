/**
 * Internationalization (i18n) - Translation system
 */

const i18n = {
  translations: {},
  currentLanguage: 'NL', // Default language
  
  /**
   * Initialize i18n system
   */
  async init() {
    try {
      const response = await fetch('/translations.json');
      this.translations = await response.json();
      
      // Load user's language preference
      const user = ui.getCurrentUser();
      if (user && user.language) {
        this.currentLanguage = user.language;
      } else {
        // Try to get from localStorage
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
          this.currentLanguage = savedLang;
        }
      }
      
      console.log('i18n initialized with language:', this.currentLanguage);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  },
  
  /**
   * Set current language
   */
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      
      // Update user preference if logged in
      const user = ui.getCurrentUser();
      if (user) {
        authAPI.updateProfile({ language: lang });
      }
      
      // Reload current page to apply translations
      router.handleRoute();
    }
  },
  
  /**
   * Get translation for a key
   */
  t(key, fallback = null) {
    const translation = this.translations[this.currentLanguage]?.[key];
    return translation || fallback || key;
  },
  
  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  },
  
  /**
   * Get available languages
   */
  getLanguages() {
    return Object.keys(this.translations);
  }
};

// Shorthand function for translations
function t(key, fallback = null) {
  return i18n.t(key, fallback);
}
