document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Initialize charts
    initIncidentTypesChart();
    initLocationChart();
    initTrendChart();
    
    // Chart view toggle buttons
    const chartActionBtns = document.querySelectorAll('.chart-action-btn');
    
    chartActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get all buttons in this chart's action group
            const actionGroup = this.parentElement;
            const buttons = actionGroup.querySelectorAll('.chart-action-btn');
            
            // Remove active class from all buttons in this group
            buttons.forEach(button => button.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the chart container and chart type
            const chartContainer = this.closest('.chart-container');
            const chartCanvas = chartContainer.querySelector('canvas');
            const chartId = chartCanvas.id;
            const viewType = this.getAttribute('data-view');
            const periodType = this.getAttribute('data-period');
            
            // Update chart based on the button clicked
            if (chartId === 'incident-types-chart' && viewType) {
                updateIncidentTypesChart(viewType);
            } else if (chartId === 'location-chart' && viewType) {
                updateLocationChart(viewType);
            } else if (chartId === 'trend-chart' && periodType) {
                updateTrendChart(periodType);
            }
        });
    });
    
    // Date range change handler
    const dateRangeSelect = document.getElementById('date-range');
    
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            const days = this.value;
            
            if (days === 'custom') {
                // In a real app, you would show a date picker here
                alert('Custom date range picker would appear here');
            } else {
                // Update all charts with new date range
                updateChartsWithDateRange(days);
            }
        });
    }
    
    // Export button handler
    const exportBtn = document.querySelector('.export-btn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // In a real app, you would generate and download a report
            showNotification('Report exported successfully!', 'success');
        });
    }
});

// Chart instances
let incidentTypesChart;
let locationChart;
let trendChart;

// Chart data
const chartData = {
    incidentTypes: {
        labels: ['Theft', 'Medical Emergency', 'Lost Tourist', 'Harassment', 'Scam', 'Other'],
        data: [38, 24, 18, 12, 8, 5],
        colors: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
        ]
    },
    locations: {
        labels: ['Beach Area', 'City Center', 'Mountain Trails', 'Shopping District', 'Historical Sites'],
        data: [42, 38, 27, 23, 15]
    },
    trends: {
        daily: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: {
                alerts: [12, 19, 15, 17, 22, 28, 24],
                resolved: [10, 15, 13, 15, 20, 25, 21]
            }
        },
        weekly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: {
                alerts: [65, 72, 78, 82],
                resolved: [60, 65, 70, 75]
            }
        },
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: {
                alerts: [180, 195, 210, 250, 230, 247],
                resolved: [165, 180, 195, 220, 210, 189]
            }
        }
    }
};

// Initialize Incident Types Chart
function initIncidentTypesChart() {
    const ctx = document.getElementById('incident-types-chart').getContext('2d');
    
    incidentTypesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartData.incidentTypes.labels,
            datasets: [{
                data: chartData.incidentTypes.data,
                backgroundColor: chartData.incidentTypes.colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update Incident Types Chart
function updateIncidentTypesChart(type) {
    if (!incidentTypesChart) return;
    
    incidentTypesChart.destroy();
    
    const ctx = document.getElementById('incident-types-chart').getContext('2d');
    
    if (type === 'pie') {
        incidentTypesChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.incidentTypes.labels,
                datasets: [{
                    data: chartData.incidentTypes.data,
                    backgroundColor: chartData.incidentTypes.colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    } else if (type === 'bar') {
        incidentTypesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.incidentTypes.labels,
                datasets: [{
                    label: 'Incident Count',
                    data: chartData.incidentTypes.data,
                    backgroundColor: chartData.incidentTypes.colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Initialize Location Chart
function initLocationChart() {
    const ctx = document.getElementById('location-chart').getContext('2d');
    
    locationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.locations.labels,
            datasets: [{
                label: 'Alerts by Location',
                data: chartData.locations.data,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update Location Chart
function updateLocationChart(type) {
    if (!locationChart) return;
    
    locationChart.destroy();
    
    const ctx = document.getElementById('location-chart').getContext('2d');
    
    if (type === 'bar') {
        locationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.locations.labels,
                datasets: [{
                    label: 'Alerts by Location',
                    data: chartData.locations.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    } else if (type === 'line') {
        locationChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.locations.labels,
                datasets: [{
                    label: 'Alerts by Location',
                    data: chartData.locations.data,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Initialize Trend Chart
function initTrendChart() {
    const ctx = document.getElementById('trend-chart').getContext('2d');
    const data = chartData.trends.daily;
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Alerts',
                    data: data.data.alerts,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Resolved',
                    data: data.data.resolved,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
                        drawOnChartArea: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                    }
                }
            }
        }
    });
}

// Update Trend Chart
function updateTrendChart(period) {
    if (!trendChart) return;
    
    const data = chartData.trends[period];
    
    trendChart.data.labels = data.labels;
    trendChart.data.datasets[0].data = data.data.alerts;
    trendChart.data.datasets[1].data = data.data.resolved;
    
    trendChart.update();
}

// Update all charts with new date range
function updateChartsWithDateRange(days) {
    // In a real application, you would fetch new data based on the date range
    // For this demo, we'll just show a notification
    showNotification(`Charts updated with data from the last ${days} days`, 'info');
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

// Add CSS for notifications if not already added in case-management.js
if (!document.querySelector('style[data-notification-styles]')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.setAttribute('data-notification-styles', '');
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
}