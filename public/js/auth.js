/**
 * Authentication Pages - Login, Register, Profile
 */

/**
 * Render Login Page
 */
function renderLoginPage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 480px; margin-top: 60px;">
      <div class="card auth-card">
        <div class="text-center mb-6">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎁</div>
          <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">
            ${t('welcome_back')}
          </h1>
          <p class="text-muted">${t('sign_in_to_manage')}</p>
        </div>
        
        <form id="loginForm">
          <div class="form-group">
            <label class="label" for="username">${t('username_or_email')}</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              class="input" 
              required 
              autocomplete="username"
              placeholder="${t('enter_username_or_email')}"
            />
            <span class="error-message" id="usernameError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="password">${t('password')}</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              class="input" 
              required 
              autocomplete="current-password"
              placeholder="${t('enter_password')}"
            />
            <span class="error-message" id="passwordError"></span>
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block btn-lg">
              ${t('sign_in')}
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-small">
              <a href="#/forgot-password" class="text-primary">${t('forgot_password')}</a>
            </p>
            <p class="text-small text-muted">
              ${t('dont_have_account')} 
              <a href="#/register" class="text-primary">${t('sign_up')}</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Handle form submission
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

/**
 * Handle Login Form Submission
 */
async function handleLogin(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const credentials = {
    username: formData.get('username').trim(),
    password: formData.get('password'),
  };
  
  // Clear previous errors
  document.getElementById('usernameError').textContent = '';
  document.getElementById('passwordError').textContent = '';
  
  // Disable submit button
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="loading-inline"></span> ${t('signing_in')}`;
  
  try {
    const response = await authAPI.login(credentials);
    
    if (response.success) {
      ui.showToast(t('welcome_back'), 'success');
      window.location.hash = '#/lists';
    }
  } catch (error) {
    ui.showToast(error.message || t('login_failed'), 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = t('sign_in');
  }
}

/**
 * Render Register Page
 */
function renderRegisterPage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 480px; margin-top: 40px;">
      <div class="card auth-card">
        <div class="text-center mb-6">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎁</div>
          <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">
            ${t('create_account')}
          </h1>
          <p class="text-muted">${t('join_verlanglijstje')}</p>
        </div>
        
        <form id="registerForm">
          <div class="form-group">
            <label class="label" for="regName">${t('full_name')}</label>
            <input 
              type="text" 
              id="regName" 
              name="name" 
              class="input" 
              required 
              placeholder="${t('enter_full_name')}"
            />
            <span class="error-message" id="nameError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="regUsername">${t('username')}</label>
            <input 
              type="text" 
              id="regUsername" 
              name="username" 
              class="input" 
              required 
              autocomplete="username"
              placeholder="${t('enter_username')}"
            />
            <span class="error-message" id="regUsernameError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="regEmail">${t('email')}</label>
            <input 
              type="email" 
              id="regEmail" 
              name="email" 
              class="input" 
              required 
              autocomplete="email"
              placeholder="${t('enter_email')}"
            />
            <span class="error-message" id="emailError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="regPassword">${t('password')}</label>
            <input 
              type="password" 
              id="regPassword" 
              name="password" 
              class="input" 
              required 
              autocomplete="new-password"
              placeholder="${t('enter_password')}"
              minlength="6"
            />
            <span class="error-message" id="regPasswordError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="regConfirmPassword">${t('confirm_password')}</label>
            <input 
              type="password" 
              id="regConfirmPassword" 
              name="confirmPassword" 
              class="input" 
              required 
              autocomplete="new-password"
              placeholder="${t('enter_confirm_password')}"
            />
            <span class="error-message" id="confirmPasswordError"></span>
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block btn-lg">
              ${t('create_account')}
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-small text-muted">
              ${t('already_have_account')} 
              <a href="#/login" class="text-primary">${t('sign_in')}</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Handle form submission
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

/**
 * Handle Register Form Submission
 */
async function handleRegister(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const userData = {
    name: formData.get('name').trim(),
    username: formData.get('username').trim(),
    email: formData.get('email').trim(),
    password: formData.get('password'),
  };
  const confirmPassword = formData.get('confirmPassword');
  
  // Clear previous errors
  ['nameError', 'regUsernameError', 'emailError', 'regPasswordError', 'confirmPasswordError'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
  
  // Validate passwords match
  if (userData.password !== confirmPassword) {
    document.getElementById('confirmPasswordError').textContent = t('passwords_do_not_match');
    return;
  }
  
  // Disable submit button
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="loading-inline"></span> ${t('creating_account')}`;
  
  try {
    const response = await authAPI.register(userData);
    
    if (response.success) {
      ui.showToast(t('account_created_successfully'), 'success');
      window.location.hash = '#/lists';
    }
  } catch (error) {
    ui.showToast(error.message || t('registration_failed'), 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = t('create_account');
  }
}

/**
 * Render Profile Page
 */
function renderProfilePage() {
  const user = ui.getCurrentUser();
  const currentLang = i18n.getCurrentLanguage();
  
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 800px;">
      <h1 class="mb-6" style="font-size: var(--text-3xl); font-weight: var(--font-bold);">
        ${t('my_profile')}
      </h1>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">${t('profile_information')}</h2>
        </div>
        
        <form id="profileForm">
          <div class="form-group">
            <label class="label" for="profileName">${t('full_name_label')}</label>
            <input 
              type="text" 
              id="profileName" 
              name="name" 
              class="input" 
              value="${escapeHtml(user?.name || '')}" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label class="label" for="profileUsername">${t('username_label')}</label>
            <input 
              type="text" 
              id="profileUsername" 
              name="username" 
              class="input" 
              value="${escapeHtml(user?.username || '')}" 
              required 
              readonly
              style="background-color: var(--color-bg-tertiary); cursor: not-allowed;"
              title="${t('username_cannot_change')}"
            />
            <span class="text-small text-muted">${t('username_cannot_change')}</span>
          </div>
          
          <div class="form-group">
            <label class="label" for="profileEmail">${t('email_label')}</label>
            <input 
              type="email" 
              id="profileEmail" 
              name="email" 
              class="input" 
              value="${escapeHtml(user?.email || '')}" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label class="label" for="profileLanguage">${t('language')}</label>
            <select 
              id="profileLanguage" 
              name="language" 
              class="input"
            >
              <option value="NL" ${currentLang === 'NL' ? 'selected' : ''}>Nederlands</option>
              <option value="FR" ${currentLang === 'FR' ? 'selected' : ''}>Français</option>
              <option value="EN" ${currentLang === 'EN' ? 'selected' : ''}>English</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="label" for="profilePassword">${t('password_label')}</label>
            <input 
              type="password" 
              id="profilePassword" 
              name="password" 
              class="input" 
              autocomplete="new-password"
              placeholder="${t('password_placeholder')}"
            />
            <span class="text-small text-muted">${t('password_hint')}</span>
          </div>
          
          <div class="card-footer">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: var(--space-3);">
              <div style="display: flex; gap: var(--space-3);">
                <button type="submit" class="btn btn-blue">
                  ${t('save_changes')}
                </button>
                <button type="button" class="btn btn-secondary" onclick="window.location.hash='#/lists'">
                  ${t('cancel')}
                </button>
              </div>
              <div style="display: flex; gap: var(--space-3);">
                <button type="button" class="btn btn-secondary" onclick="authAPI.logout()">
                  ${t('logout')}
                </button>
                <button type="button" class="btn btn-secondary" onclick="showForgetMeComingSoon()" title="${t('forget_about_me_desc')}">
                  ${t('forget_about_me')}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Handle profile form submission
  document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
}

/**
 * Handle Profile Update
 */
async function handleProfileUpdate(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const password = formData.get('password')?.trim();
  const newLanguage = formData.get('language');
  const currentLanguage = i18n.getCurrentLanguage();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Saving...';
  
  try {
    // Update profile (name, email, language)
    const userData = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
      language: newLanguage
    };
    
    const profileResponse = await authAPI.updateProfile(userData);
    
    if (!profileResponse.success) {
      throw new Error(profileResponse.error || 'Failed to update profile');
    }
    
    // Update password if provided
    if (password && password.length > 0) {
      const passwordResponse = await authAPI.updatePassword({
        currentPassword: '', // Not needed for plain text passwords
        newPassword: password
      });
      
      if (!passwordResponse.success) {
        throw new Error(passwordResponse.error || 'Failed to update password');
      }
      
      ui.showToast(t('profile_and_password_updated'), 'success');
    } else {
      ui.showToast(t('profile_updated'), 'success');
    }
    
    // Update navbar
    document.getElementById('userName').textContent = userData.name;
    
    // Clear password field
    document.getElementById('profilePassword').value = '';
    
    // If language changed, update and reload
    if (newLanguage !== currentLanguage) {
      i18n.setLanguage(newLanguage);
      // Reload page after short delay to show success message
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
    
  } catch (error) {
    ui.showToast(error.message || 'Failed to update profile', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = t('save_changes');
  }
}

/**
 * Show coming soon toast for forget me feature
 */
function showForgetMeComingSoon() {
  ui.showToast(t('coming_soon'), 'info');
}

/**
 * Render Forgot Password Page
 */
function renderForgotPasswordPage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 480px; margin-top: 60px;">
      <div class="card auth-card">
        <div class="text-center mb-6">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
          <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">
            ${t('forgot_password_title')}
          </h1>
          <p class="text-muted">${t('forgot_password_description')}</p>
        </div>
        
        <form id="forgotPasswordForm">
          <div class="form-group">
            <label class="label" for="email">${t('email')}</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              class="input" 
              required 
              autocomplete="email"
              placeholder="${t('enter_email')}"
            />
            <span class="error-message" id="emailError"></span>
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block btn-lg">
              ${t('send_reset_link')}
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-small">
              <a href="#/login" class="text-primary">${t('back_to_login')}</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
}

/**
 * Handle Forgot Password Form Submission
 */
async function handleForgotPassword(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const email = formData.get('email').trim();
  
  document.getElementById('emailError').textContent = '';
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="loading-inline"></span> ${t('sending')}`;
  
  try {
    const response = await authAPI.forgotPassword(email);
    
    if (response.success) {
      ui.showToast(t('reset_link_sent'), 'success');
      // Clear the form
      e.target.reset();
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 2000);
    }
  } catch (error) {
    ui.showToast(error.message || t('password_reset_failed'), 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = t('send_reset_link');
  }
}

/**
 * Render Reset Password Page
 */
function renderResetPasswordPage() {
  // Get token from URL query params
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const token = urlParams.get('token');
  
  if (!token) {
    ui.showToast(t('invalid_reset_token'), 'error');
    window.location.hash = '#/login';
    return;
  }
  
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 480px; margin-top: 60px;">
      <div class="card auth-card">
        <div class="text-center mb-6">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔑</div>
          <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">
            ${t('reset_password_title')}
          </h1>
          <p class="text-muted">${t('reset_password_description')}</p>
        </div>
        
        <form id="resetPasswordForm" data-token="${escapeHtml(token)}">
          <div class="form-group">
            <label class="label" for="newPassword">${t('new_password')}</label>
            <input 
              type="password" 
              id="newPassword" 
              name="newPassword" 
              class="input" 
              required 
              autocomplete="new-password"
              placeholder="${t('enter_new_password')}"
              minlength="6"
            />
            <span class="error-message" id="newPasswordError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="confirmNewPassword">${t('confirm_new_password')}</label>
            <input 
              type="password" 
              id="confirmNewPassword" 
              name="confirmNewPassword" 
              class="input" 
              required 
              autocomplete="new-password"
              placeholder="${t('confirm_new_password')}"
            />
            <span class="error-message" id="confirmNewPasswordError"></span>
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block btn-lg">
              ${t('reset_password_button')}
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-small">
              <a href="#/login" class="text-primary">${t('back_to_login')}</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('resetPasswordForm').addEventListener('submit', handleResetPassword);
}

/**
 * Handle Reset Password Form Submission
 */
async function handleResetPassword(e) {
  e.preventDefault();
  
  const token = e.target.dataset.token;
  const formData = new FormData(e.target);
  const newPassword = formData.get('newPassword');
  const confirmNewPassword = formData.get('confirmNewPassword');
  
  // Clear errors
  document.getElementById('newPasswordError').textContent = '';
  document.getElementById('confirmNewPasswordError').textContent = '';
  
  // Validate passwords match
  if (newPassword !== confirmNewPassword) {
    document.getElementById('confirmNewPasswordError').textContent = t('passwords_do_not_match');
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="loading-inline"></span> ${t('resetting_password')}`;
  
  try {
    const response = await authAPI.resetPassword(token, newPassword);
    
    if (response.success) {
      ui.showToast(t('password_reset_success'), 'success');
      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1500);
    }
  } catch (error) {
    const errorMessage = error.message || t('password_reset_failed');
    ui.showToast(errorMessage, 'error');
    
    // If invalid token, redirect to login after showing error
    if (errorMessage.includes('Invalid') || errorMessage.includes('expired')) {
      setTimeout(() => {
        window.location.hash = '#/login';
      }, 2000);
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = t('reset_password_button');
    }
  }
}

/**
 * Handle Password Update
 */
async function handlePasswordUpdate(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const passwords = {
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
  };
  const confirmNewPassword = formData.get('confirmNewPassword');
  
  // Clear error
  document.getElementById('confirmNewPasswordError').textContent = '';
  
  // Validate
  if (passwords.newPassword !== confirmNewPassword) {
    document.getElementById('confirmNewPasswordError').textContent = 'Passwords do not match';
    return;
  }
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Updating...';
  
  try {
    const response = await authAPI.updatePassword(passwords);
    
    if (response.success) {
      ui.showToast('Password updated successfully', 'success');
      e.target.reset();
    }
  } catch (error) {
    ui.showToast(error.message || 'Failed to update password', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Update Password';
  }
}
