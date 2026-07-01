/**
 * Lists Management - Display and manage wishlists
 */

/**
 * Render Lists Page - Redirects to first available list
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
    }
    
    if (followedLists.length > 0) {
      window.location.hash = `#/lists/${followedLists[0].id}`;
      return;
    }
    
    // No lists - show empty state with create button
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h2 class="empty-state-title">${t('no_lists_yet')}</h2>
          <p class="empty-state-description">${t('no_lists_desc')}</p>
          <button class="btn btn-primary" onclick="showCreateListModal()">${t('create_list')}</button>
        </div>
      </div>
    `;
  } catch (error) {
    ui.showError(error.message || 'Failed to load lists');
  }
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
  if (!confirm(t('confirm_unfollow_list').replace('{name}', name))) {
    return;
  }
  
  try {
    const response = await listsAPI.unfollow(id);
    
    if (response.success) {
      ui.showToast(t('unfollowed_successfully'), 'success');
      // Reload to refresh the lists
      window.location.reload();
    }
  } catch (error) {
    ui.showToast(error.message || t('failed_to_unfollow'), 'error');
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
