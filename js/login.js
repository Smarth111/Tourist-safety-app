// Initialize all functionality when DOM is fully loaded
function initializeApp() {
    console.log('Initializing app...');
    
    // Theme toggle functionality
    initThemeToggle();
    
    // Department selection functionality
    initDepartmentSelection();
    
    // Password visibility toggle
    initPasswordToggle();
    
    // Form submission
    initFormSubmission();
}

// Use both DOMContentLoaded and window.onload to ensure elements are available
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    // Try to initialize, but also set a backup with setTimeout
    initializeApp();
});

// Backup initialization
window.onload = function() {
    console.log('Window loaded');
    initializeApp();
};

/**
 * Show notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification styles exist, if not add them
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 350px;
                background-color: white;
                color: #333;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-radius: 4px;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 1000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
            }
            
            .notification-icon {
                margin-right: 12px;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 20px;
                color: #999;
                margin-left: 10px;
            }
            
            .notification.success {
                border-left: 4px solid #4CAF50;
            }
            
            .notification.success .notification-icon {
                color: #4CAF50;
            }
            
            .notification.error {
                border-left: 4px solid #F44336;
            }
            
            .notification.error .notification-icon {
                color: #F44336;
            }
            
            .notification.warning {
                border-left: 4px solid #FF9800;
            }
            
            .notification.warning .notification-icon {
                color: #FF9800;
            }
            
            .notification.info {
                border-left: 4px solid #2196F3;
            }
            
            .notification.info .notification-icon {
                color: #2196F3;
            }
            
            .dark-theme .notification {
                background-color: #2a3142;
                color: #e4e6eb;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .dark-theme .notification-close {
                color: #aaa;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'check_circle';
            break;
        case 'error':
            icon = 'error';
            break;
        case 'warning':
            icon = 'warning';
            break;
        default:
            icon = 'info';
    }
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon material-icons">${icon}</span>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification with a slight delay for the animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close button event listener
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

/**
 * Close notification
 * @param {HTMLElement} notification - The notification element to close
 */
function closeNotification(notification) {
    notification.classList.remove('show');
    
    // Remove from DOM after animation completes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 300);
}

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    console.log('Initializing theme toggle...');
    
    // Try different selectors to find the theme toggle elements
    const lightModeIcon = document.querySelector('.light-icon') || document.querySelector('[class*="light"]');
    const darkModeIcon = document.querySelector('.dark-icon') || document.querySelector('[class*="dark"]');
    const body = document.body;
    
    // Log what we found for debugging
    console.log('Light mode icon found:', !!lightModeIcon);
    console.log('Dark mode icon found:', !!darkModeIcon);
    
    if (!lightModeIcon || !darkModeIcon) {
        console.warn('Theme toggle icons not found, applying default theme');
        // Apply default theme even if icons aren't found
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-theme');
        }
        return;
    }
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-theme');
        try {
            darkModeIcon.classList.add('active');
            lightModeIcon.classList.remove('active');
        } catch (e) {
            console.warn('Error updating theme toggle icons:', e);
        }
    } else {
        body.classList.remove('dark-theme');
        try {
            lightModeIcon.classList.add('active');
            darkModeIcon.classList.remove('active');
        } catch (e) {
            console.warn('Error updating theme toggle icons:', e);
        }
    }
    
    // Light mode toggle
    lightModeIcon.addEventListener('click', function() {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        try {
            lightModeIcon.classList.add('active');
            darkModeIcon.classList.remove('active');
        } catch (e) {
            console.warn('Error updating theme toggle icons:', e);
        }
    });
    
    // Dark mode toggle
    darkModeIcon.addEventListener('click', function() {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        try {
            darkModeIcon.classList.add('active');
            lightModeIcon.classList.remove('active');
        } catch (e) {
            console.warn('Error updating theme toggle icons:', e);
        }
    });
}

/**
 * Initialize department selection functionality
 */
function initDepartmentSelection() {
    const departmentOptions = document.querySelectorAll('.department-option');
    const touristSection = document.querySelector('.tourist-section');
    
    // Create hidden input if it doesn't exist
    let departmentInput = document.getElementById('department-input');
    if (!departmentInput) {
        departmentInput = document.createElement('input');
        departmentInput.type = 'hidden';
        departmentInput.id = 'department-input';
        departmentInput.name = 'department';
        // Set default value based on the active department
        const activeOption = document.querySelector('.department-option.active');
        if (activeOption) {
            const defaultDept = activeOption.getAttribute('data-dept') || 
                               activeOption.querySelector('span:last-child').textContent.toLowerCase();
            departmentInput.value = defaultDept;
            
            // Check if we need to show tourist section initially
            if (touristSection && defaultDept === 'tourism') {
                touristSection.style.display = 'block';
            }
        } else {
            departmentInput.value = 'police'; // Default value
        }
        // Append to form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.appendChild(departmentInput);
        }
    }
    
    if (!departmentOptions.length) {
        console.warn('Department selection elements not found');
        return;
    }
    
    departmentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            departmentOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get department value from data attribute or text
            const deptValue = this.getAttribute('data-dept') || 
                             this.querySelector('span:last-child').textContent.toLowerCase();
            
            // Show/hide tourist section based on department
            if (touristSection) {
                if (deptValue === 'tourism') {
                    touristSection.style.display = 'block';
                } else {
                    touristSection.style.display = 'none';
                }
            }
            
            // Update hidden input value with the department value
            departmentInput.value = deptValue;
        });
    });
}

/**
 * Initialize password visibility toggle
 */
function initPasswordToggle() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            const icon = this.querySelector('.material-icons');
            if (type === 'password') {
                icon.textContent = 'visibility';
            } else {
                icon.textContent = 'visibility_off';
            }
        });
    }
}

/**
 * Initialize form submission
 */
function initFormSubmission() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember')?.checked || false;
            
            // Get department from active department option if input doesn't exist
            let department = '';
            const departmentInput = document.getElementById('department-input');
            if (departmentInput) {
                department = departmentInput.value;
            } else {
                const activeOption = document.querySelector('.department-option.active');
                if (activeOption) {
                    department = activeOption.querySelector('span:last-child').textContent.toLowerCase();
                }
            }
            
            // Validate form
            if (!username) {
                showNotification('Please enter your username', 'error');
                return;
            }
            
            if (!password) {
                showNotification('Please enter your password', 'error');
                return;
            }
            
            if (!department) {
                showNotification('Please select a department', 'error');
                return;
            }
            
            // Map department to specific role
            let userRole = 'Police Officer'; // Default role
            switch (department) {
                case 'police':
                    userRole = 'Police Officer';
                    break;
                case 'medical':
                    userRole = 'Hospital Staff';
                    break;
                case 'tourism':
                    userRole = 'Tourism Official';
                    break;
                default:
                    userRole = 'Police Officer';
            }
            
            // Log attempt
            console.log('Login attempt:', { username, department, userRole });
            
            // Store user info in localStorage
            const userData = {
                username: username,
                role: userRole,
                authenticated: true,
                permissions: getRolePermissions(userRole),
                themeColor: getRoleThemeColor(userRole),
                lastLogin: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Show success notification
            showNotification(`Login successful! Redirecting to dashboard as ${userRole}...`, 'success');
            
            // Simulate login
            simulateAuth(username, password, userRole);
        });
    }
}

/**
 * Get permissions based on user role
 * @param {string} role - The user's role
 * @returns {Object} - Object containing role-specific permissions
 */
function getRolePermissions(role) {
    // Define role-based permissions
    const permissions = {
        'Police Officer': {
            canCreateAlerts: true,
            canAssignTeams: true,
            canViewCases: true,
            canEditCases: true,
            canAccessReports: true,
            canManageUsers: false,
            canAccessSensitiveData: true
        },
        'Hospital Staff': {
            canCreateAlerts: true,
            canAssignTeams: false,
            canViewCases: true,
            canEditCases: false,
            canAccessReports: true,
            canManageUsers: false,
            canAccessSensitiveData: true,
            canManageMedicalResources: true
        },
        'Tourism Official': {
            canCreateAlerts: true,
            canAssignTeams: false,
            canViewCases: true,
            canEditCases: false,
            canAccessReports: true,
            canManageUsers: false,
            canAccessSensitiveData: false,
            canManageTouristInfo: true
        }
    };
    
    return permissions[role] || permissions['Police Officer'];
}

/**
 * Get theme color based on user role
 * @param {string} role - The user's role
 * @returns {string} - Hex color code for the role
 */
function getRoleThemeColor(role) {
    // Define role-based theme colors
    const themeColors = {
        'Police Officer': '#3B82F6', // Blue
        'Hospital Staff': '#10B981', // Green
        'Tourism Official': '#F59E0B'  // Amber
    };
    
    return themeColors[role] || themeColors['Police Officer'];
}

/**
 * Simulate authentication process
 */
function simulateAuth(username, password, role) {
    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    const originalBtnText = loginBtn.textContent;
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    }, 1500);
}