# Authentication System Guide 🔐

## Overview
Your website now has a complete authentication system with login, signup, password recovery, and admin approval workflow!

---

## 🔐 How It Works

### 1. **Signup Process**
- Users visit `auth.html` and click "Create Account"
- Fill in their details (name, email, phone, username, password)
- Details are sent to pending approvals (admin needs to approve)
- Users cannot access the main website until approved

### 2. **Admin Approval Process**
- Admin logs in at the Admin Portal on `auth.html`
- Default admin credentials:
  - **Username:** `admin`
  - **Password:** `admin123`
- Admin can:
  - ✅ **Approve** new signups (users can then login)
  - ❌ **Reject** signups (with reason)
  - 🔄 **Reconsider** rejected users
  - 🚫 **Revoke** approved user access

### 3. **Login**
- Approved users can login with username & password
- Unapproved users are shown "account pending approval" message
- After login, users are redirected to the main website

### 4. **Password Recovery**
- Users enter their username
- Password is displayed (in production, send via email)
- Users can return to login

### 5. **Access Protection**
- Main website (`index.html`) checks if user is logged in
- If not logged in → automatically redirects to `auth.html`
- User profile header shows welcome message
- Logout button available on main website

---

## 📁 File Structure

```
GF/
├── auth.html           ← Login, Signup, Password Recovery, Admin Portal
├── admin.html          ← Admin Dashboard for managing users
├── auth.js             ← Authentication logic
├── admin.js            ← Admin dashboard logic
├── auth-styles.css     ← Login page styling
├── admin-styles.css    ← Admin dashboard styling
├── index.html          ← Your main website (now protected)
├── script.js           ← Updated with logout function
├── styles.css          ← Updated with profile header styling
```

---

## 🚀 Getting Started

1. **Start at Auth Page**: Open `auth.html` in your browser
2. **Sign Up**: Create a new account (it will be pending)
3. **Admin Approval**: 
   - Click "Admin Portal" on login page
   - Login with `admin` / `admin123`
   - Approve your signup
4. **Login**: Now you can login to access `index.html`
5. **Main Website**: You'll see your name and a logout button

---

## 🔧 Changing Admin Credentials

To change admin password, edit `auth.js` and find this line:

```javascript
if (!localStorage.getItem('admin')) {
  localStorage.setItem('admin', JSON.stringify({
    username: 'admin',
    password: 'admin123'  ← Change this
  }));
}
```

Then clear your browser's localStorage to reset.

---

## 💾 Data Storage

All data is stored in browser's **localStorage**:
- ✅ `approvedUsers` - Users approved by admin
- ⏳ `pendingSignups` - Users waiting for approval
- ❌ `rejectedUsers` - Rejected signups
- 👤 `currentUser` - Currently logged-in user
- 🔐 `admin` - Admin credentials

### ⚠️ Important Notes:
- Data clears when browser cache is cleared
- For production, use a **real database** (Firebase, MongoDB, etc.)
- Passwords should be **hashed**, not stored in plain text
- This is a **demo/prototype** for learning

---

## 🎯 Production Checklist

For a real website, you need:

- [ ] Backend server (Node.js, Python, etc.)
- [ ] Real database (MongoDB, PostgreSQL, MySQL)
- [ ] Password hashing (bcrypt)
- [ ] Email verification
- [ ] JWT tokens for sessions
- [ ] HTTPS/SSL encryption
- [ ] Rate limiting for login attempts
- [ ] CAPTCHA for forms
- [ ] Forgot password email system
- [ ] Two-factor authentication (2FA)

---

## 📱 Browser Compatibility

Works on:
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile browsers
- ✅ All modern browsers with localStorage support

---

## 🆘 Troubleshooting

### "Redirected to login page after login"
→ Check browser's localStorage is not disabled

### "Admin login not working"
→ Default credentials are `admin` / `admin123`

### "Can't see approved users in dashboard"
→ Make sure you clicked "Approve" in the admin panel

### "Lost all user data"
→ Browser cache was cleared. This is normal for demo. Use database in production.

---

## 📞 Support

Need help? Check the code comments in:
- `auth.js` - Authentication functions
- `admin.js` - Admin functions
- `auth.html` - Login forms

---

**Happy coding! 💖✨**
