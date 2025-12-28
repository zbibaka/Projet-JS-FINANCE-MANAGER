// ===== USER MANAGEMENT =====

// Check if user is admin


// Storage key for localStorage
const STORAGE_KEY = 'fm_users_v1';

// Get HTML elements
const form = document.getElementById('userForm');
const tbody = document.getElementById('usersTbody');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelEdit');
const errorEl = document.getElementById('form-error');

// Variables
let users = [];
let editingId = null;

// Load users from localStorage
function loadUsers() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    users = JSON.parse(saved);
  }
  displayUsers();
}

// Save users to localStorage
function saveUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Display all users in table
function displayUsers() {
  tbody.innerHTML = '';
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No users found</td></tr>';
    return;
  }
  
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="action-btn edit-btn" data-id="${user.id}">Edit</button>
        <button class="action-btn delete-btn" data-id="${user.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Handle form submission (Add or Update user)
form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  
  // Validate inputs
  if (!name || !email || !password) {
    errorEl.textContent = 'Please fill all fields';
    return;
  }
  
  if (!email.includes('@')) {
    errorEl.textContent = 'Invalid email';
    return;
  }
  
  // If editing existing user
  if (editingId) {
    const user = users.find(u => u.id === editingId);
    if (user) {
      user.name = name;
      user.email = email;
      user.role = role;
    }
    editingId = null;
    submitBtn.textContent = 'Add User';
    cancelBtn.style.display = 'none';
  } else {
    // Add new user
    users.push({
      id: Date.now().toString(),
      name: name,
      email: email,
      role: role
    });
  }
  
  errorEl.textContent = '';
  form.reset();
  saveUsers();
  displayUsers();
});

// Handle Edit and Delete buttons
tbody.addEventListener('click', function(e) {
  const button = e.target;
  const userId = button.dataset.id;
  
  if (button.classList.contains('edit-btn')) {
    editUser(userId);
  } else if (button.classList.contains('delete-btn')) {
    deleteUser(userId);
  }
});

// Delete user
function deleteUser(id) {
  if (confirm('Delete this user?')) {
    users = users.filter(u => u.id !== id);
    saveUsers();
    displayUsers();
  }
}

// Load user data into form for editing
function editUser(id) {
  const user = users.find(u => u.id === id);
  if (!user) return;
  
  document.getElementById('name').value = user.name;
  document.getElementById('email').value = user.email;
  document.getElementById('role').value = user.role;
  
  editingId = id;
  submitBtn.textContent = 'Update User';
  cancelBtn.style.display = 'inline-block';
}

// Cancel editing
cancelBtn.addEventListener('click', function() {
  form.reset();
  editingId = null;
  submitBtn.textContent = 'Add User';
  cancelBtn.style.display = 'none';
  errorEl.textContent = '';
});

// Load users when page loads
loadUsers();