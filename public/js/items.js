/**
 * Items Management - Display and manage items in lists
 */

/**
 * Render List Detail Page (with items)
 */
async function renderListDetailPage(listId) {
  ui.showLoading('Loading list...');
  
  try {
    const response = await listsAPI.get(listId);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    const { list, items } = response;
    const isOwner = list.isOwner;
    
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="container">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-2">
            <a href="#/lists" class="btn-text">← Back to Lists</a>
          </div>
          
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3" style="flex: 1;">
              <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0;">
                ${escapeHtml(list.name)}
              </h1>
              ${isOwner ? `
                <button class="btn btn-sm btn-primary" onclick="showAddItemModal(${listId})" title="Add Item">
                  + Add
                </button>
              ` : ''}
            </div>
            <p class="text-muted" style="margin-top: 0.5rem;">
              ${isOwner ? 'Your list' : `by ${escapeHtml(list.ownerName)}`} • 
              ${items.length} items
            </p>
          </div>
          </div>
        </div>
        
        <!-- Items Grid -->
        <div class="grid grid-cols-1" id="itemsContainer">
          ${items.length === 0 ? renderEmptyItemsState(isOwner) : items.map(item => renderItemCard(item, isOwner)).join('')}
        </div>
      </div>
    `;
  } catch (error) {
    ui.showError(error.message || 'Failed to load list');
  }
}

/**
 * Render item card
 */
function renderItemCard(item, isOwner) {
  const statusBadge = !isOwner ? getStatusBadge(item.status) : '';
  const canInteract = !isOwner && item.status === 'A';
  
  return `
    <div class="card">
      <div class="flex justify-between items-start gap-4">
        <!-- Item Details -->
        <div style="flex: 1;">
          <div class="flex items-start justify-between gap-3 mb-2">
            <h3 class="card-title" style="flex: 1;">${escapeHtml(item.name)}</h3>
            ${statusBadge}
          </div>
          
          ${item.description ? `<p class="text-muted mb-3">${escapeHtml(item.description)}</p>` : ''}
          
          <div class="flex gap-4 text-small text-muted mb-3">
            ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" class="text-primary">🔗 Link</a>` : ''}
            ${item.price ? `<span>💰 €${item.price}</span>` : ''}
          </div>
          
          ${!isOwner && item.status === 'R' && item.username ? `
            <p class="text-small" style="color: var(--color-warning);">
              Reserved by ${escapeHtml(item.username)}
            </p>
          ` : ''}
          
          ${!isOwner && item.status === 'S' && item.username ? `
            <p class="text-small" style="color: var(--color-success);">
              Donated by ${escapeHtml(item.username)}
              ${item.givencomment ? `<br><em>"${escapeHtml(item.givencomment)}"</em>` : ''}
            </p>
          ` : ''}
          
          ${isOwner && item.status === 'S' && item.username ? `
            <p class="text-small" style="color: var(--color-success);">
              Donated by ${escapeHtml(item.username)}
              ${item.givencomment ? `<br><em>"${escapeHtml(item.givencomment)}"</em>` : ''}
            </p>
          ` : ''}
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-column gap-2">
          ${isOwner ? renderOwnerActions(item) : renderGuestActions(item, canInteract)}
        </div>
      </div>
    </div>
  `;
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
  const badges = {
    'R': '<span class="badge badge-warning">Reserved</span>',
    'S': '<span class="badge badge-secondary">Donated</span>',
  };
  return badges[status] || '';
}

/**
 * Render owner action buttons
 */
function renderOwnerActions(item) {
  let html = `<button class="btn btn-sm btn-secondary" onclick="showEditItemModal(${item.id})" title="Edit">✏️ Edit</button>`;
  
  // Show donated status if item is donated
  if (item.status === 'S') {
    html += `<span class="badge badge-success" style="margin-left: 0.5rem;">✓ Donated</span>`;
  }
  
  return html;
}

/**
 * Render guest action buttons
 */
function renderGuestActions(item, canInteract) {
  const currentUser = getUser();
  const isReservedByMe = item.status === 'R' && item.givenby === currentUser?.id;
  
  // If available, show Reserve and Donate buttons
  if (item.status === 'A') {
    return `
      <button class="btn btn-sm btn-warning" onclick="reserveItem(${item.id}, '${escapeHtml(item.name)}')">
        Reserve
      </button>
      <button class="btn btn-sm btn-success" onclick="donateItem(${item.id}, '${escapeHtml(item.name)}')">
        Donate
      </button>
    `;
  }
  
  // If reserved by me, show Donate and Take Back buttons
  if (isReservedByMe) {
    return `
      <button class="btn btn-sm btn-success" onclick="donateItem(${item.id}, '${escapeHtml(item.name)}')">
        Donate
      </button>
      <button class="btn btn-sm btn-secondary" onclick="takebackItem(${item.id})">
        Take Back
      </button>
    `;
  }
  
  return '';
}

/**
 * Render empty items state
 */
function renderEmptyItemsState(isOwner) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">🎁</div>
      <h3 class="empty-state-title">No items yet</h3>
      <p class="empty-state-description">
        ${isOwner ? 'Add your first item to this wishlist!' : 'This list is currently empty.'}
      </p>
    </div>
  `;
}

/**
 * Render Add Item Page
 */
function renderAddItemPage(listId) {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 600px;">
      <div class="mb-6">
        <a href="#/lists/${listId}" class="btn-text">← Back to List</a>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Add New Item</h2>
        </div>
        
        <form id="addItemForm" data-list-id="${listId}">
          <div class="form-group">
            <label class="label" for="itemName">Item Name *</label>
            <input type="text" id="itemName" name="name" class="input" required placeholder="e.g., Wireless Headphones" />
          </div>
          
          <div class="form-group">
            <label class="label" for="itemDescription">Description</label>
            <textarea id="itemDescription" name="description" class="textarea" placeholder="Any specific details or preferences..."></textarea>
          </div>
          
          <div class="form-group">
            <label class="label" for="itemUrl">URL / Link</label>
            <input type="url" id="itemUrl" name="url" class="input" placeholder="https://example.com/product" />
          </div>
          
          <div class="grid grid-cols-2" style="gap: var(--space-4);">
            <div class="form-group">
              <label class="label" for="itemPrice">Price (€)</label>
              <input type="number" id="itemPrice" name="price" class="input" step="0.01" min="0" placeholder="0.00" />
            </div>
            
            <div class="form-group">
              <label class="label" for="itemPriority">Priority</label>
              <select id="itemPriority" name="priority" class="select">
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3" selected>High</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="label" for="itemShowFrom">Show From Date</label>
            <input type="date" id="itemShowFrom" name="showfrom" class="input" />
            <p class="text-small text-muted mt-1">Item will only be visible after this date</p>
          </div>
          
          <div class="card-footer">
            <button type="button" class="btn btn-secondary" onclick="window.history.back()">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('addItemForm').addEventListener('submit', handleAddItem);
}

/**
 * Handle add item
 */
async function handleAddItem(e) {
  e.preventDefault();
  
  const listId = e.target.dataset.listId;
  const formData = new FormData(e.target);
  const itemData = {
    name: formData.get('name').trim(),
    description: formData.get('description').trim(),
    url: formData.get('url').trim(),
    price: formData.get('price') || null,
    priority: formData.get('priority') || 3,
    showfrom: formData.get('showfrom') || null,
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Adding...';
  
  try {
    const response = await itemsAPI.add(listId, itemData);
    
    if (response.success) {
      ui.showToast('Item added successfully!', 'success');
      window.location.hash = `#/lists/${listId}`;
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to add item', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Item';
  }
}

/**
 * Show add item modal
 */
function showAddItemModal(listId) {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal item-modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Add New Item</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        
        <form id="addItemModalForm" data-list-id="${listId}">
          <div class="modal-body">
            <div class="form-group">
              <label class="label" for="itemName">Item Name *</label>
              <input type="text" id="itemName" name="name" class="input" required placeholder="e.g., Wireless Headphones" />
            </div>
            
            <div class="form-group">
              <label class="label" for="itemDescription">Description</label>
              <textarea id="itemDescription" name="description" class="textarea" placeholder="Any specific details or preferences..."></textarea>
            </div>
            
            <div class="form-group">
              <label class="label" for="itemUrl">URL / Link</label>
              <input type="url" id="itemUrl" name="url" class="input" placeholder="https://example.com/product" />
            </div>
            
            <div class="grid grid-cols-2" style="gap: var(--space-4);">
              <div class="form-group">
                <label class="label" for="itemPrice">Price (€)</label>
                <input type="number" id="itemPrice" name="price" class="input" step="0.01" min="0" placeholder="0.00" />
              </div>
              
              <div class="form-group">
                <label class="label" for="itemPriority">Priority (for ordering)</label>
                <input type="number" id="itemPriority" name="priority" class="input" value="50" min="1" max="100" />
                <span class="text-small text-muted">Higher numbers appear first</span>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('addItemModalForm').addEventListener('submit', handleAddItemModal);
}

/**
 * Handle add item from modal
 */
async function handleAddItemModal(e) {
  e.preventDefault();
  
  const listId = e.target.dataset.listId;
  const formData = new FormData(e.target);
  const itemData = {
    name: formData.get('name').trim(),
    description: formData.get('description').trim(),
    url: formData.get('url').trim(),
    price: formData.get('price') || '',
    priority: parseInt(formData.get('priority')) || 50,
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Adding...';
  
  try {
    const response = await itemsAPI.add(listId, itemData);
    
    if (response.success) {
      ui.showToast('Item added successfully!', 'success');
      closeModal();
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to add item', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Item';
  }
}

/**
 * Show edit item modal
 */
async function showEditItemModal(itemId) {
  // First, we need to get the item data
  // Since we don't have an API endpoint for a single item, we'll get it from the current page
  const listId = window.location.hash.match(/#\/lists\/(\d+)/)?.[1];
  if (!listId) return;
  
  try {
    const response = await listsAPI.get(listId);
    const item = response.items?.find(i => i.id === itemId);
    
    if (!item) {
      ui.showToast('Item not found', 'error');
      return;
    }
    
    const modal = document.getElementById('modalContainer');
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeModal(event)">
        <div class="modal item-modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>Edit Item</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
          </div>
          
          <form id="editItemModalForm" data-item-id="${itemId}">
            <div class="modal-body">
              <div class="form-group">
                <label class="label" for="editItemName">Item Name *</label>
                <input type="text" id="editItemName" name="name" class="input" required value="${escapeHtml(item.name)}" />
              </div>
              
              <div class="form-group">
                <label class="label" for="editItemDescription">Description</label>
                <textarea id="editItemDescription" name="description" class="textarea">${escapeHtml(item.description || '')}</textarea>
              </div>
              
              <div class="form-group">
                <label class="label" for="editItemUrl">URL / Link</label>
                <input type="url" id="editItemUrl" name="url" class="input" value="${escapeHtml(item.url || '')}" />
              </div>
              
              <div class="grid grid-cols-2" style="gap: var(--space-4);">
                <div class="form-group">
                  <label class="label" for="editItemPrice">Price (€)</label>
                  <input type="number" id="editItemPrice" name="price" class="input" step="0.01" min="0" value="${item.price || ''}" />
                </div>
                
                <div class="form-group">
                  <label class="label" for="editItemPriority">Priority (for ordering)</label>
                  <input type="number" id="editItemPriority" name="priority" class="input" value="${item.priority || 50}" min="1" max="100" />
                  <span class="text-small text-muted">Higher numbers appear first</span>
                </div>
              </div>
              
              <div class="form-group" style="border-top: 1px solid var(--color-border-light); padding-top: var(--space-4); margin-top: var(--space-4);">
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteItemFromModal(${itemId}, '${escapeHtml(item.name)}')">
                  🗑️ Delete Item
                </button>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.getElementById('editItemModalForm').addEventListener('submit', handleEditItemModal);
  } catch (error) {
    ui.showToast('Failed to load item', 'error');
  }
}

/**
 * Handle edit item from modal
 */
async function handleEditItemModal(e) {
  e.preventDefault();
  
  const itemId = e.target.dataset.itemId;
  const formData = new FormData(e.target);
  const itemData = {
    name: formData.get('name').trim(),
    description: formData.get('description').trim(),
    url: formData.get('url').trim(),
    price: formData.get('price') || '',
    priority: parseInt(formData.get('priority')) || 50,
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Saving...';
  
  try {
    const response = await itemsAPI.update(itemId, itemData);
    
    if (response.success) {
      ui.showToast('Item updated successfully!', 'success');
      closeModal();
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to update item', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Changes';
  }
}

/**
 * Delete item from modal
 */
async function deleteItemFromModal(itemId, itemName) {
  if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
    return;
  }
  
  try {
    const response = await itemsAPI.delete(itemId);
    
    if (response.success) {
      ui.showToast('Item deleted successfully', 'success');
      closeModal();
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to delete item', 'error');
  }
}

/**
 * Edit item - Deprecated, use showEditItemModal
 */
async function editItem(itemId) {
  showEditItemModal(itemId);
}

/**
 * Delete item
 */
async function deleteItem(itemId, itemName) {
  if (!confirm(`Are you sure you want to delete "${itemName}"?`)) {
    return;
  }
  
  try {
    const response = await itemsAPI.delete(itemId);
    
    if (response.success) {
      ui.showToast('Item deleted successfully', 'success');
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to delete item', 'error');
  }
}

/**
 * Donate item modal
 */
function donateItem(itemId, itemName) {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Donate Item</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        
        <form id="donateItemForm" data-item-id="${itemId}">
          <div class="modal-body">
            <p class="mb-4">You're about to mark <strong>"${escapeHtml(itemName)}"</strong> as donated.</p>
            
            <div class="form-group mb-0">
              <label class="label" for="donateComment">Add a comment (optional)</label>
              <textarea id="donateComment" name="comment" class="textarea" placeholder="Leave a message..."></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-success">Confirm Donation</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('donateItemForm').addEventListener('submit', handleDonateItem);
}

/**
 * Handle donate item
 */
async function handleDonateItem(e) {
  e.preventDefault();
  
  const itemId = e.target.dataset.itemId;
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Processing...';
  
  try {
    const response = await itemsAPI.donate(itemId);
    
    if (response.success) {
      ui.showToast('Thank you! Item marked as donated 🎁', 'success');
      closeModal();
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to donate item', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Confirm Donation';
  }
}

/**
 * Reserve item modal
 */
function reserveItem(itemId, itemName) {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Reserve Item</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        
        <form id="reserveItemForm" data-item-id="${itemId}">
          <div class="modal-body">
            <p class="mb-4">You're about to reserve <strong>"${escapeHtml(itemName)}"</strong>.</p>
            <p class="text-small text-muted mb-4">This lets the owner know you plan to get this item. You can donate it later or take back your reservation.</p>
            
            <div class="form-group mb-0">
              <label class="label" for="reserveComment">Add a comment (optional)</label>
              <textarea id="reserveComment" name="comment" class="textarea" placeholder="Leave a message..."></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" class="btn btn-warning">Reserve Item</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('reserveItemForm').addEventListener('submit', handleReserveItem);
}

/**
 * Handle reserve item
 */
async function handleReserveItem(e) {
  e.preventDefault();
  
  const itemId = e.target.dataset.itemId;
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Processing...';
  
  try {
    const response = await itemsAPI.reserve(itemId);
    
    if (response.success) {
      ui.showToast('Item reserved successfully! 📌', 'success');
      closeModal();
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to reserve item', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Reserve Item';
  }
}

/**
 * Take back item (undo reserve/donate)
 */
async function takebackItem(itemId) {
  if (!confirm('Are you sure you want to take back this reservation?')) {
    return;
  }
  
  try {
    const response = await itemsAPI.takeback(itemId);
    
    if (response.success) {
      ui.showToast('Reservation taken back', 'success');
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to take back item', 'error');
  }
}

/**
 * Render Search Page
 */
async function renderSearchPage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 800px;">
      <h1 class="mb-6" style="font-size: var(--text-3xl); font-weight: var(--font-bold);">
        Search
      </h1>
      
      <div class="card mb-6">
        <form id="searchForm">
          <div class="flex gap-3">
            <input 
              type="text" 
              id="searchQuery" 
              name="query" 
              class="input" 
              placeholder="Search for users or lists..." 
              required
              style="flex: 1;"
            />
            <button type="submit" class="btn btn-primary">Search</button>
          </div>
        </form>
      </div>
      
      <div id="searchResults"></div>
    </div>
  `;
  
  document.getElementById('searchForm').addEventListener('submit', handleSearch);
}

/**
 * Handle search
 */
async function handleSearch(e) {
  e.preventDefault();
  
  const query = document.getElementById('searchQuery').value.trim();
  const resultsContainer = document.getElementById('searchResults');
  
  if (query.length < 2) {
    resultsContainer.innerHTML = '<p class="text-muted">Please enter at least 2 characters</p>';
    return;
  }
  
  resultsContainer.innerHTML = '<div class="loading-screen"><div class="spinner"></div></div>';
  
  try {
    const response = await shareAPI.search(query);
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    const { users, lists } = response;
    
    resultsContainer.innerHTML = `
      ${users.length > 0 ? `
        <section class="mb-8">
          <h2 class="mb-4" style="font-size: var(--text-xl); font-weight: var(--font-semibold);">
            Users (${users.length})
          </h2>
          <div class="grid grid-cols-1" style="gap: var(--space-4);">
            ${users.map(renderUserResult).join('')}
          </div>
        </section>
      ` : ''}
      
      ${lists.length > 0 ? `
        <section>
          <h2 class="mb-4" style="font-size: var(--text-xl); font-weight: var(--font-semibold);">
            Public Lists (${lists.length})
          </h2>
          <div class="grid grid-cols-1" style="gap: var(--space-4);">
            ${lists.map(renderListResult).join('')}
          </div>
        </section>
      ` : ''}
      
      ${users.length === 0 && lists.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">No results found</h3>
          <p class="empty-state-description">Try searching with different keywords</p>
        </div>
      ` : ''}
    `;
  } catch (error) {
    resultsContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
}

/**
 * Render user search result
 */
function renderUserResult(user) {
  return `
    <div class="card">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="card-title">${escapeHtml(user.name)}</h3>
          <p class="text-small text-muted">@${escapeHtml(user.username)}</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="followUser(${user.id})">Follow</button>
      </div>
    </div>
  `;
}

/**
 * Render list search result
 */
function renderListResult(list) {
  return `
    <div class="card">
      <div class="flex justify-between items-start">
        <div style="flex: 1;">
          <h3 class="card-title mb-1">${escapeHtml(list.name)}</h3>
          <p class="text-small text-muted">by ${escapeHtml(list.username)} • ${list.itemCount || 0} items</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="followListFromSearch(${list.id})">Follow</button>
      </div>
    </div>
  `;
}

/**
 * Follow list from search
 */
async function followListFromSearch(listId) {
  try {
    const response = await listsAPI.follow(listId);
    
    if (response.success) {
      ui.showToast('Now following this list!', 'success');
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to follow list', 'error');
  }
}

/**
 * Follow user (follow all their public lists)
 */
async function followUser(userId) {
  ui.showToast('Feature coming soon: Follow all user lists', 'info');
}
