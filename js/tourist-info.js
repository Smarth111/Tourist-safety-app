document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Initialize the history map in the modal
    initHistoryMap();
    
    // Setup tourist table interactions
    setupTableInteractions();
    
    // Setup modal functionality
    setupModalFunctionality();
    
    // Setup search functionality
    setupSearchFunctionality();
});

// Initialize Leaflet map for location history
function initHistoryMap() {
    const mapElement = document.getElementById('history-map');
    
    if (!mapElement) return;
    
    // Create a dark-themed map centered on Central Park
    const map = L.map('history-map').setView([40.7812, -73.9665], 13);
    
    // Add a dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Add location markers with timestamps
    const locations = [
        { lat: 40.7812, lng: -73.9665, time: 'Today, 2:45 PM', status: 'SOS Alert Triggered', isAlert: true },
        { lat: 40.7794, lng: -73.9632, time: 'Today, 1:30 PM', status: 'Checked in at Metropolitan Museum of Art' },
        { lat: 40.7580, lng: -73.9855, time: 'Today, 11:15 AM', status: 'Checked in at Times Square' },
        { lat: 40.7615, lng: -73.9777, time: 'Today, 9:00 AM', status: 'Left hotel' }
    ];
    
    // Create a polyline connecting all points
    const polylinePoints = locations.map(loc => [loc.lat, loc.lng]);
    const polyline = L.polyline(polylinePoints, {
        color: 'rgba(59, 130, 246, 0.7)',
        weight: 3,
        dashArray: '5, 5',
        opacity: 0.7
    }).addTo(map);
    
    // Add markers for each location
    locations.forEach(location => {
        const markerColor = location.isAlert ? '#EF4444' : '#3B82F6';
        
        // Create custom icon
        const icon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        
        // Create marker with popup
        const marker = L.marker([location.lat, location.lng], { icon: icon }).addTo(map);
        
        // Add popup with information
        marker.bindPopup(`
            <div style="color: #333; padding: 5px;">
                <div style="font-weight: bold;">${location.time}</div>
                <div>${location.status || ''}</div>
            </div>
        `);
    });
    
    // Fit map to show all markers
    map.fitBounds(polylinePoints);
}

// Setup tourist table interactions
function setupTableInteractions() {
    // View buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const touristId = this.getAttribute('data-id');
            openTouristModal(touristId);
        });
    });
    
    // Track buttons
    const trackButtons = document.querySelectorAll('.track-btn:not([disabled])');
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const touristId = this.getAttribute('data-id');
            showNotification('Tracking tourist location...');
            
            // In a real app, this would open a tracking interface or redirect to a map
            setTimeout(() => {
                if (touristId === '1') {
                    window.location.href = 'alerts.html'; // Redirect to alert page for tourist with active alert
                } else {
                    showNotification('Tourist location tracking activated');
                }
            }, 1000);
        });
    });
    
    // Contact buttons
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const touristId = this.getAttribute('data-id');
            
            // Create a contact options popup
            const popup = document.createElement('div');
            popup.className = 'contact-popup';
            popup.innerHTML = `
                <div class="contact-popup-content">
                    <h4>Contact Options</h4>
                    <button class="contact-option call-option">
                        <span class="material-icons">call</span>
                        Call Tourist
                    </button>
                    <button class="contact-option message-option">
                        <span class="material-icons">message</span>
                        Send Message
                    </button>
                    <button class="contact-option email-option">
                        <span class="material-icons">email</span>
                        Send Email
                    </button>
                    <button class="contact-option close-popup">
                        <span class="material-icons">close</span>
                        Cancel
                    </button>
                </div>
            `;
            
            // Add CSS for the popup
            const style = document.createElement('style');
            style.textContent = `
                .contact-popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                
                .contact-popup-content {
                    background-color: var(--dark-card-bg);
                    border-radius: 8px;
                    padding: 20px;
                    width: 300px;
                    box-shadow: var(--dark-shadow);
                }
                
                .contact-popup-content h4 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: var(--dark-text-primary);
                    font-size: 1.1rem;
                    text-align: center;
                }
                
                .contact-option {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 10px;
                    border-radius: 6px;
                    background-color: var(--dark-bg-secondary);
                    color: var(--dark-text-primary);
                    border: 1px solid var(--dark-border);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .contact-option:hover {
                    background-color: var(--dark-primary);
                    color: white;
                }
                
                .contact-option.close-popup {
                    background-color: transparent;
                    border: 1px solid var(--dark-border);
                    color: var(--dark-text-secondary);
                }
                
                .contact-option.close-popup:hover {
                    background-color: var(--dark-danger);
                    color: white;
                    border-color: var(--dark-danger);
                }
            `;
            document.head.appendChild(style);
            
            // Add to the DOM
            document.body.appendChild(popup);
            
            // Handle option clicks
            popup.querySelector('.call-option').addEventListener('click', function() {
                showNotification('Calling tourist...');
                popup.remove();
            });
            
            popup.querySelector('.message-option').addEventListener('click', function() {
                showNotification('Opening messaging interface...');
                popup.remove();
            });
            
            popup.querySelector('.email-option').addEventListener('click', function() {
                showNotification('Opening email composer...');
                popup.remove();
            });
            
            popup.querySelector('.close-popup').addEventListener('click', function() {
                popup.remove();
            });
        });
    });
    
    // Highlight row with active alert
    const activeAlertRow = document.querySelector('.tourist-table tbody tr.active-alert');
    if (activeAlertRow) {
        activeAlertRow.style.animation = 'pulse-bg 2s infinite';
        
        // Add CSS for the pulsing effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-bg {
                0% {
                    background-color: rgba(239, 68, 68, 0.1);
                }
                50% {
                    background-color: rgba(239, 68, 68, 0.2);
                }
                100% {
                    background-color: rgba(239, 68, 68, 0.1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Setup modal functionality
function setupModalFunctionality() {
    const modal = document.getElementById('tourist-detail-modal');
    const closeButtons = modal.querySelectorAll('.close-modal, .secondary-btn');
    
    // Close modal when clicking close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // View Alert Details button
    const viewAlertButton = modal.querySelector('.primary-btn');
    if (viewAlertButton) {
        viewAlertButton.addEventListener('click', function() {
            window.location.href = 'alerts.html';
        });
    }
}

// Open tourist modal with specific tourist data
function openTouristModal(touristId) {
    const modal = document.getElementById('tourist-detail-modal');
    
    // In a real app, you would fetch tourist data based on ID
    // For now, we'll just show the modal with sample data
    
    modal.classList.add('show');
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.tourist-table tbody tr');
            
            tableRows.forEach(row => {
                const name = row.querySelector('.name').textContent.toLowerCase();
                const email = row.querySelector('.email').textContent.toLowerCase();
                const nationality = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const passport = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || 
                    email.includes(searchTerm) || 
                    nationality.includes(searchTerm) || 
                    passport.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Add CSS for the notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #3B82F6;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Show the notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}