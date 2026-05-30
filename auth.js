// ========== AUTHENTICATION SYSTEM ==========

// Initialize localStorage if empty
function initializeAuth() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify({}));
  }
  if (!localStorage.getItem('pendingSignups')) {
    localStorage.setItem('pendingSignups', JSON.stringify([]));
  }
  if (!localStorage.getItem('approvedUsers')) {
    localStorage.setItem('approvedUsers', JSON.stringify([]));
  }
  if (!localStorage.getItem('rejectedUsers')) {
    localStorage.setItem('rejectedUsers', JSON.stringify([]));
  }
  if (!localStorage.getItem('admin')) {
    // Default admin credentials
    localStorage.setItem('admin', JSON.stringify({
      username: 'admin',
      password: 'admin123'
    }));
  }
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(null));
  }
}

// ===== FORM SWITCHING =====
function showForm(formType) {
  clearAllMessages();
  
  // Hide all forms
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('recoveryForm').classList.add('hidden');
  document.getElementById('adminForm').classList.add('hidden');

  // Hide all tab buttons active state
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  // Show selected form and its tab button
  switch(formType) {
    case 'login':
      document.getElementById('loginForm').classList.remove('hidden');
      document.querySelectorAll('.tab-btn')[0].classList.add('active');
      break;
    case 'signup':
      document.getElementById('signupForm').classList.remove('hidden');
      document.querySelectorAll('.tab-btn')[1].classList.add('active');
      break;
    case 'recover':
      document.getElementById('recoveryForm').classList.remove('hidden');
      document.querySelectorAll('.tab-btn')[2].classList.add('active');
      break;
    case 'admin':
      document.getElementById('adminForm').classList.remove('hidden');
      document.querySelectorAll('.tab-btn')[3].classList.add('active');
      break;
  }
}

function clearAllMessages() {
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginSuccess').textContent = '';
  document.getElementById('signupError').textContent = '';
  document.getElementById('signupSuccess').textContent = '';
  document.getElementById('recoveryError').textContent = '';
  document.getElementById('recoverySuccess').textContent = '';
  document.getElementById('adminError').textContent = '';
  document.getElementById('adminSuccess').textContent = '';
}

// ===== LOGIN HANDLER =====
function handleLogin(event) {
  event.preventDefault();
  clearAllMessages();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  const errorEl = document.getElementById('loginError');
  const successEl = document.getElementById('loginSuccess');

  // Validate inputs
  if (!username || !password) {
    errorEl.textContent = '⚠️ Please enter username and password';
    return;
  }

  // Check if user exists in approved users
  const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];
  const user = approvedUsers.find(u => u.username === username && u.password === password);

  if (!user) {
    errorEl.textContent = '❌ Invalid username or password, or account not approved yet';
    return;
  }

  // Check if already logged in
  const pendingSignups = JSON.parse(localStorage.getItem('pendingSignups')) || [];
  const isPending = pendingSignups.find(u => u.username === username);
  if (isPending) {
    errorEl.textContent = '⏳ Your account is still pending approval. Please wait for admin confirmation.';
    return;
  }

  // Set current user and redirect
  localStorage.setItem('currentUser', JSON.stringify({
    username: user.username,
    email: user.email,
    name: user.name
  }));

  successEl.textContent = '✅ Login successful! Redirecting...';
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

// ===== SIGNUP HANDLER =====
function handleSignup(event) {
  event.preventDefault();
  clearAllMessages();

  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  const errorEl = document.getElementById('signupError');
  const successEl = document.getElementById('signupSuccess');

  // Validations
  if (!name || !email || !phone || !username || !password || !confirmPassword) {
    errorEl.textContent = '⚠️ Please fill all fields';
    return;
  }

  if (password !== confirmPassword) {
    errorEl.textContent = '❌ Passwords do not match';
    return;
  }

  if (password.length < 6) {
    errorEl.textContent = '❌ Password must be at least 6 characters';
    return;
  }

  // Check if username already exists
  const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];
  const pendingSignups = JSON.parse(localStorage.getItem('pendingSignups')) || [];

  if (approvedUsers.find(u => u.username === username) || pendingSignups.find(u => u.username === username)) {
    errorEl.textContent = '❌ Username already exists';
    return;
  }

  // Add to pending signups
  const newSignup = {
    id: Date.now(),
    name,
    email,
    phone,
    username,
    password,
    signupDate: new Date().toLocaleString(),
    status: 'pending'
  };

  pendingSignups.push(newSignup);
  localStorage.setItem('pendingSignups', JSON.stringify(pendingSignups));

  // Clear form
  document.getElementById('signupName').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPhone').value = '';
  document.getElementById('signupUsername').value = '';
  document.getElementById('signupPassword').value = '';
  document.getElementById('signupConfirmPassword').value = '';

  successEl.textContent = '✅ Signup successful! Waiting for admin approval... Switching to Login';

  setTimeout(() => {
    showForm('login');
  }, 2000);
}

// ===== PASSWORD RECOVERY HANDLER =====
function handlePasswordRecovery(event) {
  event.preventDefault();
  clearAllMessages();

  const username = document.getElementById('recoveryUsername').value.trim();
  const errorEl = document.getElementById('recoveryError');
  const successEl = document.getElementById('recoverySuccess');

  if (!username) {
    errorEl.textContent = '⚠️ Please enter your username';
    return;
  }

  // Find user in approved users
  const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];
  const user = approvedUsers.find(u => u.username === username);

  if (!user) {
    errorEl.textContent = '❌ Username not found or account not approved';
    return;
  }

  // Show password hint (in production, send email)
  successEl.textContent = `✅ Password sent to ${user.email}. Demo: "${user.password}"`;

  document.getElementById('recoveryUsername').value = '';

  setTimeout(() => {
    showForm('login');
  }, 3000);
}

// ===== ADMIN LOGIN HANDLER =====
function handleAdminLogin(event) {
  event.preventDefault();
  clearAllMessages();

  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('adminError');
  const successEl = document.getElementById('adminSuccess');

  if (!username || !password) {
    errorEl.textContent = '⚠️ Please enter admin credentials';
    return;
  }

  const admin = JSON.parse(localStorage.getItem('admin'));

  if (admin.username !== username || admin.password !== password) {
    errorEl.textContent = '❌ Invalid admin credentials';
    return;
  }

  // Set admin session and redirect
  localStorage.setItem('adminSession', JSON.stringify({
    isLoggedIn: true,
    loginTime: new Date().toLocaleString()
  }));

  successEl.textContent = '✅ Admin login successful! Redirecting...';
  document.getElementById('adminUsername').value = '';
  document.getElementById('adminPassword').value = '';
  
  setTimeout(() => {
    window.location.href = 'admin.html';
  }, 1500);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeAuth);
