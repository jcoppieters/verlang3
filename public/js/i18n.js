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
  t(key, params = null) {
    let translation = this.translations[this.currentLanguage]?.[key];
    
    // If params is a string, it's the fallback value (backward compatibility)
    if (typeof params === 'string') {
      return translation || params || key;
    }
    
    // If no translation found, return the key
    if (!translation) {
      return key;
    }
    
    // If params is an object, replace placeholders
    if (params && typeof params === 'object') {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    
    return translation;
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
function t(key, params = null) {
  return i18n.t(key, params);
}
