/**
 * Main JavaScript file for E-Voting System
 * Contains core functionality and utility methods
 */

// Global namespace for the application
const EVoting = {
    // Application state
    state: {
        currentUser: null,
        isAuthenticated: false,
        selectedCandidate: null,
        currentStep: 1
    },
    
    // UI Utilities
    ui: {
        /**
         * Show a modal dialog
         * @param {string} modalId - The ID of the modal to show
         */
        showModal: function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        },
        
        /**
         * Hide a modal dialog
         * @param {string} modalId - The ID of the modal to hide
         */
        hideModal: function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        },
        
        /**
         * Show an alert message
         * @param {string} message - The message to display
         * @param {string} type - The type of alert (success, error, warning, info)
         */
        showAlert: function(message, type = 'info') {
            const alertContainer = document.querySelector('.alert-container') || this.createAlertContainer();
            const alert = document.createElement('div');
            alert.className = `alert alert-${type}`;
            
            let icon = '';
            switch(type) {
                case 'success':
                    icon = '<i class="fas fa-check-circle"></i>';
                    break;
                case 'error':
                    icon = '<i class="fas fa-exclamation-circle"></i>';
                    break;
                case 'warning':
                    icon = '<i class="fas fa-exclamation-triangle"></i>';
                    break;
                case 'info':
                case 'default':
                    icon = '<i class="fas fa-info-circle"></i>';
                    break;
            }
            
            alert.innerHTML = `${icon} <span>${message}</span>`;
            alertContainer.appendChild(alert);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        },
        
        /**
         * Create an alert container if it doesn't exist
         * @returns {HTMLElement} - The alert container element
         */
        createAlertContainer: function() {
            const container = document.createElement('div');
            container.className = 'alert-container';
            document.body.appendChild(container);
            return container;
        },
        
        /**
         * Show a loading spinner
         * @param {string} message - Optional message to display with the spinner
         */
        showLoading: function(message = 'Loading...') {
            // Create loading overlay if it doesn't exist
            let overlay = document.querySelector('.loading-overlay');
            
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'loading-overlay';
                
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                
                const messageEl = document.createElement('p');
                messageEl.className = 'loading-message';
                
                overlay.appendChild(spinner);
                overlay.appendChild(messageEl);
                document.body.appendChild(overlay);
            }
            
            // Update the message
            document.querySelector('.loading-message').textContent = message;
            
            // Show the overlay
            overlay.style.display = 'flex';
        },
        
        /**
         * Hide the loading spinner
         */
        hideLoading: function() {
            const overlay = document.querySelector('.loading-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
    },
    
    // Event listeners setup
    setupEventListeners: function() {
        // Close modal on click outside or on close button
        document.addEventListener('click', function(e) {
            // Close button
            if (e.target.classList.contains('close-btn')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    EVoting.ui.hideModal(modal.id);
                }
            }
            
            // Click outside modal content
            if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
                EVoting.ui.hideModal(e.target.id);
            }
        });
    },
    
    // Initialize the application
    init: function() {
        this.setupEventListeners();
        console.log('E-Voting application initialized');
    }
};

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    EVoting.init();
}); 