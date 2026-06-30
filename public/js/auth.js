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
      <div class="card">
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
  submitBtn.innerHTML = '<span class="loading-inline"></span> Signing in...';
  
  try {
    const response = await authAPI.login(credentials);
    
    if (response.success) {
      ui.showToast('Welcome back!', 'success');
      window.location.hash = '#/lists';
    }
  } catch (error) {
    ui.showToast(error.message || 'Login failed', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }
}

/**
 * Render Register Page
 */
function renderRegisterPage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 480px; margin-top: 40px;">
      <div class="card">
        <div class="text-center mb-6">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎁</div>
          <h1 style="font-size: var(--text-3xl); font-weight: var(--font-bold); margin-bottom: 0.5rem;">
            Create Account
          </h1>
          <p class="text-muted">Join Verlanglijstje.be today</p>
        </div>
        
        <form id="registerForm">
          <div class="form-group">
            <label class="label" for="regName">Full Name</label>
            <input 
              type="text" 
              id="regName" 
              name="name" 
              class="input" 
              required 
              placeholder="Your full name"
            />
            <span class="error-message" id="nameError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="regUsername">Username</label>
            <input 
              type="text" 
              id="regUsername" 
              name="username" 
              class="input" 
              required 
              autocomplete="username"
              placeholder="Choose a username"
            />
            <span class="error-message" id="regUsernameError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="regEmail">Email</label>
            <input 
              type="email" 
              id="regEmail" 
              name="email" 
              class="input" 
              required 
              autocomplete="email"
              placeholder="your.email@example.com"
            />
            <span class="error-message" id="emailError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="regPassword">Password</label>
            <input 
              type="password" 
              id="regPassword" 
              name="password" 
              class="input" 
              required 
              autocomplete="new-password"
              placeholder="Choose a strong password"
              minlength="6"
            />
            <span class="error-message" id="regPasswordError"></span>
          </div>
          
          <div class="form-group">
            <label class="label" for="regConfirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="regConfirmPassword" 
              name="confirmPassword" 
              class="input" 
              required 
              autocomplete="new-password"
              placeholder="Confirm your password"
            />
            <span class="error-message" id="confirmPasswordError"></span>
          </div>
          
          <div class="form-group">
            <button type="submit" class="btn btn-primary btn-block btn-lg">
              Create Account
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-small text-muted">
              Already have an account? 
              <a href="#/login" class="text-primary">Sign in</a>
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
    document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
    return;
  }
  
  // Disable submit button
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Creating account...';
  
  try {
    const response = await authAPI.register(userData);
    
    if (response.success) {
      ui.showToast('Account created successfully!', 'success');
      window.location.hash = '#/lists';
    }
  } catch (error) {
    ui.showToast(error.message || 'Registration failed', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
}

/**
 * Render Profile Page
 */
function renderProfilePage() {
  const user = ui.getCurrentUser();
  
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container" style="max-width: 800px;">
      <h1 class="mb-6" style="font-size: var(--text-3xl); font-weight: var(--font-bold);">
        My Profile
      </h1>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Profile Information</h2>
        </div>
        
        <form id="profileForm">
          <div class="form-group">
            <label class="label" for="profileName">Full Name</label>
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
            <label class="label" for="profileUsername">Username</label>
            <input 
              type="text" 
              id="profileUsername" 
              name="username" 
              class="input" 
              value="${escapeHtml(user?.username || '')}" 
              required 
              readonly
              style="background-color: var(--color-bg-tertiary); cursor: not-allowed;"
              title="Username cannot be changed"
            />
            <span class="text-small text-muted">Username cannot be changed</span>
          </div>
          
          <div class="form-group">
            <label class="label" for="profileEmail">Email</label>
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
            <label class="label" for="profilePassword">Password (leave empty to keep current)</label>
            <input 
              type="password" 
              id="profilePassword" 
              name="password" 
              class="input" 
              autocomplete="new-password"
              placeholder="Enter new password or leave empty"
            />
            <span class="text-small text-muted">Only fill this field if you want to change your password</span>
          </div>
          
          <div class="card-footer">
            <div class="flex gap-3">
              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
              <button type="button" class="btn btn-secondary" onclick="window.location.hash='#/lists'">
                Cancel
              </button>
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
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loading-inline"></span> Saving...';
  
  try {
    // Update profile (name, email)
    const userData = {
      name: formData.get('name').trim(),
      email: formData.get('email').trim(),
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
      
      ui.showToast('Profile and password updated successfully', 'success');
    } else {
      ui.showToast('Profile updated successfully', 'success');
    }
    
    // Update navbar
    document.getElementById('userName').textContent = userData.name;
    
    // Clear password field
    document.getElementById('profilePassword').value = '';
    
  } catch (error) {
    ui.showToast(error.message || 'Failed to update profile', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Changes';
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
