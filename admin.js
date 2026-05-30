// ========== ADMIN DASHBOARD LOGIC ==========

// Check admin session on page load
window.addEventListener('DOMContentLoaded', () => {
  const adminSession = JSON.parse(localStorage.getItem('adminSession'));
  if (!adminSession || !adminSession.isLoggedIn) {
    window.location.href = 'auth.html';
    return;
  }
  loadDashboard();
});

// Load dashboard data
function loadDashboard() {
  updateStats();
  loadPendingSignups();
  loadApprovedUsers();
  loadRejectedUsers();
}

// Update statistics
function updateStats() {
  const pendingSignups = JSON.parse(localStorage.getItem('pendingSignups')) || [];
  const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];
  const rejectedUsers = JSON.parse(localStorage.getItem('rejectedUsers')) || [];

  document.getElementById('pendingCount').textContent = pendingSignups.length;
  document.getElementById('approvedCount').textContent = approvedUsers.length;
  document.getElementById('rejectedCount').textContent = rejectedUsers.length;
}

// Load pending signups
function loadPendingSignups() {
  const pendingSignups = JSON.parse(localStorage.getItem('pendingSignups')) || [];
  const container = document.getElementById('pendingSignups');

  if (pendingSignups.length === 0) {
    container.innerHTML = '<p class="empty-message">No pending signups</p>';
    return;
  }

  container.innerHTML = pendingSignups.map(user => `
    <div class="signup-card">
      <div class="card-header">
        <h3>${user.name}</h3>
        <span class="status pending">Pending</span>
      </div>
      <div class="card-content">
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Signup Date:</strong> ${user.signupDate}</p>
      </div>
      <div class="card-actions">
        <button class="btn btn-approve" onclick="approveUser(${user.id})">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="btn btn-reject" onclick="rejectUser(${user.id})">
          <i class="fas fa-times"></i> Reject
        </button>
      </div>
    </div>
  `).join('');
}

// Load approved users
function loadApprovedUsers() {
  const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];
  const container = document.getElementById('approvedUsers');

  if (approvedUsers.length === 0) {
    container.innerHTML = '<p class="empty-message">No approved users</p>';
    return;
  }

  container.innerHTML = approvedUsers.map(user => `
    <div class="user-card">
      <div class="user-info">
        <h4>${user.name}</h4>
        <p>${user.email} | ${user.phone}</p>
        <p><span class="username-badge">${user.username}</span></p>
      </div>
      <div class="user-actions">
        <button class="btn btn-small btn-reject" onclick="revokeApproval(${user.id})">
          <i class="fas fa-user-slash"></i> Revoke
        </button>
      </div>
    </div>
  `).join('');
}

// Load rejected users
function loadRejectedUsers() {
  const rejectedUsers = JSON.parse(localStorage.getItem('rejectedUsers')) || [];
  const container = document.getElementById('rejectedUsers');

  if (rejectedUsers.length === 0) {
    container.innerHTML = '<p class="empty-message">No rejected users</p>';
    return;
  }

  container.innerHTML = rejectedUsers.map(user => `
    <div class="user-card rejected">
      <div class="user-info">
        <h4>${user.name}</h4>
        <p>${user.email} | ${user.phone}</p>
        <p><span class="username-badge">${user.username}</span></p>
        <p class="reject-reason"><strong>Reason:</strong> ${user.rejectReason || 'No reason provided'}</p>
      </div>
      <div class="user-actions">
        <button class="btn btn-small btn-approve" onclick="approveRejected(${user.id})">
          <i class="fas fa-redo"></i> Reconsider
        </button>
      </div>
    </div>
  `).join('');
}

// Approve user
function approveUser(userId) {
  const pendingSignups = JSON.parse(localStorage.getItem('pendingSignups')) || [];
  const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];

  const userIndex = pendingSignups.findIndex(u => u.id === userId);
  if (userIndex === -1) return;

  const user = pendingSignups[userIndex];
  user.status = 'approved';
  user.approvalDate = new Date().toLocaleString();

  approvedUsers.push(user);
  pendingSignups.splice(userIndex, 1);

  localStorage.setItem('pendingSignups', JSON.stringify(pendingSignups));
  localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));

  alert('✅ User approved successfully!');
  loadDashboard();
}

// Reject user
function rejectUser(userId) {
  const reason = prompt('Enter reason for rejection:');
  if (reason === null) return;

  const pendingSignups = JSON.parse(localStorage.getItem('pendingSignups')) || [];
  const rejectedUsers = JSON.parse(localStorage.getItem('rejectedUsers')) || [];

  const userIndex = pendingSignups.findIndex(u => u.id === userId);
  if (userIndex === -1) return;

  const user = pendingSignups[userIndex];
  user.status = 'rejected';
  user.rejectionDate = new Date().toLocaleString();
  user.rejectReason = reason;

  rejectedUsers.push(user);
  pendingSignups.splice(userIndex, 1);

  localStorage.setItem('pendingSignups', JSON.stringify(pendingSignups));
  localStorage.setItem('rejectedUsers', JSON.stringify(rejectedUsers));

  alert('❌ User rejected successfully!');
  loadDashboard();
}

// Revoke approval
function revokeApproval(userId) {
  if (!confirm('Are you sure you want to revoke this user\'s approval?')) return;

  const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];
  const rejectedUsers = JSON.parse(localStorage.getItem('rejectedUsers')) || [];

  const userIndex = approvedUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) return;

  const user = approvedUsers[userIndex];
  user.status = 'rejected';
  user.rejectionDate = new Date().toLocaleString();
  user.rejectReason = 'Approval revoked by admin';

  rejectedUsers.push(user);
  approvedUsers.splice(userIndex, 1);

  localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
  localStorage.setItem('rejectedUsers', JSON.stringify(rejectedUsers));

  alert('✅ Approval revoked!');
  loadDashboard();
}

// Reconsider rejected user
function approveRejected(userId) {
  const rejectedUsers = JSON.parse(localStorage.getItem('rejectedUsers')) || [];
  const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers')) || [];

  const userIndex = rejectedUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) return;

  const user = rejectedUsers[userIndex];
  user.status = 'approved';
  user.approvalDate = new Date().toLocaleString();

  approvedUsers.push(user);
  rejectedUsers.splice(userIndex, 1);

  localStorage.setItem('rejectedUsers', JSON.stringify(rejectedUsers));
  localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));

  alert('✅ User approved successfully!');
  loadDashboard();
}

// Admin logout
function handleAdminLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.setItem('adminSession', JSON.stringify(null));
    window.location.href = 'auth.html';
  }
}
