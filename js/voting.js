/**
 * Voting module for E-Voting System
 * Handles the voting interface functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the voting interface when needed
    window.initializeVoting = function() {
        console.log("Initializing voting interface");
        loadBallot();
        setupEventListeners();
    };
    
    // Load ballot component
    function loadBallot() {
        const ballotContainer = document.getElementById('ballot-container');
        if (!ballotContainer) {
            console.error("Ballot container not found");
            return;
        }
        
        // Show loading state
        ballotContainer.innerHTML = '<div class="candidates-loading"><div class="spinner"></div><p>Đang tải thông tin phiếu bầu...</p></div>';
        
        // Fetch ballot component
        fetch('components/voting/ballot.html')
            .then(response => response.text())
            .then(html => {
                ballotContainer.innerHTML = html;
                // After loading the ballot, setup the event handlers for it
                setupBallotEvents();
            })
            .catch(error => {
                console.error("Error loading ballot component:", error);
                ballotContainer.innerHTML = '<div class="error-message">Không thể tải phiếu bầu. Vui lòng thử lại sau.</div>';
            });
    }
    
    // Setup general event listeners
    function setupEventListeners() {
        // Update progress bar to show the voting step is active
        const votingStep = document.querySelector('.progress-steps .step:nth-child(2)');
        if (votingStep) {
            const steps = document.querySelectorAll('.progress-steps .step');
            steps.forEach((step, index) => {
                if (index < 1) {
                    step.classList.remove('active');
                    step.classList.add('completed');
                } else if (index === 1) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active', 'completed');
                }
            });
        }
    }
    
    // Setup ballot-specific event listeners once the ballot is loaded
    function setupBallotEvents() {
        // Get all candidate radio inputs
        const candidateRadios = document.querySelectorAll('input[name="candidate"]');
        const proceedButton = document.getElementById('proceed-to-review');
        const resetButton = document.getElementById('reset-selection');
        
        if (!candidateRadios.length || !proceedButton || !resetButton) {
            console.error("Candidate selection elements not found");
            return;
        }
        
        // Add event listeners to candidate selections
        candidateRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Enable the proceed button when a selection is made
                proceedButton.disabled = false;
                
                // Highlight the selected candidate card
                document.querySelectorAll('.candidate-card').forEach(card => {
                    card.classList.remove('selected');
                });
                this.closest('.candidate-card').classList.add('selected');
            });
        });
        
        // Reset selection button
        resetButton.addEventListener('click', function() {
            candidateRadios.forEach(radio => {
                radio.checked = false;
            });
            document.querySelectorAll('.candidate-card').forEach(card => {
                card.classList.remove('selected');
            });
            proceedButton.disabled = true;
        });
        
        // Proceed to review button
        proceedButton.addEventListener('click', function() {
            // Store the selected candidate
            const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
            if (!selectedCandidate) {
                alert("Vui lòng chọn một ứng viên để tiếp tục.");
                return;
            }
            
            // Get candidate information for review
            const candidateCard = selectedCandidate.closest('.candidate-card');
            const candidateName = candidateCard.querySelector('h3').textContent;
            const candidateParty = candidateCard.querySelector('.party').textContent;
            
            // Store selection in session storage or application state
            EVoting.state.selectedCandidate = {
                id: selectedCandidate.value,
                name: candidateName,
                party: candidateParty
            };
            
            console.log("Selected candidate:", EVoting.state.selectedCandidate);
            
            // Show loading while preparing next step
            EVoting.ui.showLoading("Đang chuẩn bị thông tin xem lại...");
            
            // Simulate server processing
            setTimeout(function() {
                EVoting.ui.hideLoading();
                
                // Hide voting section and show review section
                document.getElementById('voting-step').style.display = 'none';
                
                // Load and show review section
                const reviewSection = document.querySelector('.review-section');
                if (reviewSection) {
                    reviewSection.style.display = 'block';
                    // If we have a function to initialize the review section
                    if (typeof initializeReview === 'function') {
                        initializeReview();
                    }
                }
                
                // Update progress bar
                const steps = document.querySelectorAll('.progress-steps .step');
                steps.forEach((step, index) => {
                    if (index < 2) {
                        step.classList.remove('active');
                        step.classList.add('completed');
                    } else if (index === 2) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active', 'completed');
                    }
                });
            }, 1500);
        });
    }
}); 