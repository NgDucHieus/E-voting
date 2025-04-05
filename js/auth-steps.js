/**
 * Authentication Steps Navigation
 * Controls the flow between authentication steps
 */

// Function to initialize auth steps
function initAuthSteps() {
    console.log("Initializing auth steps");
    
    // Get all auth steps
    const voterVerificationStep = document.getElementById('voter-verification-step');
    const otpVerificationStep = document.getElementById('otp-verification-step');
    const biometricVerificationStep = document.getElementById('biometric-verification-step');
    
    if (!voterVerificationStep || !otpVerificationStep || !biometricVerificationStep) {
        console.error("Auth step elements not found, retrying in 500ms");
        setTimeout(initAuthSteps, 500);
        return;
    }
    
    console.log("Auth step elements found, setting up event listeners");
    
    // Set initial display state
    voterVerificationStep.style.display = 'block';
    otpVerificationStep.style.display = 'none';
    biometricVerificationStep.style.display = 'none';
    
    // Set first step as active in progress indicator
    updateProgressIndicator(1);
    
    // Handle voter verification form submission
    const voterVerificationForm = document.querySelector('#voter-verification-step form');
    console.log("Voter verification form:", voterVerificationForm);
    
    if (voterVerificationForm) {
        voterVerificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Voter verification form submitted");
            
            // Show loading state on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate verification (Replace with actual API call)
            setTimeout(function() {
                console.log("Transitioning to OTP verification step");
                // Hide current step and show next step
                voterVerificationStep.style.display = 'none';
                otpVerificationStep.style.display = 'block';
                
                // Update progress indicator
                updateProgressIndicator(2);
                
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    } else {
        console.error("Voter verification form not found");
    }
    
    // Handle OTP verification form submission
    const otpVerificationForm = document.querySelector('#otp-verification-step form');
    console.log("OTP verification form:", otpVerificationForm);
    
    if (otpVerificationForm) {
        otpVerificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("OTP verification form submitted");
            
            // Show loading state on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate verification (Replace with actual API call)
            setTimeout(function() {
                console.log("Transitioning to biometric verification step");
                // Hide current step and show next step
                otpVerificationStep.style.display = 'none';
                biometricVerificationStep.style.display = 'block';
                
                // Update progress indicator
                updateProgressIndicator(3);
                
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    } else {
        console.error("OTP verification form not found");
    }
    
    // Handle biometric verification form submission
    const biometricVerificationForm = document.querySelector('#biometric-verification-step form');
    console.log("Biometric verification form:", biometricVerificationForm);
    
    if (biometricVerificationForm) {
        biometricVerificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Biometric verification form submitted");
            
            // Show loading state on button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate verification (Replace with actual API call)
            setTimeout(function() {
                console.log("Authentication complete");
                // Hide auth steps section and show success or proceed to voting interface
                document.querySelector('.auth-phase-section').style.display = 'none';
                
                // Here you would redirect to voting interface or show success message
                // For now, just show an alert
                showAlert('Authentication successful! Redirecting to voting interface...', 'success');
                
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Redirect after a delay
                setTimeout(function() {
                    // Redirect to voting page
                    // window.location.href = 'voting.html';
                }, 2000);
            }, 1500);
        });
    } else {
        console.error("Biometric verification form not found");
    }
}

// Update progress indicator
function updateProgressIndicator(activeStep) {
    console.log("Updating progress indicator to step", activeStep);
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index + 1 < activeStep) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else if (index + 1 === activeStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Show alert function
function showAlert(message, type) {
    const alertContainer = document.querySelector('.alert-container') || createAlertContainer();
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
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    alert.innerHTML = `${icon} <span>${message}</span>`;
    alertContainer.appendChild(alert);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Create alert container if not exists
function createAlertContainer() {
    const container = document.createElement('div');
    container.className = 'alert-container';
    document.body.appendChild(container);
    return container;
}

// Wait for the HTML components to be loaded before initializing auth steps
document.addEventListener('DOMContentLoaded', function() {
    // Add a delayed initialization to ensure components are loaded
    console.log("DOM loaded, waiting for components to load");
    setTimeout(initAuthSteps, 1000);
}); 