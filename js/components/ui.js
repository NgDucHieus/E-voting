// UI Components and Functionality

const UI = {
    // State for UI
    progressSteps: null,
    
    // Initialize UI components
    initializeUI: function() {
        this.progressSteps = document.querySelectorAll('.step');
        
        // Set up window click handler for modal closing
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target);
            }
        });
    },
    
    // Modal functions
    showModal: function(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    hideModal: function(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    // Progress step management
    updateProgressSteps: function() {
        if (!this.progressSteps) return;
        
        this.progressSteps.forEach((step, index) => {
            if (index + 1 < Voting.currentStep) {
                step.classList.add('active');
            } else if (index + 1 === Voting.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    },
    
    // Section visibility
    updateSectionVisibility: function() {
        const votingSection = document.querySelector('.voting-section');
        const reviewSection = document.querySelector('.review-section');
        
        if (Voting.currentStep === 2) {
            if (votingSection) votingSection.style.display = 'block';
            if (reviewSection) reviewSection.style.display = 'none';
        } else if (Voting.currentStep === 3) {
            if (votingSection) votingSection.style.display = 'none';
            if (reviewSection) reviewSection.style.display = 'block';
            Voting.updateReviewSummary();
        }
    }
}; 