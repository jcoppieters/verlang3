/**
 * Lists Management - Display and manage wishlists
 */

/**
 * Render Lists Page (My Lists + Followed Lists)
 */
async function renderListsPage() {
  ui.showLoading('Loading your lists...');
  
  try {
    const response = await listsAPI.getAll();
    
    if (!response.success) {
      throw new Error(response.error);
    }
    
    const { myLists, followedLists } = response;
    
    // Redirect to first list if available
    if (myLists.length > 0) {
      window.location.hash = `#/lists/${myLists[0].id}`;
      return;
    } else if (followedLists.length > 0) {
      window.location.hash = `#/lists/${followedLists[0].id}`;
      return;
    }
    
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="container">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold);">
            My Wishlists
          </h1>
          <button class="btn btn-primary" onclick="showCreateListModal()">
            + New List
          </button>
        </div>
        
        <!-- My Lists -->
        <section class="mb-8">
          <h2 class="mb-4" style="font-size: var(--text-xl); font-weight: var(--font-semibold);">
            My Lists (${myLists.length})
          </h2>
          
          <div class="grid grid-cols-1" id="myListsContainer">
            ${myLists.length === 0 ? renderEmptyState('You haven\'t created any lists yet', 'Create your first wishlist to get started!') : myLists.map(renderListCard).join('')}
          </div>
        </section>
        
        <!-- Followed Lists -->
        <section>
          <h2 class="mb-4" style="font-size: var(--text-xl); font-weight: var(--font-semibold);">
            Following (${followedLists.length})
          </h2>
          
          <div id="followedListsContainer">
            ${followedLists.length === 0 ? renderEmptyState('You\'re not following any lists yet', 'Search for friends to follow their wishlists!', '#/search') : renderGroupedFollowedLists(followedLists)}
          </div>
        </section>
      </div>
    `;
  } catch (error) {
    ui.showError(error.message || 'Failed to load lists');
  }
}

/**
 * Render a single list card (own list)
 */
function renderListCard(list) {
  return `
    <div class="card">
      <div class="flex justify-between items-start mb-3">
        <div style="flex: 1;">
          <h3 class="card-title mb-1">
            <a href="#/lists/${list.id}" style="color: var(--color-text-primary);">${escapeHtml(list.name)}</a>
          </h3>
          <p class="text-small text-muted">
            ${list.itemCount || 0} items • ${list.public === 'Y' ? 'Public' : 'Private'}
          </p>
        </div>
        
        <div class="flex gap-2">
          <button class="btn-text" onclick="editList(${list.id}, '${escapeHtml(list.name)}', '${list.public}')" title="Edit">
            ✏️
          </button>
          <button class="btn-text" onclick="shareListModal(${list.id}, '${escapeHtml(list.name)}')" title="Share">
            📧
          </button>
          <button class="btn-text" onclick="deleteList(${list.id}, '${escapeHtml(list.name)}')" title="Delete" style="color: var(--color-danger);">
            🗑️
          </button>
        </div>
      </div>
      
      <div class="flex gap-3">
        <a href="#/lists/${list.id}" class="btn btn-primary btn-sm">View Items</a>
        <a href="#/lists/${list.id}/add" class="btn btn-secondary btn-sm">+ Add Item</a>
      </div>
    </div>
  `;
}

/**
 * Render a followed list card
 */
function renderFollowedListCard(list) {
  return `
    <div class="card">
      <div class="flex justify-between items-start mb-3">
        <div style="flex: 1;">
          <h3 class="card-title mb-1">
            <a href="#/lists/${list.id}" style="color: var(--color-text-primary);">${escapeHtml(list.name)}</a>
          </h3>
          <p class="text-small text-muted">
            ${list.itemCount || 0} items
          </p>
        </div>
        
        <button class="btn-text" onclick="unfollowList(${list.id}, '${escapeHtml(list.name)}')" title="Unfollow" style="color: var(--color-danger);">
          ✖
        </button>
      </div>
      
      <a href="#/lists/${list.id}" class="btn btn-primary btn-sm">View Items</a>
    </div>
  `;
}

/**
 * Group followed lists by owner and render
 */
function renderGroupedFollowedLists(followedLists) {
  // Group lists by username (owner)
  const grouped = {};
  followedLists.forEach(list => {
    const owner = list.username || 'Unknown';
    if (!grouped[owner]) {
      grouped[owner] = [];
    }
    grouped[owner].push(list);
  });
  
  // Sort owners alphabetically
  const sortedOwners = Object.keys(grouped).sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
  
  // Sort lists within each owner alphabetically
  sortedOwners.forEach(owner => {
    grouped[owner].sort((a, b) => 
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  });
  
  // Render grouped lists
  return sortedOwners.map(owner => `
    <div class="mb-6">
      <h3 class="mb-3" style="font-size: var(--text-lg); font-weight: var(--font-semibold); color: var(--color-primary);">
        ${escapeHtml(owner)}
      </h3>
      <div class="grid grid-cols-1" style="gap: var(--space-3); margin-left: var(--space-4);">
        ${grouped[owner].map(renderFollowedListCard).join('')}
      </div>
    </div>
  `).join('');
}

/**
 * Render empty state
 */
function renderEmptyState(title, description, ctaLink = null) {
  return `
    <div class="empty-state" style="padding: var(--space-12) var(--space-4);">
      <div class="empty-state-icon">📋</div>
      <h3 class="empty-state-title">${title}</h3>
      <p class="empty-state-description">${description}</p>
      ${ctaLink ? `<a href="${ctaLink}" class="btn btn-primary">Search</a>` : ''}
    </div>
  `;
}

/**
 * Show create list modal
 */
function showCreateListModal() {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Create New List</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        
        <form id="createListForm">
          <div class="modal-body">
            <div class="form-group">
              <label class="label" for="listName">List Name</label>
              <input type="text" id="listName" name="name" class="input" required placeholder="e.g., Birthday 2026" />
            </div>
            
            <div class="form-group mb-0">
              <div class="checkbox-group">
                <input type="checkbox" id="listPublic" name="public" class="checkbox" />
                <label for="listPublic">Make this list public</label>
              </div>
              <p class="text-small text-muted mt-1">Public lists can be found by others</p>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
            <button type="submit" class="btn btn-blue">${t('create_list')}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('createListForm').addEventListener('submit', handleCreateList);
}

/**
 * Handle create list
 */
async function handleCreateList(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const listData = {
    name: formData.get('name').trim(),
    public: formData.get('public') ? 'Y' : 'N',
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Creating...';
  
  try {
    const response = await listsAPI.create(listData);
    
    if (response.success) {
      ui.showToast('List created successfully!', 'success');
      closeModal();
      // Reload to show the new list
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to create list', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create List';
  }
}

/**
 * Edit list
 */
function editList(id, name, isPublic) {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Edit List</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        
        <form id="editListForm" data-list-id="${id}">
          <div class="modal-body">
            <div class="form-group">
              <label class="label" for="editListName">List Name</label>
              <input type="text" id="editListName" name="name" class="input" value="${escapeHtml(name)}" required />
            </div>
            
            <div class="form-group mb-0">
              <div class="checkbox-group">
                <input type="checkbox" id="editListPublic" name="public" class="checkbox" ${isPublic === 'Y' ? 'checked' : ''} />
                <label for="editListPublic">Make this list public</label>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" onclick="deleteList(${id}, '${escapeHtml(name)}'); closeModal();" style="margin-right: auto;">🗑️ ${t('delete_list')}</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
            <button type="submit" class="btn btn-blue">${t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('editListForm').addEventListener('submit', handleEditList);
}

/**
 * Handle edit list
 */
async function handleEditList(e) {
  e.preventDefault();
  
  const listId = e.target.dataset.listId;
  const formData = new FormData(e.target);
  const listData = {
    name: formData.get('name').trim(),
    public: formData.get('public') ? 'Y' : 'N',
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Saving...';
  
  try {
    const response = await listsAPI.update(listId, listData);
    
    if (response.success) {
      ui.showToast('List updated successfully!', 'success');
      closeModal();
      // Always reload to refresh the list data
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to update list', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Changes';
  }
}

/**
 * Delete list
 */
async function deleteList(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all items in this list.`)) {
    return;
  }
  
  try {
    const response = await listsAPI.delete(id);
    
    if (response.success) {
      ui.showToast('List deleted successfully', 'success');
      // Always navigate to lists overview after delete
      window.location.hash = '#/lists';
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to delete list', 'error');
  }
}

/**
 * Unfollow list
 */
async function unfollowList(id, name) {
  if (!confirm(`Stop following "${name}"?`)) {
    return;
  }
  
  try {
    const response = await listsAPI.unfollow(id);
    
    if (response.success) {
      ui.showToast('Unfollowed successfully', 'success');
      // Reload to refresh the lists
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to unfollow', 'error');
  }
}

/**
 * Share list via email modal
 */
function shareListModal(id, name) {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal(event)">
      <div class="modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Share "${escapeHtml(name)}"</h2>
          <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        
        <form id="shareListForm" data-list-id="${id}">
          <div class="modal-body">
            <div class="form-group">
              <label class="label" for="shareEmail">Recipient Email</label>
              <input type="email" id="shareEmail" name="email" class="input" required placeholder="friend@example.com" />
            </div>
            
            <div class="form-group mb-0">
              <label class="label" for="shareMessage">Message (optional)</label>
              <textarea id="shareMessage" name="message" class="textarea" placeholder="Add a personal message..."></textarea>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">${t('cancel')}</button>
            <button type="submit" class="btn btn-blue">${t('send_invitation')}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('shareListForm').addEventListener('submit', handleShareList);
}

/**
 * Handle share list
 */
async function handleShareList(e) {
  e.preventDefault();
  
  const listId = e.target.dataset.listId;
  const formData = new FormData(e.target);
  const emailData = {
    email: formData.get('email').trim(),
    message: formData.get('message').trim(),
  };
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Sending...';
  
  try {
    const response = await listsAPI.share(listId, emailData);
    
    if (response.success) {
      ui.showToast('Email sent successfully!', 'success');
      closeModal();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to send email', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Email';
  }
}

/**
 * Close modal
 */
function closeModal(event) {
  if (event && event.target.classList.contains('modal-overlay')) {
    document.getElementById('modalContainer').innerHTML = '';
  } else if (!event) {
    document.getElementById('modalContainer').innerHTML = '';
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
