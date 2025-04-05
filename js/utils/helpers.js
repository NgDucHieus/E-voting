// Utility helper functions

const Utils = {
    // Alert functions
    showAlert: function(message, type) {
        const alertContainer = document.querySelector('.alert-container');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas ${this.getAlertIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        alertContainer.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    },

    getAlertIcon: function(type) {
        switch (type) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-exclamation-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'info':
                return 'fa-info-circle';
            default:
                return 'fa-info-circle';
        }
    },

    // Loading overlay functions
    showLoading: function() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.style.display = 'flex';
    },

    hideLoading: function() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.style.display = 'none';
    },

    // Simulate API call (replace with actual API calls)
    simulateApiCall: function(delay = 1500) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }
}; 