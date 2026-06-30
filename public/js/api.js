/**
 * API Client - Handles all HTTP requests to the backend
 */

const API_BASE_URL = '/api';

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const clearToken = () => localStorage.removeItem('token');

// User data management
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const clearUser = () => localStorage.removeItem('user');

/**
 * Make an API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  // Add authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add body if provided
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    // Handle unauthorized (but not for login/register endpoints)
    if (response.status === 401 && !endpoint.startsWith('/auth/')) {
      clearToken();
      clearUser();
      window.location.hash = '#/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Authentication API
 */
const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: userData,
    });
    if (response.success && response.token) {
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  },
  
  // Login
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    if (response.success && response.token) {
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  },
  
  // Logout
  logout: () => {
    clearToken();
    clearUser();
    window.location.hash = '#/login';
  },
  
  // Get profile
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
  
  // Update profile
  updateProfile: async (data) => {
    const response = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: data,
    });
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  },
  
  // Update password
  updatePassword: async (passwords) => {
    return apiRequest('/auth/password', {
      method: 'PUT',
      body: passwords,
    });
  },
};

/**
 * Lists API
 */
const listsAPI = {
  // Get all lists (own + followed)
  getAll: async () => {
    return apiRequest('/lists');
  },
  
  // Get single list
  get: async (id) => {
    return apiRequest(`/lists/${id}`);
  },
  
  // Create list
  create: async (listData) => {
    return apiRequest('/lists', {
      method: 'POST',
      body: listData,
    });
  },
  
  // Update list
  update: async (id, listData) => {
    return apiRequest(`/lists/${id}`, {
      method: 'PUT',
      body: listData,
    });
  },
  
  // Delete list
  delete: async (id) => {
    return apiRequest(`/lists/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Follow list
  follow: async (id) => {
    return apiRequest(`/lists/${id}/follow`, {
      method: 'POST',
    });
  },
  
  // Unfollow list
  unfollow: async (id) => {
    return apiRequest(`/lists/${id}/follow`, {
      method: 'DELETE',
    });
  },
  
  // Share list via email
  share: async (id, emailData) => {
    return apiRequest(`/lists/${id}/share`, {
      method: 'POST',
      body: emailData,
    });
  },
};

/**
 * Items API
 */
const itemsAPI = {
  // Add item to list
  add: async (listId, itemData) => {
    return apiRequest(`/lists/${listId}/items`, {
      method: 'POST',
      body: itemData,
    });
  },
  
  // Update item
  update: async (itemId, itemData) => {
    return apiRequest(`/items/${itemId}`, {
      method: 'PUT',
      body: itemData,
    });
  },
  
  // Delete item
  delete: async (itemId) => {
    return apiRequest(`/items/${itemId}`, {
      method: 'DELETE',
    });
  },
  
  // Reserve item
  reserve: async (itemId) => {
    return apiRequest(`/items/${itemId}/reserve`, {
      method: 'POST',
    });
  },
  
  // Donate item
  donate: async (itemId, data = {}) => {
    return apiRequest(`/items/${itemId}/donate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Takeback item (undo reserve/donate)
  takeback: async (itemId) => {
    return apiRequest(`/items/${itemId}/takeback`, {
      method: 'POST',
    });
  },
  
  // Reorder items in list
  reorder: async (listId, itemIds) => {
    return apiRequest(`/lists/${listId}/items/reorder`, {
      method: 'POST',
      body: { itemIds },
    });
  },
};

/**
 * Share API (public endpoints)
 */
const shareAPI = {
  // Get shared list (no auth required)
  getSharedList: async (encodedId) => {
    return fetch(`${API_BASE_URL}/share/${encodedId}`)
      .then(res => res.json());
  },
  
  // Donate from share (no auth required)
  donateFromShare: async (encodedItemId, data) => {
    return fetch(`${API_BASE_URL}/share/${encodedItemId}/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json());
  },
  
  // Search users and lists
  search: async (query) => {
    return apiRequest(`/search?q=${encodeURIComponent(query)}`);
  },
};

/**
 * UI Helpers
 */
const ui = {
  // Show toast notification
  showToast: (message, type = 'info') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Remove on click
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);
  },
  
  // Show loading state
  showLoading: (message = 'Loading...') => {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="loading-screen">
        <div class="spinner"></div>
        <p>${message}</p>
      </div>
    `;
  },
  
  // Show error state
  showError: (message) => {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h2 class="empty-state-title">Oops! Something went wrong</h2>
          <p class="empty-state-description">${message}</p>
          <button class="btn btn-primary" onclick="window.location.reload()">Reload Page</button>
        </div>
      </div>
    `;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getToken();
  },
  
  // Get current user
  getCurrentUser: () => {
    return getUser();
  },
};
