document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    initAlertMap();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Action buttons functionality
    setupActionButtons();
    
    // Chat functionality
    setupChatFunctionality();
});

// Initialize Leaflet map for the alert
function initAlertMap() {
    const mapElement = document.getElementById('alert-map');
    
    if (!mapElement) return;
    
    // Create a dark-themed map centered on Central Park
    const map = L.map('alert-map').setView([40.7812, -73.9665], 15);
    
    // Add a dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    
    // Add a pulsing marker for the tourist's location
    const pulsingIcon = L.divIcon({
        className: 'pulsing-icon',
        html: '<div class="pulsing-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    
    // Define custom marker icons for different alert types
    const theftMarkerIcon = L.icon({
        iconUrl: 'images/markers/theft-marker.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    
    const medicalMarkerIcon = L.icon({
        iconUrl: 'images/markers/medical-marker.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    
    const harassmentMarkerIcon = L.icon({
        iconUrl: 'images/markers/harassment-marker.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    
    const naturalMarkerIcon = L.icon({
        iconUrl: 'images/markers/natural-marker.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    
    const otherMarkerIcon = L.icon({
        iconUrl: 'images/markers/other-marker.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
    
    const marker = L.marker([40.7812, -73.9665], { icon: pulsingIcon }).addTo(map);
    
    // Add a circle to show approximate area
    const circle = L.circle([40.7812, -73.9665], {
        color: 'rgba(239, 68, 68, 0.3)',
        fillColor: 'rgba(239, 68, 68, 0.1)',
        fillOpacity: 0.5,
        radius: 100
    }).addTo(map);
    
    // Add CSS for the pulsing effect
    const style = document.createElement('style');
    style.textContent = `
        .pulsing-marker {
            width: 15px;
            height: 15px;
            background-color: #EF4444;
            border-radius: 50%;
            box-shadow: 0 0 0 rgba(239, 68, 68, 0.4);
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Simulate movement of the tourist (for demo purposes)
    let movementCounter = 0;
    const movementInterval = setInterval(() => {
        movementCounter++;
        
        // Small random movement
        const lat = 40.7812 + (Math.random() - 0.5) * 0.001;
        const lng = -73.9665 + (Math.random() - 0.5) * 0.001;
        
        marker.setLatLng([lat, lng]);
        circle.setLatLng([lat, lng]);
        
        // Update location details
        document.querySelector('.location-time').textContent = 'Updated just now';
        
        // Add system message about location update after a few movements
        if (movementCounter === 3) {
            addSystemMessage('Tourist location updated. Moving south on East Drive.');
        }
        
        // Clear interval after some time
        if (movementCounter >= 5) {
            clearInterval(movementInterval);
        }
    }, 20000); // Update every 20 seconds
    
    // Add sample alerts with different marker types
    // Theft alert
    L.marker([40.7850, -73.9700], { icon: theftMarkerIcon })
        .addTo(map)
        .bindPopup('<b>Theft Alert</b><br>Tourist reported stolen wallet');
    
    // Medical alert
    L.marker([40.7780, -73.9630], { icon: medicalMarkerIcon })
        .addTo(map)
        .bindPopup('<b>Medical Emergency</b><br>Tourist needs medical assistance');
    
    // Harassment alert
    L.marker([40.7830, -73.9690], { icon: harassmentMarkerIcon })
        .addTo(map)
        .bindPopup('<b>Harassment Report</b><br>Tourist reporting harassment incident');
    
    // Natural disaster alert
    L.marker([40.7790, -73.9720], { icon: naturalMarkerIcon })
        .addTo(map)
        .bindPopup('<b>Natural Hazard</b><br>Flooding reported in this area');
    
    // Other alert
    L.marker([40.7810, -73.9600], { icon: otherMarkerIcon })
        .addTo(map)
        .bindPopup('<b>Other Alert</b><br>Tourist requesting general assistance');
}

// Setup action buttons
function setupActionButtons() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonType = this.classList[1]; // police-btn, hospital-btn, etc.
            let message = '';
            
            // Different actions based on button type
            switch(buttonType) {
                case 'police-btn':
                    message = 'Nearest police unit has been assigned.';
                    addSystemMessage('Officer Rodriguez (Badge #4872) has been assigned and is en route. ETA: 3 minutes.');
                    break;
                case 'hospital-btn':
                    message = 'Hospital has been notified.';
                    addSystemMessage('NY General Hospital has been notified and is standing by.');
                    break;
                case 'call-btn':
                    message = 'Calling tourist...';
                    // In a real app, this would initiate a call
                    break;
                case 'message-btn':
                    message = 'Message sent to tourist.';
                    // In a real app, this would open a direct message interface
                    break;
                case 'resolve-btn':
                    message = 'Alert marked as resolved.';
                    document.querySelector('.profile-meta-item.alert-status').innerHTML = 
                        '<span class="material-icons">check_circle</span> Resolved';
                    document.querySelector('.profile-meta-item.alert-status').style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                    document.querySelector('.profile-meta-item.alert-status').style.color = 'var(--dark-success)';
                    break;
            }
            
            // Show notification
            showNotification(message);
            
            // Disable button after click (except for call and message)
            if (buttonType !== 'call-btn' && buttonType !== 'message-btn') {
                this.disabled = true;
                this.style.opacity = '0.6';
                this.style.cursor = 'not-allowed';
            }
        });
    });
}

// Setup chat functionality
function setupChatFunctionality() {
    const chatInput = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-btn');
    
    if (chatInput && sendBtn) {
        // Send message on button click
        sendBtn.addEventListener('click', function() {
            sendMessage();
        });
        
        // Send message on Enter key
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Send message function
function sendMessage() {
    const chatInput = document.querySelector('.message-input');
    const chatMessages = document.querySelector('.chat-messages');
    
    const message = chatInput.value.trim();
    
    if (message) {
        // Create new message element
        const messageItem = document.createElement('div');
        messageItem.className = 'message-item police'; // Assuming police role
        
        messageItem.innerHTML = `
            <div class="message-avatar">
                <span class="material-icons">local_police</span>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">You (Police)</span>
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
                <div class="message-text">
                    ${message}
                </div>
            </div>
        `;
        
        // Add to chat
        chatMessages.appendChild(messageItem);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate response after a delay
        setTimeout(() => {
            if (message.toLowerCase().includes('status') || message.toLowerCase().includes('update')) {
                addSystemMessage('Tourist is still at Central Park. Vital signs are normal based on smartwatch data.');
            } else if (message.toLowerCase().includes('hospital') || message.toLowerCase().includes('medical')) {
                addHospitalMessage('We have a medical team on standby. Do you need immediate assistance?');
            } else {
                // Random response from tourism department
                addTourismMessage('Thank you for the update. We\'re monitoring the situation.');
            }
        }, 2000);
    }
}

// Add system message
function addSystemMessage(text) {
    const chatMessages = document.querySelector('.chat-messages');
    
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item system';
    
    messageItem.innerHTML = `
        <div class="message-content">
            <div class="message-text">
                ${text}
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageItem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add hospital message
function addHospitalMessage(text) {
    const chatMessages = document.querySelector('.chat-messages');
    
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item hospital';
    
    messageItem.innerHTML = `
        <div class="message-avatar">
            <span class="material-icons">local_hospital</span>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">Dr. Sarah (NY General)</span>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
            <div class="message-text">
                ${text}
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageItem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add tourism department message
function addTourismMessage(text) {
    const chatMessages = document.querySelector('.chat-messages');
    
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item tourism';
    
    messageItem.innerHTML = `
        <div class="message-avatar">
            <span class="material-icons">tour</span>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">Tourism Dept.</span>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
            <div class="message-text">
                ${text}
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageItem);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get current time in HH:MM AM/PM format
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes} ${ampm}`;
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