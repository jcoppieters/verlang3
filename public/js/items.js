/**
 * Items Management - Display and manage items in lists
 */

/**
 * Auto-format URL field to add https:// prefix
 */
function setupUrlAutoFormat(inputId) {
  const urlInput = document.getElementById(inputId);
  if (urlInput) {
    urlInput.addEventListener('input', function(e) {
      const value = e.target.value.trim();
      if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        e.target.value = 'https://' + value;
      }
    });
  }
}

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
    
    // Format last update date
    const lastUpdate = list.lastupdate ? new Date(list.lastupdate).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '';
    
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="container">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex justify-between items-start mb-4 list-header">
            <div class="flex items-center gap-3" style="flex: 1;">
              <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0;">
                ${escapeHtml(list.name)}
              </h1>
              ${isOwner ? `
                <button class="btn btn-sm btn-primary" onclick="showAddItemModal(${listId})" title="Add Item" style="min-width: 90px;">
                  + Add
                </button>
              ` : ''}
            </div>
            ${isOwner ? `
              <button class="btn btn-sm btn-secondary list-edit-btn" onclick="editList(${listId}, '${escapeHtml(list.name)}', '${list.public}')" title="${t('edit')}" style="min-width: 90px;">
                ✏️ ${t('edit')}
              </button>
            ` : `
              <button class="btn btn-sm btn-secondary" onclick="unfollowList(${listId}, '${escapeHtml(list.name)}')" title="${t('unfollow')}" style="min-width: 90px;">
                ✖ ${t('unfollow')}
              </button>
            `}
          </div>
          <p class="text-muted">
            ${isOwner ? t('your_list') : `${t('by')} ${escapeHtml(list.ownerName)}`} • 
            ${items.length} ${t('items')}
            ${lastUpdate ? `<br><span style="font-size: var(--text-sm);">${t('last_update')}: ${lastUpdate}</span>` : ''}
          </p>
        </div>
        
        <!-- Items Grid -->
        <div class="grid grid-cols-1" id="itemsContainer">
          ${items.length === 0 ? renderEmptyItemsState(isOwner) : items.map(item => renderItemCard(item, isOwner)).join('')}
        </div>
      </div>
    `;
    
    // Initialize drag and drop for owners
    if (isOwner && items.length > 0) {
      initializeDragAndDrop();
    }
  } catch (error) {
    ui.showError(error.message || 'Failed to load list');
  }
}

/**
 * Render item card
 */
function renderItemCard(item, isOwner) {
  // For owner: show badge only if shown === 'T' (showfrom date has passed)
  // For non-owner: always show badge
  const statusBadge = !isOwner ? getStatusBadge(item.status) : 
                      (item.shown === 'T' ? getStatusBadge(item.status) : '');
  const canInteract = !isOwner && item.status === 'A';
  
  return `
    <div class="card item-card" ${isOwner ? `draggable="true" data-item-id="${item.id}" data-item-priority="${item.priority || 50}"` : ''}>
      ${isOwner ? '<div class="drag-handle">⋮⋮</div>' : ''}
      
      <!-- Mobile Layout -->
      <div class="item-card-mobile">
        <div class="item-header-mobile">
          <h3 class="card-title" style="flex: 1; margin-bottom: 0;">${escapeHtml(item.name)}</h3>
          <div class="item-actions-mobile">
            ${isOwner ? renderOwnerActions(item) : renderGuestActions(item, canInteract)}
          </div>
        </div>
        
        ${item.description ? `<p class="text-muted mb-3">${escapeHtml(item.description)}</p>` : ''}
        
        <div class="item-footer-mobile">
          <div class="flex gap-4 text-small text-muted">
            ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" class="text-primary">🔗 ${t('link')}</a>` : ''}
            ${item.price ? `<span>💰 €${item.price}</span>` : ''}
          </div>
          ${statusBadge ? `<div>${statusBadge}</div>` : ''}
        </div>
        
        ${!isOwner && item.status === 'R' && item.username ? `
          <p class="text-small" style="color: var(--color-warning); margin-top: var(--space-2);">
            ${t('reserved_by')} ${escapeHtml(item.username)}
          </p>
        ` : ''}
        
        ${!isOwner && item.status === 'S' && item.username ? `
          <p class="text-small" style="color: var(--color-success); margin-top: var(--space-2);">
            ${t('donated_by')} ${escapeHtml(item.username)}
          </p>
        ` : ''}
        
        ${isOwner && item.status === 'S' && item.shown === 'T' && item.username ? `
          <p class="text-small" style="color: var(--color-success); margin-top: var(--space-2);">
            ${t('donated_by')} ${escapeHtml(item.username)}
            ${item.givencomment ? `<br><em>"${escapeHtml(item.givencomment)}"</em>` : ''}
          </p>
        ` : ''}
      </div>
      
      <!-- Desktop Layout -->
      <div class="item-card-desktop">
        <div class="flex justify-between items-start gap-4">
          <!-- Item Details -->
          <div style="flex: 1;">
            <div class="flex items-start justify-between gap-3 mb-2">
              <h3 class="card-title" style="flex: 1;">${escapeHtml(item.name)}</h3>
              ${statusBadge}
            </div>
            
            ${item.description ? `<p class="text-muted mb-3">${escapeHtml(item.description)}</p>` : ''}
            
            <div class="flex gap-4 text-small text-muted mb-3">
              ${item.url ? `<a href="${escapeHtml(item.url)}" target="_blank" class="text-primary">🔗 ${t('link')}</a>` : ''}
              ${item.price ? `<span>💰 €${item.price}</span>` : ''}
            </div>
            
            ${!isOwner && item.status === 'R' && item.username ? `
              <p class="text-small" style="color: var(--color-warning);">
                ${t('reserved_by')} ${escapeHtml(item.username)}
              </p>
            ` : ''}
            
            ${!isOwner && item.status === 'S' && item.username ? `
              <p class="text-small" style="color: var(--color-success);">
                ${t('donated_by')} ${escapeHtml(item.username)}
              </p>
            ` : ''}
            
            ${isOwner && item.status === 'S' && item.shown === 'T' && item.username ? `
              <p class="text-small" style="color: var(--color-success);">
                ${t('donated_by')} ${escapeHtml(item.username)}
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
    </div>
  `;
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
  const badges = {
    'R': `<span class="badge badge-warning">${t('reserved')}</span>`,
    'S': `<span class="badge badge-secondary">${t('donated')}</span>`,
  };
  return badges[status] || '';
}

/**
 * Render owner action buttons
 */
function renderOwnerActions(item) {
  return `<button class="btn btn-sm btn-secondary" onclick="showEditItemModal(${item.id})" title="${t('edit')}">✏️ ${t('edit')}</button>`;
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
        ${t('mark_as_reserved')}
      </button>
      <button class="btn btn-sm btn-success" onclick="donateItem(${item.id}, '${escapeHtml(item.name)}')">
        ${t('mark_as_donated')}
      </button>
    `;
  }
  
  // If reserved by me, show Donate and Take Back buttons
  if (isReservedByMe) {
    return `
      <button class="btn btn-sm btn-success" onclick="donateItem(${item.id}, '${escapeHtml(item.name)}')">
        ${t('mark_as_donated')}
      </button>
      <button class="btn btn-sm btn-secondary" onclick="takebackItem(${item.id})">
        ${t('unmark')}
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
        <a href="#/lists/${listId}" class="btn-text">${t('back_to_list')}</a>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${t('add_new_item')}</h2>
        </div>
        
        <form id="addItemForm" data-list-id="${listId}">
          <div class="form-group">
            <label class="label" for="itemName">${t('item_name')} *</label>
            <input type="text" id="itemName" name="name" class="input" required placeholder="${t('enter_item_name')}" />
          </div>
          
          <div class="form-group">
            <label class="label" for="itemDescription">${t('description')}</label>
            <textarea id="itemDescription" name="description" class="textarea" placeholder="${t('enter_item_description')}"></textarea>
          </div>
          
          <div class="form-group">
            <label class="label" for="itemUrl">${t('url_link')}</label>
            <input type="url" id="itemUrl" name="url" class="input" placeholder="${t('enter_item_link')}" />
          </div>
          
          <div class="grid grid-cols-2" style="gap: var(--space-4);">
            <div class="form-group">
              <label class="label" for="itemPrice">${t('price')}</label>
              <input type="number" id="itemPrice" name="price" class="input" step="0.01" min="0" placeholder="${t('enter_item_price')}" />
            </div>
            
            <div class="form-group">
              <label class="label" for="itemPriority">${t('priority')}</label>
              <select id="itemPriority" name="priority" class="select">
                <option value="1">${t('low')}</option>
                <option value="2">${t('medium')}</option>
                <option value="3" selected>${t('high')}</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="label" for="itemShowFrom">${t('show_from_date')}</label>
            <input type="date" id="itemShowFrom" name="showfrom" class="input" />
            <p class="text-small text-muted mt-1">${t('show_from_hint')}</p>
          </div>
          
          <div class="card-footer">
            <button type="button" class="btn btn-secondary" onclick="window.history.back()">${t('cancel')}</button>
            <button type="submit" class="btn btn-primary">${t('add_item')}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('addItemForm').addEventListener('submit', handleAddItem);
  setupUrlAutoFormat('itemUrl');
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
  submitBtn.innerHTML = `<span class="loading-inline"></span> ${t('adding')}`;
  
  try {
    const response = await itemsAPI.add(listId, itemData);
    
    if (response.success) {
      ui.showToast(t('item_added'), 'success');
      window.location.hash = `#/lists/${listId}`;
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to add item', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = t('add_item');
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
            
            <div class="form-group">
              <label class="label" for="itemPrice">Price (€)</label>
              <input type="number" id="itemPrice" name="price" class="input" step="0.01" min="0" placeholder="0.00" />
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
            <button type="submit" class="btn btn-blue">${t('add')}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('addItemModalForm').addEventListener('submit', handleAddItemModal);
  setupUrlAutoFormat('itemUrl');
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
    priority: 100, // New items get highest priority by default
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="loading-inline"></span> ${t('adding')}`;
  
  try {
    const response = await itemsAPI.add(listId, itemData);
    
    if (response.success) {
      ui.showToast(t('item_added'), 'success');
      closeModal();
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to add item', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = t('add_item');
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
      ui.showToast(t('item_not_found'), 'error');
      return;
    }
    
    const modal = document.getElementById('modalContainer');
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeModal(event)">
        <div class="modal item-modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h2>${t('edit_item')}</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
          </div>
          
          <form id="editItemModalForm" data-item-id="${itemId}">
            <div class="modal-body">
              <div class="form-group">
                <label class="label" for="editItemName">${t('item_name')} *</label>
                <input type="text" id="editItemName" name="name" class="input" required value="${escapeHtml(item.name)}" />
              </div>
              
              <div class="form-group">
                <label class="label" for="editItemDescription">${t('description')}</label>
                <textarea id="editItemDescription" name="description" class="textarea">${escapeHtml(item.description || '')}</textarea>
              </div>
              
              <div class="form-group">
                <label class="label" for="editItemUrl">${t('url_link')}</label>
                <input type="url" id="editItemUrl" name="url" class="input" value="${escapeHtml(item.url || '')}" />
              </div>
              
              <div class="form-group">
                <label class="label" for="editItemPrice">${t('price')}</label>
                <input type="number" id="editItemPrice" name="price" class="input" step="0.01" min="0" value="${item.price || ''}" />
              </div>
            </div>
            
            <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
              <button type="button" class="btn btn-danger" onclick="deleteItemFromModal(${itemId}, '${escapeHtml(item.name)}')">
                ${t('delete')}
              </button>
              <div style="display: flex; gap: var(--space-2);">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
                <button type="submit" class="btn btn-blue">${t('save')}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.getElementById('editItemModalForm').addEventListener('submit', handleEditItemModal);
    setupUrlAutoFormat('editItemUrl');
  } catch (error) {
    ui.showToast(t('failed_to_load_item'), 'error');
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
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="loading-inline"></span> ${t('saving')}`;
  
  try {
    const response = await itemsAPI.update(itemId, itemData);
    
    if (response.success) {
      ui.showToast(t('item_updated'), 'success');
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
            
            <div class="form-group">
              <label class="label" for="donateShowFrom">Show from date (optional)</label>
              <input type="date" id="donateShowFrom" name="showfrom" class="input" />
              <p class="text-small text-muted" style="margin-top: var(--space-1);">When should this donation be revealed to the list owner?</p>
            </div>
            
            <div class="form-group mb-0">
              <label class="label" for="donateComment">Add a comment (optional)</label>
              <textarea id="donateComment" name="comment" class="textarea" placeholder="Leave a message..."></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
            <button type="submit" class="btn btn-success">${t('mark_as_donated')}</button>
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
  const formData = new FormData(e.target);
  const showfrom = formData.get('showfrom');
  const comment = formData.get('comment');
  
  const data = {
    comment: comment || '',
    showfrom: showfrom || null
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Processing...';
  
  try {
    const response = await itemsAPI.donate(itemId, data);
    
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
            <button type="button" class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
            <button type="submit" class="btn btn-warning">${t('mark_as_reserved')}</button>
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
      <div class="flex justify-between items-center mb-6">
        <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0;">
          Search
        </h1>
        <button class="btn btn-secondary btn-sm mobile-only" onclick="window.history.back()">${t('cancel')}</button>
      </div>
      
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
            <button type="submit" class="btn btn-primary">${t('search')}</button>
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
    
    // Group lists by user
    const grouped = {};
    
    // Add users with their lists
    lists.forEach(list => {
      const userName = list.username || 'Unknown';
      const userId = list.userId;
      
      if (!grouped[userId]) {
        grouped[userId] = {
          name: userName,
          lists: []
        };
      }
      grouped[userId].lists.push(list);
    });
    
    // Add users without lists (only if they match the search but have no public lists shown)
    users.forEach(user => {
      if (!grouped[user.id]) {
        grouped[user.id] = {
          name: user.name,
          username: user.username,
          lists: []
        };
      } else {
        // Add username info if not already there
        grouped[user.id].username = user.username;
      }
    });
    
    const hasResults = Object.keys(grouped).length > 0;
    
    resultsContainer.innerHTML = hasResults ? `
      <h2 style="font-size: var(--text-3xl); font-weight: var(--font-bold); color: #E85D4A; margin-bottom: var(--space-6);">
        Gezocht op: ${escapeHtml(query)}
      </h2>
      <p class="text-muted mb-4">Klik op de naam van een lijstje om het bij te voegen bij de lijstjes die je volgt.</p>
      <div class="grid grid-cols-1" style="gap: var(--space-6);">
        ${Object.entries(grouped).map(([userId, userData]) => `
          <div>
            <div style="font-size: var(--text-lg); font-weight: var(--font-semibold); margin-bottom: var(--space-3);">
              ${escapeHtml(userData.name)}
            </div>
            ${userData.lists.length > 0 ? `
              <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); margin-left: var(--space-4);">
                ${userData.lists.map(list => `
                  <button class="btn btn-secondary btn-sm" onclick="followListFromSearch(${list.id})" style="display: inline-flex; align-items: center; gap: var(--space-1);">
                    <span style="font-size: 1.2em;">+</span> ${escapeHtml(list.name)}
                  </button>
                `).join('')}
              </div>
            ` : `
              <p class="text-muted" style="margin-left: var(--space-4);">No public lists</p>
            `}
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">No results found</h3>
        <p class="empty-state-description">Try searching with different keywords</p>
      </div>
    `;
  } catch (error) {
    resultsContainer.innerHTML = `<p class="text-danger">${error.message}</p>`;
  }
}

/**
 * Follow list from search
 */
async function followListFromSearch(listId) {
  try {
    const response = await listsAPI.follow(listId);
    
    if (response.success) {
      ui.showToast('Now following this list!', 'success');
      // Refresh sidebar to show the newly followed list
      await loadSidebar();
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

/**
 * Initialize drag and drop for reordering items
 */
let draggedElement = null;
let draggedOverElement = null;
let touchStartY = 0;
let touchCurrentY = 0;
let placeholder = null;

function initializeDragAndDrop() {
  const itemCards = document.querySelectorAll('.item-card[draggable="true"]');
  
  itemCards.forEach(card => {
    // Desktop drag and drop
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('dragenter', handleDragEnter);
    card.addEventListener('dragleave', handleDragLeave);
    
    // Mobile touch events
    card.addEventListener('touchstart', handleTouchStart, { passive: false });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd);
  });
}

function handleDragStart(e) {
  draggedElement = e.currentTarget;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  if (e.currentTarget !== draggedElement) {
    e.currentTarget.classList.add('drag-over');
    draggedOverElement = e.currentTarget;
  }
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  const target = e.currentTarget;
  
  if (draggedElement !== target) {
    // Get the container
    const container = document.getElementById('itemsContainer');
    const items = Array.from(container.querySelectorAll('.item-card'));
    
    const draggedIndex = items.indexOf(draggedElement);
    const targetIndex = items.indexOf(target);
    
    // Reorder in DOM
    if (draggedIndex < targetIndex) {
      target.parentNode.insertBefore(draggedElement, target.nextSibling);
    } else {
      target.parentNode.insertBefore(draggedElement, target);
    }
    
    // Update priorities
    updateItemPriorities();
  }
  
  return false;
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  
  // Remove all drag-over classes
  const items = document.querySelectorAll('.item-card');
  items.forEach(item => {
    item.classList.remove('drag-over');
  });
  
  draggedElement = null;
  draggedOverElement = null;
}

/**
 * Touch event handlers for mobile
 */
function handleTouchStart(e) {
  // Don't start drag if touching a button, link, or input
  const target = e.target;
  if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea')) {
    return;
  }
  
  draggedElement = e.currentTarget;
  touchStartY = e.touches[0].clientY;
  
  draggedElement.classList.add('dragging');
  
  // Create a placeholder
  placeholder = document.createElement('div');
  placeholder.className = 'drag-placeholder';
  placeholder.style.height = draggedElement.offsetHeight + 'px';
}

function handleTouchMove(e) {
  e.preventDefault();
  
  if (!draggedElement) return;
  
  touchCurrentY = e.touches[0].clientY;
  const deltaY = touchCurrentY - touchStartY;
  
  // Move the element visually
  draggedElement.style.transform = `translateY(${deltaY}px)`;
  draggedElement.style.zIndex = '1000';
  
  // Find element under touch point
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  
  // Temporarily hide the dragged element to get the element underneath
  draggedElement.style.visibility = 'hidden';
  const elementBelow = document.elementFromPoint(touchX, touchY);
  draggedElement.style.visibility = 'visible';
  
  // Find the card element
  const cardBelow = elementBelow?.closest('.item-card');
  
  if (cardBelow && cardBelow !== draggedElement) {
    // Remove previous highlights
    document.querySelectorAll('.item-card').forEach(card => {
      card.classList.remove('drag-over');
    });
    
    cardBelow.classList.add('drag-over');
    
    // Reorder in DOM
    const container = document.getElementById('itemsContainer');
    const items = Array.from(container.querySelectorAll('.item-card'));
    const draggedIndex = items.indexOf(draggedElement);
    const targetIndex = items.indexOf(cardBelow);
    
    if (draggedIndex < targetIndex) {
      cardBelow.parentNode.insertBefore(draggedElement, cardBelow.nextSibling);
    } else {
      cardBelow.parentNode.insertBefore(draggedElement, cardBelow);
    }
    
    // Reset position for new placement
    touchStartY = touchCurrentY;
    draggedElement.style.transform = '';
  }
}

function handleTouchEnd(e) {
  if (!draggedElement) return;
  
  // Reset styles
  draggedElement.style.transform = '';
  draggedElement.style.zIndex = '';
  draggedElement.classList.remove('dragging');
  
  // Remove all drag-over classes
  document.querySelectorAll('.item-card').forEach(card => {
    card.classList.remove('drag-over');
  });
  
  // Remove placeholder if exists
  if (placeholder && placeholder.parentNode) {
    placeholder.parentNode.removeChild(placeholder);
  }
  
  // Update priorities
  updateItemPriorities();
  
  draggedElement = null;
  placeholder = null;
}

/**
 * Update priorities after reordering
 */
async function updateItemPriorities() {
  const container = document.getElementById('itemsContainer');
  const items = Array.from(container.querySelectorAll('.item-card'));
  
  // Get list ID from URL
  const listId = window.location.hash.match(/#\/lists\/(\d+)/)?.[1];
  if (!listId) {
    ui.showToast('List ID not found', 'error');
    return;
  }
  
  // Get item IDs in current order (top to bottom)
  const itemIds = items.map(item => parseInt(item.dataset.itemId));
  
  // Send batch update to backend
  try {
    await itemsAPI.reorder(listId, itemIds);
    
    // Update data attributes for visual consistency
    items.forEach((item, index) => {
      item.dataset.itemPriority = 100 - index;
    });
    
    ui.showToast('Order updated', 'success');
  } catch (error) {
    ui.showToast('Failed to update order', 'error');
    console.error('Update priorities error:', error);
  }
}
