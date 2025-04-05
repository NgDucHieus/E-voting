// Voting Interface and Logic

const Voting = {
    // State
    currentStep: 1,
    selectedCandidates: new Set(),
    
    // Sample candidate data (replace with actual data from backend)
    candidates: [
        {
            id: 1,
            name: 'John Doe',
            party: 'Independent',
            photo: 'assets/candidate1.jpg',
            bio: 'Experienced leader with a vision for change.'
        },
        {
            id: 2,
            name: 'Jane Smith',
            party: 'Progressive Party',
            photo: 'assets/candidate2.jpg',
            bio: 'Dedicated to student welfare and academic excellence.'
        }
        // Add more candidates as needed
    ],
    
    // Initialize voting interface
    initializeVoting: function() {
        // Get DOM elements
        const nextBtn = document.getElementById('nextBtn');
        const editBtn = document.getElementById('editBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        // Add event listeners
        if (nextBtn) nextBtn.addEventListener('click', this.handleNext);
        if (editBtn) editBtn.addEventListener('click', this.handleEdit);
        if (submitBtn) submitBtn.addEventListener('click', this.handleSubmit);
    },
    
    // Navigation Functions
    handleNext: function() {
        if (Voting.currentStep < 4) {
            Voting.currentStep++;
            UI.updateProgressSteps();
            UI.updateSectionVisibility();
        }
    },
    
    handleEdit: function() {
        Voting.currentStep = 2;
        UI.updateProgressSteps();
        UI.updateSectionVisibility();
    },
    
    // Voting Interface
    initializeVotingInterface: function() {
        const candidatesList = document.querySelector('.candidates-list');
        if (!candidatesList) return;
        
        candidatesList.innerHTML = '';
        Voting.candidates.forEach(candidate => {
            const candidateCard = Voting.createCandidateCard(candidate);
            candidatesList.appendChild(candidateCard);
        });
    },
    
    createCandidateCard: function(candidate) {
        const card = document.createElement('div');
        card.className = 'candidate-card';
        card.innerHTML = `
            <div class="candidate-photo">
                <img src="${candidate.photo}" alt="${candidate.name}">
            </div>
            <div class="candidate-info">
                <h3>${candidate.name}</h3>
                <p class="party">${candidate.party}</p>
                <p class="bio">${candidate.bio}</p>
            </div>
            <div class="candidate-selection">
                <input type="radio" 
                       name="candidate" 
                       id="candidate${candidate.id}" 
                       value="${candidate.id}"
                       ${Voting.selectedCandidates.has(candidate.id) ? 'checked' : ''}>
                <label for="candidate${candidate.id}">Select</label>
            </div>
        `;
    
        const radio = card.querySelector('input[type="radio"]');
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                Voting.selectedCandidates.clear();
                Voting.selectedCandidates.add(candidate.id);
            }
        });
    
        return card;
    },
    
    // Review Functions
    updateReviewSummary: function() {
        const reviewSummary = document.querySelector('.review-summary');
        if (!reviewSummary) return;
        
        const selectedCandidate = Voting.candidates.find(c => Voting.selectedCandidates.has(c.id));
    
        if (selectedCandidate) {
            reviewSummary.innerHTML = `
                <div class="review-item">
                    <h3>Selected Candidate</h3>
                    <p>${selectedCandidate.name} (${selectedCandidate.party})</p>
                </div>
            `;
        } else {
            reviewSummary.innerHTML = `
                <div class="review-item">
                    <h3>No Candidate Selected</h3>
                    <p>Please go back and select a candidate.</p>
                </div>
            `;
        }
    },
    
    // Submission Functions
    handleSubmit: async function() {
        if (Voting.selectedCandidates.size === 0) {
            Utils.showAlert('Please select a candidate before submitting.', 'warning');
            return;
        }
    
        Utils.showLoading();
    
        try {
            // Replace with actual API call
            await Utils.simulateApiCall();
            
            Voting.currentStep = 4;
            UI.updateProgressSteps();
            Utils.showAlert('Your vote has been successfully recorded!', 'success');
            
            // Reset the form after successful submission
            setTimeout(() => {
                Auth.handleLogout();
            }, 3000);
        } catch (error) {
            Utils.showAlert('Failed to submit vote. Please try again.', 'error');
        } finally {
            Utils.hideLoading();
        }
    }
}; 