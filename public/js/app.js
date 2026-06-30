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
    '/profile': renderProfilePage,
    '/lists': renderListsPage,
    '/lists/:id': renderListDetailPage,
    '/lists/:id/add': renderAddItemPage,
    '/search': renderSearchPage,
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
    const publicRoutes = ['/', '/login', '/register'];
    
    if (!isAuthenticated && !publicRoutes.includes(route)) {
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
          <h2 class="empty-state-title">Page Not Found</h2>
          <p class="empty-state-description">The page you're looking for doesn't exist.</p>
          <a href="#/lists" class="btn btn-primary">Go to Lists</a>
        </div>
      </div>
    `;
  },
};

/**
 * Render Home Page (Landing page for non-authenticated users)
 */
function renderHomePage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 900px;">
      <div style="text-align: center; padding: var(--space-16) var(--space-4);">
        <div style="font-size: 5rem; margin-bottom: var(--space-6);">🎁</div>
        
        <h1 style="font-size: var(--text-4xl); font-weight: var(--font-bold); margin-bottom: var(--space-4);">
          Welcome to Verlanglijstje.be
        </h1>
        
        <p style="font-size: var(--text-xl); color: var(--color-text-secondary); margin-bottom: var(--space-10); max-width: 600px; margin-left: auto; margin-right: auto;">
          Create and share wishlists with friends and family. Never miss a perfect gift again!
        </p>
        
        <div class="flex justify-center gap-4" style="margin-bottom: var(--space-16);">
          <a href="#/register" class="btn btn-primary btn-lg">Get Started</a>
          <a href="#/login" class="btn btn-secondary btn-lg">Sign In</a>
        </div>
        
        <!-- Features -->
        <div class="grid grid-cols-1" style="gap: var(--space-8); text-align: left; max-width: 800px; margin: 0 auto;">
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
              📝 Create Wishlists
            </h3>
            <p class="text-muted">
              Organize your wishes in multiple lists. Keep track of everything you want for birthdays, holidays, or any special occasion.
            </p>
          </div>
          
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
              👥 Share with Friends
            </h3>
            <p class="text-muted">
              Share your lists via email or follow friends' lists. No more guessing what to give!
            </p>
          </div>
          
          <div class="card">
            <h3 style="font-size: var(--text-xl); font-weight: var(--font-semibold); margin-bottom: var(--space-2);">
              🎯 Mark Items
            </h3>
            <p class="text-muted">
              Mark items as reserved or donated to avoid duplicate gifts. Everyone stays coordinated.
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
function initApp() {
  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      authAPI.logout();
    });
  }
  
  // Initialize router
  router.init();
  
  // Log startup
  console.log('🎁 Verlanglijstje.be initialized');
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
        <div class="sidebar-group-header">
          <div class="sidebar-group-title">My Lists</div>
          <button class="btn btn-sm btn-primary" onclick="showCreateListModal()">+ New</button>
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
