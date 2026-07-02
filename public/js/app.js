/**
 * Main Application - SPA Router & Initialization
 */

/**
 * Router - Handle hash-based routing
 */
const router = {
  routes: {
    '/': renderHomePage,
    '/login': renderLoginPage,
    '/register': renderRegisterPage,
    '/forgot-password': renderForgotPasswordPage,
    '/reset-password': renderResetPasswordPage,
    '/profile': renderProfilePage,
    '/lists': renderListsPage,
    '/lists/:id': renderListDetailPage,
    '/lists/:id/add': renderAddItemPage,
    '/search': renderSearchPage,
    '/share/:id': renderSharedListPage,
  },
  
  /**
   * Initialize router
   */
  init() {
    // Handle hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle initial load
    this.handleRoute();
  },
  
  /**
   * Handle current route
   */
  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const { route, params } = this.matchRoute(hash);
    
    // Check authentication
    const isAuthenticated = ui.isAuthenticated();
    const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
    
    if (!isAuthenticated && !publicRoutes.includes(route)) {
      // Save intended route to restore after login
      sessionStorage.setItem('intendedRoute', hash);
      // Redirect to login if not authenticated
      window.location.hash = '#/login';
      return;
    }
    
    if (isAuthenticated && (route === '/login' || route === '/register' || route === '/')) {
      // Redirect to lists if already logged in
      window.location.hash = '#/lists';
      return;
    }
    
    // Update navbar visibility
    this.updateNavbar(isAuthenticated);
    
    // Load sidebar for authenticated users
    if (isAuthenticated) {
      loadSidebar();
    }
    
    // Update active nav links
    this.updateActiveNavLink(hash);
    
    // Render the matched route
    const handler = this.routes[route];
    if (handler) {
      if (params && params.id) {
        handler(params.id);
      } else {
        handler();
      }
      
      // Update active sidebar item after rendering
      if (isAuthenticated) {
        setTimeout(() => updateActiveSidebarItem(), 100);
      }
      
      // Close mobile sidebar after navigation
      if (window.innerWidth < 768) {
        const sidebar = document.getElementById('sidebar');
        sidebar?.classList.remove('open');
      }
    } else {
      this.render404();
    }
  },
  
  /**
   * Match route with parameters
   */
  matchRoute(hash) {
    // Try exact match first
    if (this.routes[hash]) {
      return { route: hash, params: {} };
    }
    
    // Try pattern matching
    for (const pattern in this.routes) {
      const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
      const match = hash.match(regex);
      
      if (match) {
        const paramNames = (pattern.match(/:[^/]+/g) || []).map(p => p.slice(1));
        const params = {};
        
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        
        return { route: pattern, params };
      }
    }
    
    return { route: null, params: {} };
  },
  
  /**
   * Update navbar visibility and content
   */
  updateNavbar(isAuthenticated) {
    const navbar = document.getElementById('navbar');
    
    if (isAuthenticated) {
      navbar.style.display = 'block';
      
      const user = ui.getCurrentUser();
      if (user) {
        document.getElementById('userName').textContent = user.name;
      }
      
      // Update navbar translations
      const searchLink = navbar.querySelector('a[href="#/search"]');
      if (searchLink) searchLink.textContent = t('search');
    } else {
      navbar.style.display = 'none';
    }
  },
  
  /**
   * Update active navigation link
   */
  updateActiveNavLink(hash) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href').slice(1);
      if (hash.startsWith(href) && href !== '/') {
        link.classList.add('active');
      }
    });
  },
  
  /**
   * Render 404 page
   */
  render404() {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h2 class="empty-state-title">${t('page_not_found')}</h2>
          <p class="empty-state-description">${t('page_not_found_desc')}</p>
          <a href="#/lists" class="btn btn-primary">${t('go_to_lists')}</a>
        </div>
      </div>
    `;
  },
};

/**
 * Render Home Page (Landing page for non-authenticated users)
 */
function renderHomePage() {
  const currentLang = i18n.getCurrentLanguage();
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 900px;">
      <!-- Language Selector -->
      <div style="display: flex; justify-content: flex-end; padding: var(--space-4) 0;">
        <div class="language-selector" style="display: flex; gap: var(--space-2); font-size: var(--text-sm);">
          <button class="lang-btn ${currentLang === 'NL' ? 'active' : ''}" onclick="switchLanguage('NL')" style="cursor: pointer; background: none; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); font-weight: ${currentLang === 'NL' ? 'var(--font-bold)' : 'var(--font-normal)'}; color: ${currentLang === 'NL' ? 'var(--color-primary)' : 'var(--color-text-secondary)'}; text-decoration: ${currentLang === 'NL' ? 'underline' : 'none'};">NL</button>
          <span style="color: var(--color-text-light);">|</span>
          <button class="lang-btn ${currentLang === 'FR' ? 'active' : ''}" onclick="switchLanguage('FR')" style="cursor: pointer; background: none; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); font-weight: ${currentLang === 'FR' ? 'var(--font-bold)' : 'var(--font-normal)'}; color: ${currentLang === 'FR' ? 'var(--color-primary)' : 'var(--color-text-secondary)'}; text-decoration: ${currentLang === 'FR' ? 'underline' : 'none'};">FR</button>
          <span style="color: var(--color-text-light);">|</span>
          <button class="lang-btn ${currentLang === 'EN' ? 'active' : ''}" onclick="switchLanguage('EN')" style="cursor: pointer; background: none; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); font-weight: ${currentLang === 'EN' ? 'var(--font-bold)' : 'var(--font-normal)'}; color: ${currentLang === 'EN' ? 'var(--color-primary)' : 'var(--color-text-secondary)'}; text-decoration: ${currentLang === 'EN' ? 'underline' : 'none'};">EN</button>
        </div>
      </div>
      
      <div style="text-align: center; padding: var(--space-16) var(--space-4);">
        <div style="font-size: 5rem; margin-bottom: var(--space-6);">🎁</div>
        
        <h1 style="font-size: var(--text-4xl); font-weight: var(--font-bold); margin-bottom: var(--space-4);">
          ${t('welcome_to_app')}
        </h1>
        
        <p style="font-size: var(--text-xl); color: var(--color-text-secondary); margin-bottom: var(--space-10); max-width: 600px; margin-left: auto; margin-right: auto;">
          ${t('tagline')}
        </p>
        
        <div class="flex justify-center gap-4" style="margin-bottom: var(--space-16);">
          <a href="#/register" class="btn btn-primary btn-lg">${t('get_started')}</a>
          <a href="#/login" class="btn btn-secondary btn-lg">${t('sign_in')}</a>
        </div>
        
        <!-- Features -->
        <div class="grid grid-cols-1" style="gap: var(--space-8); text-align: left; max-width: 800px; margin: 0 auto;">
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
              📝 ${t('feature_create_title')}
            </h3>
            <p class="text-muted">
              ${t('feature_create_desc')}
            </p>
          </div>
          
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
              👥 ${t('feature_share_title')}
            </h3>
            <p class="text-muted">
              ${t('feature_share_desc')}
            </p>
          </div>
          
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
              🎯 ${t('feature_mark_title')}
            </h3>
            <p class="text-muted">
              ${t('feature_mark_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize Application
 */
async function initApp() {
  // Initialize i18n first
  await i18n.init();
  
  // Initialize router
  router.init();
  
  // Show version 3 splash message (one-time)
  showV3SplashMessage();
  
  // Log startup
  console.log('🎁 Verlanglijstje.be initialized');
}

/**
 * Show one-time splash message for version 3
 */
function showV3SplashMessage() {
  // Check if user has already seen the splash message
  const hasSeenSplash = localStorage.getItem('v3SplashSeen');
  
  if (hasSeenSplash === 'true') {
    return; // User has already seen it
  }
  
  // Create modal overlay
  const modalContainer = document.getElementById('modalContainer');
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'v3SplashOverlay';
  
  const currentLang = i18n.getCurrentLanguage();
  
  overlay.innerHTML = `
    <div class="modal" style="max-width: 600px;">
      <div style="padding: var(--space-4);">
        <!-- Language Selector -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-4);">
          <div class="language-selector" style="display: flex; gap: var(--space-2); font-size: var(--text-sm);">
            <button class="lang-btn ${currentLang === 'NL' ? 'active' : ''}" onclick="switchLanguageInSplash('NL')" style="cursor: pointer; background: none; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); font-weight: ${currentLang === 'NL' ? 'var(--font-bold)' : 'var(--font-normal)'}; color: ${currentLang === 'NL' ? 'var(--color-primary)' : 'var(--color-text-secondary)'}; text-decoration: ${currentLang === 'NL' ? 'underline' : 'none'};">NL</button>
            <span style="color: var(--color-text-light);">|</span>
            <button class="lang-btn ${currentLang === 'FR' ? 'active' : ''}" onclick="switchLanguageInSplash('FR')" style="cursor: pointer; background: none; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); font-weight: ${currentLang === 'FR' ? 'var(--font-bold)' : 'var(--font-normal)'}; color: ${currentLang === 'FR' ? 'var(--color-primary)' : 'var(--color-text-secondary)'}; text-decoration: ${currentLang === 'FR' ? 'underline' : 'none'};">FR</button>
            <span style="color: var(--color-text-light);">|</span>
            <button class="lang-btn ${currentLang === 'EN' ? 'active' : ''}" onclick="switchLanguageInSplash('EN')" style="cursor: pointer; background: none; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); font-weight: ${currentLang === 'EN' ? 'var(--font-bold)' : 'var(--font-normal)'}; color: ${currentLang === 'EN' ? 'var(--color-primary)' : 'var(--color-text-secondary)'}; text-decoration: ${currentLang === 'EN' ? 'underline' : 'none'};">EN</button>
          </div>
        </div>
        
        <div style="text-align: center;">
          <h2 style="font-size: var(--text-2xl); font-weight: var(--font-bold); margin-bottom: var(--space-6); color: var(--color-primary);">
            ${t('v3_splash_title')}
          </h2>
          
          <p style="font-size: var(--text-base); color: var(--color-text-primary); margin-bottom: var(--space-6); line-height: 1.6; text-align: left;">
            ${t('v3_splash_message')}
          </p>
          
          <div style="background-color: var(--color-bg-secondary); padding: var(--space-4); border-radius: var(--radius-md); margin-bottom: var(--space-6); text-align: left;">
            <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-2);">
              ${t('v3_splash_report')}
            </p>
            <a href="mailto:webmasters@verlanglijstje.be" 
               style="color: var(--color-primary); font-weight: var(--font-semibold); text-decoration: none; word-break: break-all;">
              webmasters@verlanglijstje.be
            </a>
          </div>
          
          <button class="btn btn-primary btn-lg" onclick="closeV3SplashMessage()" style="width: 100%;">
            ${t('v3_splash_button')}
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.appendChild(overlay);
  
  // Prevent closing by clicking outside
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      // Don't close - user must click the button
      return;
    }
  });
}

/**
 * Close version 3 splash message and mark as seen
 */
function closeV3SplashMessage() {
  // Mark as seen in localStorage
  localStorage.setItem('v3SplashSeen', 'true');
  
  // Remove modal
  const overlay = document.getElementById('v3SplashOverlay');
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Toggle sidebar (for mobile)
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

/**
 * Load sidebar with lists
 */
async function loadSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarContent = document.getElementById('sidebarContent');
  
  if (!ui.isAuthenticated()) {
    sidebar.style.display = 'none';
    return;
  }
  
  sidebar.style.display = 'block';
  
  try {
    const response = await listsAPI.getAll();
    if (!response.success) return;
    
    const { myLists, followedLists } = response;
    
    let html = '';
    
    // My Lists
    html += `
      <div class="sidebar-group">
        <div class="sidebar-group-title">
          <span>${t('my_lists')}</span>
          <button class="btn btn-sm btn-primary" onclick="showCreateListModal()">+ ${t('new')}</button>
        </div>
        ${myLists.length > 0 ? myLists.map(list => `
          <a href="#/lists/${list.id}" class="sidebar-item" data-list-id="${list.id}">
            <span class="sidebar-item-text">${escapeHtml(list.name)}</span>
            <span class="sidebar-item-count">${list.itemCount || 0}</span>
          </a>
        `).join('') : ''}
      </div>
    `;
    
    // Group followed lists by owner
    if (followedLists.length > 0) {
      const grouped = {};
      followedLists.forEach(list => {
        const owner = list.username || 'Unknown';
        if (!grouped[owner]) {
          grouped[owner] = [];
        }
        grouped[owner].push(list);
      });
      
      const sortedOwners = Object.keys(grouped).sort((a, b) => 
        a.toLowerCase().localeCompare(b.toLowerCase())
      );
      
      sortedOwners.forEach(owner => {
        grouped[owner].sort((a, b) => 
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        
        html += `
          <div class="sidebar-group">
            <div class="sidebar-group-title">${escapeHtml(owner)}</div>
            ${grouped[owner].map(list => `
              <a href="#/lists/${list.id}" class="sidebar-item" data-list-id="${list.id}">
                <span class="sidebar-item-text">${escapeHtml(list.name)}</span>
                <span class="sidebar-item-count">${list.itemCount || 0}</span>
              </a>
            `).join('')}
          </div>
        `;
      });
    }
    
    sidebarContent.innerHTML = html;
    
    // Update active item
    updateActiveSidebarItem();
    
  } catch (error) {
    console.error('Failed to load sidebar:', error);
  }
}

/**
 * Update active sidebar item based on current route
 */
function updateActiveSidebarItem() {
  const hash = window.location.hash;
  const match = hash.match(/#\/lists\/(\d+)/);
  
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  
  if (match) {
    const listId = match[1];
    const activeItem = document.querySelector(`[data-list-id="${listId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }
}

/**
 * Switch language on home page
 */
function switchLanguage(lang) {
  i18n.setLanguage(lang);
  // Reload home page with new language
  renderHomePage();
}

/**
 * Switch language in splash message modal
 */
function switchLanguageInSplash(lang) {
  i18n.setLanguage(lang);
  // Remove and re-show splash to update translations
  const overlay = document.getElementById('v3SplashOverlay');
  if (overlay) {
    overlay.remove();
  }
  // Don't set as seen, just refresh the modal
  localStorage.removeItem('v3SplashSeen');
  showV3SplashMessage();
}

/**
 * Start the application when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  ui.showToast('An unexpected error occurred', 'error');
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  ui.showToast('An unexpected error occurred', 'error');
});
