document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    initMap();
    
    // Apply role-based access and theming
    applyRoleBasedSettings();
    
/**
 * Apply role-based settings including theme colors and access controls
 */
function applyRoleBasedSettings() {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Default to emergency-responder if no role is found
    const userRole = userData.role || 'emergency-responder';
    
    // Define role-based colors
    const roleColors = {
        'emergency-responder': '#EF4444', // Red
        'dispatcher': '#3B82F6',          // Blue
        'supervisor': '#8B5CF6',          // Purple
        'admin': '#10B981'                // Green
    };
    
    const themeColor = roleColors[userRole] || '#3B82F6';
    const permissions = userData.permissions || {};
    
    console.log('Applying settings for role:', userRole);
    
    // Set the role color as a CSS variable
    document.documentElement.style.setProperty('--role-color', themeColor);
    
    // Add role-specific class to body
    document.body.classList.add(`role-${userRole}`);
    
    // Update UI elements with role information
    const roleIndicator = document.querySelector('.role-indicator');
    if (roleIndicator) {
        roleIndicator.textContent = userRole.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        roleIndicator.style.backgroundColor = themeColor;
    }
    
    // Apply CSS for role-based styling
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .sidebar-header, 
        .btn-primary,
        .alert-item.high-priority,
        .filter-badge.active {
            background-color: var(--role-color);
        }
        
        .sidebar-nav li.active a {
            color: var(--role-color);
            border-left-color: var(--role-color);
        }
        
        .btn-outline-primary {
            color: var(--role-color);
            border-color: var(--role-color);
        }
        
        .btn-outline-primary:hover {
            background-color: var(--role-color);
            color: white;
        }
    `;
    document.head.appendChild(styleElement);
    
    // Apply role-based access controls
    if (!permissions.canAssignTeams) {
        // Hide team assignment buttons if user doesn't have permission
        const assignButtons = document.querySelectorAll('.assign-team-btn');
        assignButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }
    
    if (!permissions.canAccessSensitiveData) {
        // Hide sensitive data elements
        const sensitiveElements = document.querySelectorAll('.sensitive-data');
        sensitiveElements.forEach(el => {
            el.style.display = 'none';
        });
    }
    
    // Show role-specific welcome message
    let welcomeMessage = '';
    switch (userRole) {
        case 'emergency-responder':
            welcomeMessage = 'Welcome to the Emergency Response Dashboard. You can manage incidents and dispatch resources.';
            break;
        case 'dispatcher':
            welcomeMessage = 'Welcome to the Dispatcher Dashboard. You can coordinate emergency responses and team assignments.';
            break;
        case 'supervisor':
            welcomeMessage = 'Welcome to the Supervisor Dashboard. You have access to all system features and reports.';
            break;
        case 'admin':
            welcomeMessage = 'Welcome to the Admin Dashboard. You have full system access and configuration controls.';
            break;
        default:
            welcomeMessage = 'Welcome to the Emergency Management System.';
    }
    
    showNotification(welcomeMessage);
}
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Initialize filter dropdown
    initFilterDropdown();
    
    // Initialize alerts filter
    initAlertsFilter();
    
// Function to initialize filter dropdown
function initFilterDropdown() {
    const filterDropdown = document.querySelector('.filter-dropdown');
    if (!filterDropdown) return;
    
    const filterToggle = filterDropdown.querySelector('.filter-toggle');
    const filterMenu = filterDropdown.querySelector('.filter-menu');
    
    filterToggle.addEventListener('click', function() {
        filterMenu.classList.toggle('show');
    });
    
    // Close the dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!filterDropdown.contains(e.target)) {
            filterMenu.classList.remove('show');
        }
    });
    
    // Handle filter selection
    const filterOptions = filterMenu.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            filterToggle.querySelector('span').textContent = this.textContent;
            filterMenu.classList.remove('show');
            
            // Apply the filter
            applyFilter(filterType);
        });
    });
}

// Function to initialize alerts filter
function initAlertsFilter() {
    const statusFilters = document.querySelectorAll('.status-filter button');
    if (!statusFilters.length) return;
    
    statusFilters.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            statusFilters.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the status to filter by
            const status = this.dataset.status;
            
            // Filter the alerts
            filterAlertsByStatus(status);
        });
    });
}

// Function to apply filter
function applyFilter(filterType) {
    console.log('Applying filter:', filterType);
    
    // Get all alert items
    const alertItems = document.querySelectorAll('.alert-item');
    
    // Apply different filters based on the selected type
    switch(filterType) {
        case 'newest':
            // Sort by newest (in a real app, you would have timestamps)
            // For demo, we'll just reverse the order
            const alertsList = document.querySelector('.alerts-list');
            Array.from(alertItems).reverse().forEach(item => alertsList.appendChild(item));
            break;
            
        case 'priority':
            // Show high priority alerts first
            alertItems.forEach(item => {
                if (item.classList.contains('priority-high')) {
                    item.style.order = '1';
                } else if (item.classList.contains('priority-medium')) {
                    item.style.order = '2';
                } else {
                    item.style.order = '3';
                }
            });
            break;
            
        case 'location':
            // Group by location (in a real app, you would have location data)
            // For demo, we'll just sort alphabetically by the location text
            const sortedByLocation = Array.from(alertItems).sort((a, b) => {
                const locationA = a.querySelector('.alert-location').textContent;
                const locationB = b.querySelector('.alert-location').textContent;
                return locationA.localeCompare(locationB);
            });
            
            const alertsListForLocation = document.querySelector('.alerts-list');
            sortedByLocation.forEach(item => alertsListForLocation.appendChild(item));
            break;
            
        default:
            // Reset order
            alertItems.forEach(item => {
                item.style.order = '';
            });
    }
    
    showNotification(`Alerts filtered by: ${filterType}`);
}

// Function to filter alerts by status
function filterAlertsByStatus(status) {
    const alertItems = document.querySelectorAll('.alert-item');
    
    alertItems.forEach(item => {
        if (status === 'all') {
            item.style.display = '';
        } else {
            const alertStatus = item.dataset.status;
            item.style.display = alertStatus === status ? '' : 'none';
        }
    });
    
    // Update the count
    updateAlertCount();
    
    showNotification(`Showing ${status} alerts`);
}

// Function to update alert count
function updateAlertCount() {
    const visibleAlerts = document.querySelectorAll('.alert-item[style="display: "], .alert-item:not([style])');
    const countElement = document.querySelector('.alerts-count');
    
    if (countElement) {
        countElement.textContent = visibleAlerts.length;
    }
}
    
    // Initialize team assignment modal
    initTeamAssignmentModal();
    
// Function to show team assignment modal
function showTeamAssignmentModal(alertId, alertName) {
    // Get the modal template
    const modal = document.getElementById('team-assignment-modal');
    
    // Set alert details
    document.getElementById('alert-name').textContent = alertName;
    document.getElementById('alert-id').textContent = alertId;
    
    // Show the modal
    modal.style.display = 'block';
    
    // Close button functionality
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    const closeModal = () => {
        modal.style.display = 'none';
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Form submission
    const form = modal.querySelector('#team-assignment-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const teamSelect = document.getElementById('team-select');
        const priority = document.getElementById('priority');
        const notes = document.getElementById('notes');
        
        // In a real app, you would send this data to the server
        console.log('Team assigned:', {
            alertId,
            alertName,
            team: teamSelect.value,
            teamName: teamSelect.options[teamSelect.selectedIndex].text,
            priority: priority.value,
            notes: notes.value
        });
        
        // Show notification
        showNotification(`Team ${teamSelect.options[teamSelect.selectedIndex].text.split(' ')[1]} has been assigned to ${alertName}`);
        
        // Close the modal
        closeModal();
        
        // Reset form
        form.reset();
    });
}

// Function to initialize team assignment modal
function initTeamAssignmentModal() {
    const assignButtons = document.querySelectorAll('.assign-team-btn');
    
    assignButtons.forEach(button => {
        button.addEventListener('click', () => {
            const alertItem = button.closest('.alert-item');
            const alertId = alertItem.dataset.alertId;
            const alertName = alertItem.querySelector('.alert-location').textContent;
            
            showTeamAssignmentModal(alertId, alertName);
        });
    });
}
    
    // Alert action buttons
    const alertButtons = document.querySelectorAll('.alert-actions .btn');
    alertButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const alertItem = this.closest('.alert-item');
            const alertName = alertItem.querySelector('h3').textContent;
            const alertId = alertItem.querySelector('.alert-id').textContent;
            
            if (this.classList.contains('btn-primary')) {
                // Acknowledge button clicked
                console.log('Alert acknowledged:', alertName, alertId);
                // In a real app, you would send this to the server
                // For demo, just change the button
                this.textContent = 'Acknowledged';
                this.disabled = true;
                this.classList.add('accepted');
                
                // Show a notification
                showNotification(`You've acknowledged the alert for ${alertName}`);
            } else if (this.classList.contains('btn-assign')) {
                // Assign team button clicked
                console.log('Assigning team for:', alertName, alertId);
                // In a real app, you would open a team assignment modal
                showTeamAssignmentModal(alertId, alertName);
            } else {
                // Details button clicked
                console.log('View details for:', alertName, alertId);
                // In a real app, you would navigate to the alert details page
                window.location.href = `alert-details.html?id=${alertId}`;
            }
        });
    });
    
    // Initialize quick actions floating button
    initQuickActions();

// Function to initialize quick actions floating button
function initQuickActions() {
    // Get the floating action button from the HTML template
    const fab = document.querySelector('.quick-actions-fab');
    if (!fab) {
        console.error('Quick actions button not found in the HTML template');
        return;
    }
    
    // Get the quick actions menu from the HTML template
    const menu = document.querySelector('.quick-actions-menu');
    if (!menu) {
        console.error('Quick actions menu not found in the HTML template');
        return;
    }
    
    // Add SOS emergency handling
    function handleEmergencyResponse() {
        // Create emergency response modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Emergency Response Protocol</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="emergency-steps">
                        <div class="step active">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h3>Assess Situation</h3>
                                <p>Determine severity and type of emergency</p>
                                <div class="form-group">
                                    <label for="emergency-type">Emergency Type:</label>
                                    <select id="emergency-type">
                                        <option value="medical">Medical Emergency</option>
                                        <option value="security">Security Threat</option>
                                        <option value="natural">Natural Disaster</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="emergency-severity">Severity Level:</label>
                                    <select id="emergency-severity">
                                        <option value="critical">Critical - Immediate Response</option>
                                        <option value="high">High - Urgent Response</option>
                                        <option value="medium">Medium - Prompt Response</option>
                                        <option value="low">Low - Standard Response</option>
                                    </select>
                                </div>
                                <button class="btn btn-primary next-step">Next Step</button>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h3>Dispatch Resources</h3>
                                <p>Select appropriate response teams and resources</p>
                                <div class="form-group">
                                    <label>Select Response Teams:</label>
                                    <div class="checkbox-group">
                                        <label><input type="checkbox" value="medical"> Medical Team</label>
                                        <label><input type="checkbox" value="police"> Police Unit</label>
                                        <label><input type="checkbox" value="fire"> Fire Department</label>
                                        <label><input type="checkbox" value="rescue"> Rescue Team</label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="response-location">Response Location:</label>
                                    <input type="text" id="response-location" value="Current Map Center" readonly>
                                </div>
                                <div class="form-actions">
                                    <button class="btn btn-secondary prev-step">Previous</button>
                                    <button class="btn btn-primary next-step">Next Step</button>
                                </div>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h3>Activate Protocol</h3>
                                <p>Initiate emergency response protocol</p>
                                <div class="protocol-summary">
                                    <h4>Emergency Response Summary</h4>
                                    <div id="protocol-details">
                                        <p><strong>Type:</strong> <span id="summary-type">Medical Emergency</span></p>
                                        <p><strong>Severity:</strong> <span id="summary-severity">Critical</span></p>
                                        <p><strong>Teams:</strong> <span id="summary-teams">Medical Team</span></p>
                                        <p><strong>Location:</strong> <span id="summary-location">Current Map Center</span></p>
                                        <p><strong>ETA:</strong> <span id="summary-eta">5-10 minutes</span></p>
                                    </div>
                                </div>
                                <div class="form-actions">
                                    <button class="btn btn-secondary prev-step">Previous</button>
                                    <button class="btn btn-danger activate-btn">Activate Emergency Protocol</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        document.body.appendChild(modal);
        
        // Add CSS for emergency steps
        const style = document.createElement('style');
        style.textContent = `
            .emergency-steps {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .step {
                display: flex;
                gap: 15px;
                opacity: 0.5;
                pointer-events: none;
            }
            
            .step.active {
                opacity: 1;
                pointer-events: all;
            }
            
            .step-number {
                width: 30px;
                height: 30px;
                background-color: var(--role-color, #3B82F6);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            
            .step-content {
                flex: 1;
            }
            
            .checkbox-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-top: 5px;
            }
            
            .protocol-summary {
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
            }
            
            .protocol-summary h4 {
                margin-top: 0;
                margin-bottom: 10px;
                color: var(--role-color, #3B82F6);
            }
            
            .activate-btn {
                background-color: #f44336;
            }
        `;
        document.head.appendChild(style);
        
        // Handle step navigation
        const steps = modal.querySelectorAll('.step');
        const nextButtons = modal.querySelectorAll('.next-step');
        const prevButtons = modal.querySelectorAll('.prev-step');
        
        nextButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                steps[index].classList.remove('active');
                steps[index + 1].classList.add('active');
                
                // Update summary on last step
                if (index === 0) {
                    const type = document.getElementById('emergency-type');
                    const severity = document.getElementById('emergency-severity');
                    
                    document.getElementById('summary-type').textContent = 
                        type.options[type.selectedIndex].text;
                    document.getElementById('summary-severity').textContent = 
                        severity.options[severity.selectedIndex].text;
                } else if (index === 1) {
                    const teams = [];
                    modal.querySelectorAll('.checkbox-group input:checked').forEach(checkbox => {
                        teams.push(checkbox.parentElement.textContent.trim());
                    });
                    
                    document.getElementById('summary-teams').textContent = 
                        teams.length > 0 ? teams.join(', ') : 'None selected';
                    document.getElementById('summary-location').textContent = 
                        document.getElementById('response-location').value;
                }
            });
        });
        
        prevButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const stepIndex = index + 1; // Prev buttons start from step 2
                steps[stepIndex].classList.remove('active');
                steps[stepIndex - 1].classList.add('active');
            });
        });
        
        // Handle protocol activation
        const activateBtn = modal.querySelector('.activate-btn');
        activateBtn.addEventListener('click', () => {
            // In a real app, this would trigger actual emergency protocols
            showNotification('Emergency protocol activated! Response teams dispatched.');
            
            // Close modal
            modal.remove();
        });
        
        // Close button functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
    }
    
    // Toggle menu on FAB click
fab.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Add SOS button to quick actions menu
const sosButton = document.createElement('button');
sosButton.className = 'quick-action-btn sos-btn';
sosButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> SOS';
sosButton.addEventListener('click', () => {
    menu.classList.remove('active'); // Close menu
    handleEmergencyResponse(); // Open emergency response modal
});
menu.appendChild(sosButton);

// Add SOS button styling
const sosStyle = document.createElement('style');
sosStyle.textContent = `
    .sos-btn {
        background-color: #f44336;
        color: white;
        font-weight: bold;
    }
    
    .sos-btn:hover {
        background-color: #d32f2f;
    }
`;
document.head.appendChild(sosStyle);
    
    // Handle quick action clicks
    const quickActions = document.querySelectorAll('.quick-action');
    quickActions.forEach(action => {
        action.addEventListener('click', () => {
            const actionType = action.dataset.action;
            
            switch(actionType) {
                case 'emergency':
                    showNotification('Emergency response protocol activated');
                    // In a real app, you would trigger emergency protocols
                    break;
                case 'broadcast':
                    // Show broadcast dialog
                    showBroadcastDialog();
                    break;
                case 'dispatch':
                    // Show team dispatch dialog
                    showTeamAssignmentModal('emergency-dispatch', 'Emergency Dispatch');
                    break;
            }
            
            // Close the menu
            menu.classList.remove('open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!fab.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('open');
        }
    });
}

// Function to show broadcast dialog
function showBroadcastDialog() {
    // Get the modal template
    const modal = document.getElementById('broadcast-modal');
    
    // Show the modal
    modal.style.display = 'block';
    
    // Close button functionality
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    const closeModal = () => {
        modal.style.display = 'none';
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Form submission
    const form = modal.querySelector('#broadcast-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const type = document.getElementById('broadcast-type').value;
        const message = document.getElementById('broadcast-message').value;
        const area = document.getElementById('broadcast-area').value;
        
        // In a real app, you would send this data to the server
        console.log('Broadcasting alert:', {
            type,
            message,
            area
        });
        
        // Show notification
        showNotification(`Alert broadcast sent to ${area === 'all' ? 'all areas' : area.replace('-', ' ')}`);
        
        // Close the modal
        closeModal();
        
        // Reset form
        form.reset();
    });
}
});

// Initialize Leaflet map
function initMap() {
    const mapElement = document.getElementById('map');
    
    if (!mapElement) return;
    
    // Check if map is already initialized
    if (window.mapInitialized) {
        console.log('Map already initialized');
        return;
    }
    
    // Create a dark-themed map centered on Delhi, India
    const map = L.map('map').setView([28.6139, 77.2090], 13);
    window.mapInitialized = true;
    
    // Add a dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Custom icon for SOS alerts
    const sosIcon = L.divIcon({
        className: 'sos-marker',
        html: '<div class="pulse"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    
    // Add markers for the tourist alerts
    const alerts = [
        {
            name: 'Emma Johnson',
            status: 'active',
            location: [28.6562, 77.2410], // Red Fort
            time: '2 minutes ago',
            type: 'monument'
        },
        {
            name: 'Michael Chen',
            status: 'active',
            location: [28.6129, 77.2295], // India Gate
            time: '5 minutes ago',
            type: 'monument'
        },
        {
            name: 'Sophia Rodriguez',
            status: 'pending',
            location: [28.5244, 77.1855], // Qutub Minar
            time: '10 minutes ago',
            type: 'monument'
        },
        {
            name: 'James Wilson',
            status: 'resolved',
            location: [28.5535, 77.2588], // Lotus Temple
            time: '25 minutes ago',
            type: 'religious'
        }
    ];
    
    // Add markers to the map
    alerts.forEach(alert => {
        const markerColor = alert.status === 'active' ? '#EF4444' : 
                          alert.status === 'pending' ? '#F59E0B' : '#10B981';
        
        // Add tourist ID to each alert
        alert.touristId = 'T-' + Math.floor(1000 + Math.random() * 9000);
        
        const customIcon = L.divIcon({
            className: `marker-${alert.status}`,
            html: `<div style="background-color: ${markerColor}; width: 15px; height: 15px; border-radius: 50%; box-shadow: 0 0 0 rgba(${alert.status === 'active' ? '239, 68, 68' : alert.status === 'pending' ? '245, 158, 11' : '16, 163, 74'}, 0.4); animation: ${alert.status === 'active' ? 'pulse 1.5s infinite' : 'none'};"></div>`,
            iconSize: [15, 15],
            iconAnchor: [7.5, 7.5]
        });
        
        const marker = L.marker(alert.location, { icon: customIcon }).addTo(map);
        
        marker.bindPopup(`
            <div class="popup-content">
                <h3>${alert.name}</h3>
                <p><strong>Status:</strong> ${alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}</p>
                <p><strong>Type:</strong> ${alert.type}</p>
                <p><strong>Time:</strong> ${alert.time}</p>
                <div class="popup-actions">
                    <button class="popup-btn view-details-btn">View Details</button>
                    <button class="popup-btn assign-team-btn">Assign Team</button>
                </div>
            </div>
        `);
        
        marker.on('click', function() {
            // Highlight the corresponding alert in the list
            const alertItems = document.querySelectorAll('.alert-item');
            alertItems.forEach((item, index) => {
                if (index === alerts.indexOf(alert)) {
                    item.classList.add('highlighted');
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    item.classList.remove('highlighted');
                }
            });
            
            // Update selected location in sidebar
            updateSelectedLocation(alert);
        });
    });
    
    // Add real-time alert simulation
    initMapRealTimeUpdates(map);
    
    // Add map controls for filtering and visualization options
    addMapControls(map);
    
    // Store map reference globally for access in other functions
    window.mapInstance = map;
}
    
    // Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Add CSS for notifications if not already added
    if (!document.querySelector('style#notification-style')) {
        const notificationStyle = document.createElement('style');
        notificationStyle.id = 'notification-style';
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--role-color, #3B82F6);
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: slideIn 0.3s ease-out forwards, fadeOut 0.5s ease-out 3s forwards;
                max-width: 300px;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(notificationStyle);
    }
    
    // Remove after animation completes
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// Add CSS for the pulsing effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
        }
        
        .marker-active div {
            animation: pulse 1.5s infinite;
        }
        
        .popup-content {
            padding: 5px;
            text-align: center;
        }
        
        .popup-content h3 {
            margin: 0 0 5px;
            font-size: 16px;
        }
        
        .popup-btn {
            background-color: #3B82F6;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            margin-top: 5px;
            cursor: pointer;
        }
        
        .alert-item.highlighted {
            border: 2px solid #3B82F6;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);


// Function to show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on notification type
    let icon = 'info';
    switch (type) {
        case 'success': icon = 'check_circle'; break;
        case 'error': icon = 'error'; break;
        case 'warning': icon = 'warning'; break;
        default: icon = 'info';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon material-icons">${icon}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

/**
 * Initialize real-time updates for the map
 * @param {L.Map} map - The Leaflet map instance
 */
function initMapRealTimeUpdates(map) {
    // In a real application, this would connect to a WebSocket or use polling
    // For demo purposes, we'll simulate updates with setInterval
    
    // Store markers in a global object for easy access
    window.alertMarkers = {};
    
    // Simulate incoming alerts
    const simulateAlerts = () => {
        // Random coordinates near Delhi
        const lat = 28.6139 + (Math.random() - 0.5) * 0.1;
        const lng = 77.2090 + (Math.random() - 0.5) * 0.1;
        
        // Random alert types
        const alertTypes = ['theft', 'harassment', 'medical', 'natural', 'other'];
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        // Random severity
        const severities = ['low', 'medium', 'high'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        // Create alert object
        const alertId = 'alert-' + Date.now();
        const alert = {
            id: alertId,
            type: alertType,
            severity: severity,
            lat: lat,
            lng: lng,
            timestamp: new Date().toISOString(),
            description: `${alertType.charAt(0).toUpperCase() + alertType.slice(1)} incident reported`,
            location: 'Near ' + getRandomLocationName()
        };
        
        // Add alert to map
        addAlertToMap(map, alert);
        
        // Add alert to feed
        addAlertToFeed(alert);
    };
    
    // Simulate alert every 30 seconds
    window.alertSimulator = setInterval(simulateAlerts, 30000);
    
    // Trigger one alert immediately
    setTimeout(simulateAlerts, 2000);
}

/**
 * Add an alert marker to the map
 * @param {L.Map} map - The Leaflet map instance
 * @param {Object} alert - The alert object
 */
function addAlertToMap(map, alert) {
    // Create icon based on severity
    const iconUrl = `images/markers/${alert.severity}-alert.svg`;
    const icon = L.icon({
        iconUrl: iconUrl,
        iconSize: [35, 35],
        iconAnchor: [17, 35],
        popupAnchor: [0, -35]
    });
    
    // Create marker
    const marker = L.marker([alert.lat, alert.lng], { 
        icon: icon,
        zIndexOffset: getSeverityZIndex(alert.severity) // Higher severity = higher z-index
    }).addTo(map);
    
    // Add popup
    marker.bindPopup(`
        <div class="map-popup alert-popup ${alert.severity}">
            <h3>${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert</h3>
            <p class="popup-severity ${alert.severity}">Severity: ${alert.severity}</p>
            <p>${alert.description}</p>
            <p>Location: ${alert.location}</p>
            <p>Time: ${formatTimestamp(alert.timestamp)}</p>
            <div class="popup-actions">
                <button class="btn btn-sm btn-primary respond-btn">Respond</button>
                <button class="btn btn-sm btn-outline-primary assign-team-btn">Assign Team</button>
            </div>
        </div>
    `);
    
    // Store marker reference
    window.alertMarkers[alert.id] = marker;
    
    // Add pulse animation for high severity alerts
    if (alert.severity === 'high') {
        // Create pulse circle
        const pulseCircle = L.circleMarker([alert.lat, alert.lng], {
            radius: 30,
            color: '#f44336',
            fillColor: '#f44336',
            fillOpacity: 0.3,
            weight: 2
        }).addTo(map);
        
        // Animate pulse
        let size = 30;
        let growing = false;
        const pulseAnimation = setInterval(() => {
            if (size > 50) growing = false;
            if (size < 30) growing = true;
            
            size = growing ? size + 1 : size - 1;
            pulseCircle.setRadius(size);
        }, 50);
        
        // Store animation reference for cleanup
        window.alertMarkers[alert.id + '-pulse'] = {
            circle: pulseCircle,
            animation: pulseAnimation
        };
    }
    
    // If high severity, pan to the alert
    if (alert.severity === 'high') {
        map.panTo([alert.lat, alert.lng]);
        showNotification(`High severity ${alert.type} alert at ${alert.location}`, 'error');
    }
}

/**
 * Add alert to the alert feed in the sidebar
 * @param {Object} alert - The alert object
 */
function addAlertToFeed(alert) {
    const alertFeed = document.querySelector('.alert-feed');
    if (!alertFeed) return;
    
    // Create alert item
    const alertItem = document.createElement('div');
    alertItem.className = `alert-item ${alert.severity}-priority`;
    alertItem.dataset.alertId = alert.id;
    
    // Set alert content
    alertItem.innerHTML = `
        <div class="alert-icon">
            <span class="material-icons">${getAlertIcon(alert.type)}</span>
        </div>
        <div class="alert-content">
            <div class="alert-header">
                <h4>${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</h4>
                <span class="alert-time">${formatTimestamp(alert.timestamp)}</span>
            </div>
            <p>${alert.description}</p>
            <p class="alert-location">${alert.location}</p>
            <div class="alert-actions">
                <button class="btn btn-sm btn-primary respond-btn">Respond</button>
                <button class="btn btn-sm btn-outline-primary assign-team-btn">Assign Team</button>
            </div>
        </div>
    `;
    
    // Add click event to highlight on map
    alertItem.addEventListener('click', () => {
        // Find marker and open popup
        const marker = window.alertMarkers[alert.id];
        if (marker) {
            marker.openPopup();
        }
        
        // Highlight in feed
        document.querySelectorAll('.alert-item').forEach(item => {
            item.classList.remove('active');
        });
        alertItem.classList.add('active');
    });
    
    // Add to feed (at the top)
    alertFeed.insertBefore(alertItem, alertFeed.firstChild);
    
    // Limit feed items to 10
    const alertItems = alertFeed.querySelectorAll('.alert-item');
    if (alertItems.length > 10) {
        alertItems[alertItems.length - 1].remove();
    }
}

/**
 * Get icon name based on alert type
 * @param {string} type - The alert type
 * @returns {string} - Material icon name
 */
function getAlertIcon(type) {
    switch (type) {
        case 'theft': return 'money_off';
        case 'harassment': return 'person_off';
        case 'medical': return 'medical_services';
        case 'natural': return 'storm';
        default: return 'warning';
    }
}

/**
 * Get z-index offset based on severity for proper marker layering
 * @param {string} severity - The alert severity
 * @returns {number} - z-index offset value
 */
function getSeverityZIndex(severity) {
    switch (severity) {
        case 'high': return 1000;
        case 'medium': return 500;
        case 'low': return 100;
        default: return 0;
    }
}

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted time string
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get random location name for demo purposes
 * @returns {string} - Random location name
 */
function getRandomLocationName() {
    const locations = [
        'Red Fort', 'India Gate', 'Connaught Place', 'Karol Bagh', 
        'Chandni Chowk', 'Hauz Khas', 'Lajpat Nagar', 'Saket', 
        'Dwarka', 'Paharganj', 'Rajouri Garden', 'Vasant Kunj'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
}

/**
 * Add custom controls to the map
 * @param {L.Map} map - The Leaflet map instance
 */
function addMapControls(map) {
    // Create custom control container
    const customControlsContainer = L.control({ position: 'topright' });
    
    customControlsContainer.onAdd = function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control map-custom-controls');
        
        // Add custom controls HTML
        container.innerHTML = `
            <button class="map-control-btn" title="Show all alerts">
                <i class="material-icons">warning</i>
            </button>
            <button class="map-control-btn" title="Show safe zones">
                <i class="material-icons">shield</i>
            </button>
            <button class="map-control-btn" title="Show tourist density">
                <i class="material-icons">groups</i>
            </button>
            <button class="map-control-btn" title="Show emergency services">
                <i class="material-icons">local_hospital</i>
            </button>
        `;
        
        // Prevent map click events from propagating through the control
        L.DomEvent.disableClickPropagation(container);
        
        return container;
    };
    
    customControlsContainer.addTo(map);
    
    // Add CSS for custom controls
    const style = document.createElement('style');
    style.textContent = `
        .map-custom-controls {
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 5px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.2);
        }
        
        .map-control-btn {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .map-control-btn:hover {
            background-color: #f0f0f0;
        }
        
        .map-control-btn i {
            font-size: 20px;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Update selected location info in the sidebar
 * @param {Object} location - The selected location object
 */
function updateSelectedLocation(location) {
    const selectedLocationContainer = document.querySelector('.selected-location');
    if (!selectedLocationContainer) return;
    
    selectedLocationContainer.innerHTML = `
        <h3>Selected Location</h3>
        <div class="location-details">
            <h4>${location.name}</h4>
            <p class="location-type">${location.type || 'Unknown'}</p>
            <p class="location-status ${location.status || 'unknown'}">Status: ${location.status || 'Unknown'}</p>
            <div class="location-actions">
                <button class="btn btn-sm btn-primary">View Details</button>
                <button class="btn btn-sm btn-outline-primary">Directions</button>
            </div>
        </div>
    `;
    
    // Show the container if it was hidden
    selectedLocationContainer.style.display = 'block';
}