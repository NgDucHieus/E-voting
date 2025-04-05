// Authentication Service

const Auth = {
    // State
    isLoggedIn: false,
    currentUser: null,

    // Initialize authentication components
    initializeAuth: function() {
        // Modal elements
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        
        // Form elements
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        
        // Button elements
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Add event listeners
        if (loginBtn) loginBtn.addEventListener('click', () => UI.showModal(loginModal));
        if (signupBtn) signupBtn.addEventListener('click', () => UI.showModal(signupModal));
        if (logoutBtn) logoutBtn.addEventListener('click', this.handleLogout);
        
        // Form submissions
        if (loginForm) loginForm.addEventListener('submit', this.handleLogin);
        if (signupForm) signupForm.addEventListener('submit', this.handleSignup);
        if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', this.handleForgotPassword);
        
        // Setup modal navigation
        this.setupModalNavigation();
    },
    
    setupModalNavigation: function() {
        // Modal elements
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        
        // Modal close buttons
        const closeLoginModal = document.getElementById('closeLoginModal');
        const closeSignupModal = document.getElementById('closeSignupModal');
        const closeForgotPasswordModal = document.getElementById('closeForgotPasswordModal');
        
        // Modal switch links
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToLogin = document.getElementById('switchToLogin');
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const backToLogin = document.getElementById('backToLogin');
        
        // Close buttons
        if (closeLoginModal) closeLoginModal.addEventListener('click', () => UI.hideModal(loginModal));
        if (closeSignupModal) closeSignupModal.addEventListener('click', () => UI.hideModal(signupModal));
        if (closeForgotPasswordModal) closeForgotPasswordModal.addEventListener('click', () => UI.hideModal(forgotPasswordModal));
        
        // Navigation links
        if (switchToSignup) {
            switchToSignup.addEventListener('click', (e) => {
                e.preventDefault();
                UI.hideModal(loginModal);
                UI.showModal(signupModal);
            });
        }
        
        if (switchToLogin) {
            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                UI.hideModal(signupModal);
                UI.showModal(loginModal);
            });
        }
        
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                UI.hideModal(loginModal);
                UI.showModal(forgotPasswordModal);
            });
        }
        
        if (backToLogin) {
            backToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                UI.hideModal(forgotPasswordModal);
                UI.showModal(loginModal);
            });
        }
    },
    
    handleLogin: async function(e) {
        e.preventDefault();
        
        // Get voter ID segments and combine them
        const segment1 = document.getElementById('voter-id-segment-1')?.value || '';
        const segment2 = document.getElementById('voter-id-segment-2')?.value || '';
        const segment3 = document.getElementById('voter-id-segment-3')?.value || '';
        const voterId = segment1 + segment2 + segment3;
        
        const password = document.getElementById('password')?.value || '';
        const otp = document.getElementById('otp')?.value || '';
        
        Utils.showLoading();
        
        try {
            // Replace with actual API call
            await Utils.simulateApiCall();
            
            Auth.isLoggedIn = true;
            Auth.currentUser = voterId;
            
            // Update UI
            document.querySelector('.username').textContent = `Welcome, ${voterId}`;
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('logoutBtn').style.display = 'block';
            UI.hideModal(document.getElementById('loginModal'));
            Utils.showAlert('Login successful!', 'success');
            
            // Initialize voting interface
            Voting.initializeVotingInterface();
        } catch (error) {
            Utils.showAlert('Login failed. Please try again.', 'error');
        } finally {
            Utils.hideLoading();
        }
    },
    
    handleLogout: function() {
        Auth.isLoggedIn = false;
        Auth.currentUser = null;
        
        // Update UI
        document.querySelector('.username').textContent = 'Welcome, User';
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'none';
        
        // Reset voting state
        Voting.currentStep = 1;
        Voting.selectedCandidates.clear();
        UI.updateProgressSteps();
        
        document.querySelector('.voting-section').style.display = 'block';
        document.querySelector('.review-section').style.display = 'none';
        
        Utils.showAlert('Logged out successfully.', 'success');
    },
    
    handleSignup: async function(e) {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const voterId = document.getElementById('newVoterId').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            Utils.showAlert('Passwords do not match.', 'error');
            return;
        }
        
        Utils.showLoading();
        
        try {
            // Replace with actual API call
            await Utils.simulateApiCall();
            
            UI.hideModal(document.getElementById('signupModal'));
            Utils.showAlert('Account created successfully! Please login.', 'success');
            UI.showModal(document.getElementById('loginModal'));
            
            // Clear form
            document.getElementById('signupForm').reset();
        } catch (error) {
            Utils.showAlert('Failed to create account. Please try again.', 'error');
        } finally {
            Utils.hideLoading();
        }
    },
    
    handleForgotPassword: async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        const voterId = document.getElementById('resetVoterId').value;
        
        Utils.showLoading();
        
        try {
            // Replace with actual API call
            await Utils.simulateApiCall();
            
            UI.hideModal(document.getElementById('forgotPasswordModal'));
            Utils.showAlert('Password reset instructions have been sent to your email.', 'success');
            UI.showModal(document.getElementById('loginModal'));
            
            // Clear form
            document.getElementById('forgotPasswordForm').reset();
        } catch (error) {
            Utils.showAlert('Failed to process request. Please try again.', 'error');
        } finally {
            Utils.hideLoading();
        }
    }
}; 