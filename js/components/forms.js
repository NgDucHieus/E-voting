// Forms Management

const Forms = {
    // Initialize form components
    initializeForms: function() {
        this.initializeVoterIdInputs();
        this.initializeAuthForms();
    },
    
    // Handle segmented input for Voter ID
    initializeVoterIdInputs: function() {
        // Handle both sets of inputs (login modal and auth step)
        const voterIdInputsLoginModal = document.querySelectorAll('#loginModal .input-segment input');
        const voterIdInputsAuthStep = document.querySelectorAll('#voterVerificationForm .input-segment input');
        
        // Initialize both sets of inputs
        this.setupInputBehavior(voterIdInputsLoginModal);
        this.setupInputBehavior(voterIdInputsAuthStep);
    },
    
    setupInputBehavior: function(inputs) {
        inputs.forEach((input, index) => {
            // Handle input
            input.addEventListener('input', function(e) {
                // Remove non-numeric characters
                this.value = this.value.replace(/[^0-9]/g, '');
                
                // Auto move to next input when current is filled
                if (this.value.length === this.maxLength) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                }
            });

            // Handle backspace
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                    inputs[index - 1].focus();
                    e.preventDefault();
                }
            });

            // Handle paste
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedText = (e.clipboardData || window.clipboardData).getData('text');
                const numbers = pastedText.replace(/[^0-9]/g, '');
                
                // Distribute numbers across inputs
                for (let i = index; i < inputs.length && (i - index) * 4 < numbers.length; i++) {
                    const start = (i - index) * 4;
                    const end = start + 4;
                    const segment = numbers.slice(start, end);
                    if (segment) {
                        inputs[i].value = segment;
                        if (segment.length === 4 && i < inputs.length - 1) {
                            inputs[i + 1].focus();
                        }
                    }
                }
            });

            // Handle left/right arrow keys
            input.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight' && this.selectionStart === this.value.length) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                        e.preventDefault();
                    }
                } else if (e.key === 'ArrowLeft' && this.selectionStart === 0) {
                    if (index > 0) {
                        inputs[index - 1].focus();
                        inputs[index - 1].selectionStart = inputs[index - 1].value.length;
                        e.preventDefault();
                    }
                }
            });
        });
    },
    
    // Authentication forms
    initializeAuthForms: function() {
        const authSteps = document.querySelectorAll('.auth-step');
        const progressSteps = document.querySelectorAll('.progress-step');
        let currentAuthStep = 0;

        // Handle form submissions
        const forms = document.querySelectorAll('.verification-form');
        forms.forEach((form, index) => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted');
                
                // Validate form data
                if (Forms.validateForm(this)) {
                    console.log('Form validation passed');
                    // Show loading state
                    const submitBtn = this.querySelector('.step-actions .btn');
                    if (submitBtn) {
                        const originalText = submitBtn.innerHTML;
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
                        
                        // Simulate API call
                        setTimeout(() => {
                            console.log('Moving to next step');
                            // Hide current step
                            if (authSteps[currentAuthStep]) {
                                authSteps[currentAuthStep].classList.remove('active');
                                authSteps[currentAuthStep].style.display = 'none';
                            }
                            
                            // Mark current step as completed
                            if (progressSteps[currentAuthStep]) {
                                progressSteps[currentAuthStep].classList.remove('active');
                                progressSteps[currentAuthStep].classList.add('completed');
                            }
                            
                            // Move to next step
                            currentAuthStep++;
                            console.log('Current step:', currentAuthStep);
                            
                            if (currentAuthStep < progressSteps.length) {
                                // Show next step
                                progressSteps[currentAuthStep].classList.add('active');
                                authSteps[currentAuthStep].classList.add('active');
                                authSteps[currentAuthStep].style.display = 'block';
                                
                                console.log('Next step shown');
                            }
                            
                            // Reset button state
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalText;
                        }, 1500);
                    }
                } else {
                    console.log('Form validation failed');
                }
            });
        });
        
        // Initialize first step
        if (progressSteps[0]) {
            progressSteps[0].classList.add('active');
        }
        if (authSteps[0]) {
            authSteps[0].classList.add('active');
            authSteps[0].style.display = 'block';
        }
        
        // Hide all steps except the first one
        authSteps.forEach((step, index) => {
            if (index !== 0) {
                step.style.display = 'none';
            }
        });
        
        // Initialize OTP handlers
        this.initializeOtpHandlers();
        
        // Initialize biometric verification handlers
        this.initializeBiometricHandlers();
    },
    
    validateForm: function(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        // Special validation for Voter ID step
        if (form.querySelector('.segmented-input')) {
            const voterIdInputs = form.querySelectorAll('.input-segment input');
            const voterId = Array.from(voterIdInputs).map(input => input.value).join('');
            console.log('Voter ID:', voterId);
            
            if (voterId.length !== 12) {
                isValid = false;
                voterIdInputs.forEach(input => {
                    input.parentElement.classList.add('error');
                });
                Utils.showAlert('Please enter a valid 12-digit Voter ID', 'error');
                return false;
            }
            
            // Remove error state if valid
            voterIdInputs.forEach(input => {
                input.parentElement.classList.remove('error');
            });
        }

        // Regular validation for other inputs
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.parentElement.classList.add('error');
            } else {
                input.parentElement.classList.remove('error');
            }
        });

        console.log('Form validation result:', isValid);
        return isValid;
    },
    
    initializeOtpHandlers: function() {
        // Handle OTP resend
        const resendBtn = document.querySelector('.code-actions .btn:nth-child(2)');
        if (resendBtn) {
            resendBtn.addEventListener('click', function() {
                // Add loading state
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resending...';
                
                // Simulate API call
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-redo"></i> Resend Code';
                    Utils.showAlert('OTP code has been resent to your phone', 'success');
                }, 2000);
            });
        }

        // Handle send OTP
        const sendOtpBtn = document.getElementById('sendOtpBtn');
        if (sendOtpBtn) {
            sendOtpBtn.addEventListener('click', function() {
                const phoneNumber = document.getElementById('phone-number').value;
                
                if (!phoneNumber) {
                    Utils.showAlert('Please enter your phone number', 'error');
                    return;
                }
                
                // Add loading state
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Simulate API call
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-paper-plane"></i> Send Code';
                    Utils.showAlert('OTP code has been sent to your phone', 'success');
                }, 2000);
            });
        }
    },
    
    initializeBiometricHandlers: function() {
        // Handle biometric verification
        const biometricBtns = document.querySelectorAll('.biometric-options .btn');
        biometricBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Add loading state
                this.disabled = true;
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
                
                // Simulate API call
                setTimeout(() => {
                    this.disabled = false;
                    this.innerHTML = originalText;
                }, 2000);
            });
        });

        // Handle skip biometric verification
        const skipBtn = document.querySelector('.skip-option .btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', function() {
                // Show confirmation dialog
                if (confirm('Are you sure you want to skip biometric verification? This is recommended for security.')) {
                    const progressSteps = document.querySelectorAll('.progress-step');
                    const authSteps = document.querySelectorAll('.auth-step');
                    let currentAuthStep = Array.from(authSteps).findIndex(step => step.classList.contains('active'));
                    
                    // Mark current step as completed
                    if (progressSteps[currentAuthStep]) {
                        progressSteps[currentAuthStep].classList.remove('active');
                        progressSteps[currentAuthStep].classList.add('completed');
                    }
                    
                    // Move to next step
                    currentAuthStep++;
                    if (currentAuthStep < progressSteps.length) {
                        progressSteps[currentAuthStep].classList.add('active');
                        authSteps[currentAuthStep].classList.add('active');
                    }
                }
            });
        }
    }
}; 