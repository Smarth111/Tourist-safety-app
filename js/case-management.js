document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Case detail modal functionality
    const viewButtons = document.querySelectorAll('.view-btn');
    const modal = document.getElementById('case-detail-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalCloseBtn = document.querySelector('.modal-footer .secondary-btn');
    
    if (viewButtons && modal) {
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const caseId = button.getAttribute('data-id');
                // In a real application, you would fetch case details based on the ID
                // For now, we'll just show the modal with sample data
                showCaseDetails(caseId);
                modal.classList.add('active');
            });
        });
    }
    
    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    if (modalCloseBtn && modal) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Form functionality - Add item row
    const addItemBtn = document.querySelector('.add-item-btn');
    const itemsContainer = document.querySelector('.items-container');
    
    if (addItemBtn && itemsContainer) {
        addItemBtn.addEventListener('click', () => {
            const newRow = document.createElement('div');
            newRow.className = 'item-row';
            newRow.innerHTML = `
                <input type="text" placeholder="Item description" class="item-description">
                <input type="text" placeholder="Value/Amount" class="item-value">
                <button type="button" class="remove-btn">
                    <span class="material-icons">remove</span>
                </button>
            `;
            itemsContainer.appendChild(newRow);
            
            // Add event listener to remove button
            const removeBtn = newRow.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => {
                itemsContainer.removeChild(newRow);
            });
        });
    }
    
    // Form functionality - Add witness row
    const addWitnessBtn = document.querySelector('.add-witness-btn');
    const witnessesContainer = document.querySelector('.witnesses-container');
    
    if (addWitnessBtn && witnessesContainer) {
        addWitnessBtn.addEventListener('click', () => {
            const newRow = document.createElement('div');
            newRow.className = 'witness-row';
            newRow.innerHTML = `
                <input type="text" placeholder="Witness name" class="witness-name">
                <input type="text" placeholder="Contact information" class="witness-contact">
                <button type="button" class="remove-btn">
                    <span class="material-icons">remove</span>
                </button>
            `;
            witnessesContainer.appendChild(newRow);
            
            // Add event listener to remove button
            const removeBtn = newRow.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => {
                witnessesContainer.removeChild(newRow);
            });
        });
    }
    
    // File upload functionality
    const fileUpload = document.getElementById('evidence-upload');
    const uploadedFiles = document.querySelector('.uploaded-files');
    
    if (fileUpload && uploadedFiles) {
        fileUpload.addEventListener('change', () => {
            uploadedFiles.innerHTML = ''; // Clear previous files
            
            Array.from(fileUpload.files).forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                // Determine file type icon
                let fileIcon = 'description';
                if (file.type.startsWith('image/')) {
                    fileIcon = 'image';
                } else if (file.type.startsWith('video/')) {
                    fileIcon = 'videocam';
                } else if (file.type.startsWith('audio/')) {
                    fileIcon = 'audiotrack';
                }
                
                // Format file size
                const fileSize = formatFileSize(file.size);
                
                fileItem.innerHTML = `
                    <span class="material-icons">${fileIcon}</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${fileSize}</span>
                    <button type="button" class="remove-file-btn">
                        <span class="material-icons">close</span>
                    </button>
                `;
                
                uploadedFiles.appendChild(fileItem);
                
                // Add event listener to remove button
                const removeBtn = fileItem.querySelector('.remove-file-btn');
                removeBtn.addEventListener('click', () => {
                    uploadedFiles.removeChild(fileItem);
                    // Note: This doesn't actually clear the file from the input
                    // In a real app, you would need to handle this differently
                });
            });
        });
    }
    
    // Form submission
    const caseForm = document.querySelector('.case-form');
    
    if (caseForm) {
        caseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real application, you would validate and submit the form data
            // For now, we'll just show a notification
            showNotification('Case submitted successfully!', 'success');
            
            // Reset form
            caseForm.reset();
            if (uploadedFiles) {
                uploadedFiles.innerHTML = '';
            }
        });
    }
    
    // Save as draft button
    const saveAsDraftBtn = document.querySelector('.secondary-btn');
    
    if (saveAsDraftBtn && caseForm) {
        saveAsDraftBtn.addEventListener('click', () => {
            // In a real application, you would save the form data as a draft
            // For now, we'll just show a notification
            showNotification('Case saved as draft', 'info');
        });
    }
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to show case details in modal
function showCaseDetails(caseId) {
    // In a real application, you would fetch case details from the server
    // For now, we'll just update the modal title with the case ID
    console.log(`Showing details for case: ${caseId}`);
    
    // You could update other elements in the modal based on the case ID
    // This would typically involve an API call to get the case details
}

// Function to show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="material-icons">
                ${type === 'success' ? 'check_circle' : 
                  type === 'error' ? 'error' : 
                  type === 'warning' ? 'warning' : 'info'}
            </span>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <span class="material-icons">close</span>
        </button>
    `;
    
    // Add notification to the DOM
    document.body.appendChild(notification);
    
    // Add active class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Add event listener to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300); // Wait for animation to complete
    });
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('active');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--card-bg);
        border-radius: 8px;
        box-shadow: var(--card-shadow-hover);
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 300px;
        max-width: calc(100% - 40px);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1100;
    }
    
    .notification.active {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification.success .material-icons {
        color: var(--success-color);
    }
    
    .notification.error .material-icons {
        color: var(--danger-color);
    }
    
    .notification.warning .material-icons {
        color: var(--warning-color);
    }
    
    .notification.info .material-icons {
        color: var(--info-color);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .notification-close:hover {
        color: var(--danger-color);
    }
`;

document.head.appendChild(notificationStyles);