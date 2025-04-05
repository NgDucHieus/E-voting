// API Service for backend communication

const ApiService = {
    // API endpoints (replace with actual API endpoints)
    BASE_URL: 'https://api.e-voting-system.com',
    
    // Auth endpoints
    login: async function(credentials) {
        // In a real app, you would make an API call here
        // return await this.post('/auth/login', credentials);
        
        // For demo purposes, we're simulating the API call
        await Utils.simulateApiCall();
        return { success: true, data: { userId: credentials.voterId, token: 'demo-token' } };
    },
    
    signup: async function(userData) {
        // In a real app, you would make an API call here
        // return await this.post('/auth/register', userData);
        
        // For demo purposes, we're simulating the API call
        await Utils.simulateApiCall();
        return { success: true, message: 'User registered successfully' };
    },
    
    requestPasswordReset: async function(resetData) {
        // In a real app, you would make an API call here
        // return await this.post('/auth/reset-password', resetData);
        
        // For demo purposes, we're simulating the API call
        await Utils.simulateApiCall();
        return { success: true, message: 'Password reset email sent' };
    },
    
    // OTP endpoints
    sendOtp: async function(phoneNumber) {
        // In a real app, you would make an API call here
        // return await this.post('/auth/send-otp', { phoneNumber });
        
        // For demo purposes, we're simulating the API call
        await Utils.simulateApiCall();
        return { success: true, message: 'OTP sent successfully' };
    },
    
    verifyOtp: async function(phoneNumber, otpCode) {
        // In a real app, you would make an API call here
        // return await this.post('/auth/verify-otp', { phoneNumber, otpCode });
        
        // For demo purposes, we're simulating the API call
        await Utils.simulateApiCall();
        return { success: true, message: 'OTP verified successfully' };
    },
    
    // Voter verification endpoints
    verifyVoterId: async function(voterId) {
        // In a real app, you would make an API call here
        // return await this.post('/verification/voter-id', { voterId });
        
        // For demo purposes, we're simulating the API call
        await Utils.simulateApiCall();
        return { success: true, message: 'Voter ID verified successfully' };
    },
    
    verifyBiometric: async function(biometricData) {
        // In a real app, you would make an API call here
        // return await this.post('/verification/biometric', biometricData);
        
        // For demo purposes, we're simulating the API call
        await Utils.simulateApiCall();
        return { success: true, message: 'Biometric verification successful' };
    },
    
    // Voting endpoints
    getCandidates: async function() {
        // In a real app, you would make an API call here
        // return await this.get('/candidates');
        
        // For demo purposes, we're simulating the API call and returning static data
        await Utils.simulateApiCall();
        return { 
            success: true, 
            data: Voting.candidates 
        };
    },
    
    castVote: async function(candidateId) {
        // In a real app, you would make an API call here
        // return await this.post('/votes', { candidateId });
        
        // For demo purposes, we're simulating the API call
        await Utils.simulateApiCall();
        return { success: true, message: 'Vote cast successfully' };
    },
    
    // HTTP method wrappers (for real implementation)
    get: async function(endpoint, params = {}) {
        try {
            const url = new URL(this.BASE_URL + endpoint);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders()
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    },
    
    post: async function(endpoint, data = {}) {
        try {
            const response = await fetch(this.BASE_URL + endpoint, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    },
    
    // Helper methods
    getHeaders: function() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add authorization header if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },
    
    handleResponse: async function(response) {
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    }
};