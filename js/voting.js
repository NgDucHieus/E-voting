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
        // Get all candidate cards, radio inputs, and related elements
        const candidateCards = document.querySelectorAll('.candidate-card');
        const candidateRadios = document.querySelectorAll('input[name="candidate"]');
        const proceedButton = document.getElementById('proceed-to-review');
        const resetButton = document.getElementById('reset-selection');
        const viewDetailsLinks = document.querySelectorAll('.view-details');
        
        if (!candidateCards.length || !candidateRadios.length || !proceedButton || !resetButton) {
            console.error("Candidate selection elements not found");
            return;
        }
        
        // Add event listeners to candidate cards for selection
        candidateCards.forEach(card => {
            // Make the entire card selectable (except for "View Details" link)
            card.addEventListener('click', function(e) {
                // Don't handle click if clicked on the view details link
                if (e.target.classList.contains('view-details') || e.target.closest('.view-details')) {
                    return;
                }
                
                // Find the radio button in this card and check it
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;
                
                // Trigger change event
                radio.dispatchEvent(new Event('change'));
            });
            
            // Keyboard accessibility - allow selection with keyboard
            card.addEventListener('keydown', function(e) {
                if (e.key === ' ' || e.key === 'Enter') {
                    // Don't handle if target is the view details link
                    if (e.target.classList.contains('view-details')) {
                        return;
                    }
                    
                    // Prevent default space bar behavior (scroll)
                    e.preventDefault();
                    
                    // Find the radio button in this card and check it
                    const radio = this.querySelector('input[type="radio"]');
                    radio.checked = true;
                    
                    // Trigger change event
                    radio.dispatchEvent(new Event('change'));
                }
            });
        });
        
        // Add event listeners to candidate radio inputs
        candidateRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Enable the proceed button when a selection is made
                proceedButton.disabled = false;
                
                // Highlight the selected candidate card
                document.querySelectorAll('.candidate-card').forEach(card => {
                    if (card.contains(this)) {
                        card.classList.add('selected');
                    } else {
                        card.classList.remove('selected');
                    }
                });
            });
        });
        
        // Setup "View Details" links
        viewDetailsLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get candidate ID from data attribute
                const candidateId = this.getAttribute('data-candidate');
                if (!candidateId) return;
                
                // Find the candidate card
                const candidateCard = this.closest('.candidate-card');
                if (!candidateCard) return;
                
                // Get candidate details
                const candidateName = candidateCard.querySelector('h3').textContent;
                const candidateParty = candidateCard.querySelector('.party').textContent;
                const candidateBio = candidateCard.querySelector('.bio').textContent;
                
                // Show candidate details in modal
                showCandidateDetailsModal(candidateId, candidateName, candidateParty, candidateBio);
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
                EVoting.ui.showAlert("Vui lòng chọn một ứng viên để tiếp tục.", "warning");
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
        
        // Setup modal close buttons
        const modalCloseButtons = document.querySelectorAll('.modal .close-btn, .modal .modal-close');
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Find the closest modal and hide it
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }
    
    // Function to show candidate details in modal
    function showCandidateDetailsModal(candidateId, name, party, shortBio) {
        // Get the modal element
        const modal = document.getElementById('candidate-details-modal');
        const modalContent = document.getElementById('candidate-details-content');
        
        if (!modal || !modalContent) {
            console.error("Candidate details modal not found");
            return;
        }
        
        // Prepare detailed info
        // In a real application, you would fetch this from a server
        // This is a simulated extended bio based on the short one
        const extendedInfo = getCandidateExtendedInfo(candidateId, name, party, shortBio);
        
        // Populate modal content
        modalContent.innerHTML = `
            <div class="candidate-detail-header">
                <div class="candidate-detail-photo">
                    <img src="assets/candidates/${candidateId}.jpg" alt="${name}">
                </div>
                <div class="candidate-detail-basic">
                    <h3>${name}</h3>
                    <div class="party">${party}</div>
                </div>
            </div>
            
            <div class="candidate-detail-sections">
                <div class="detail-section">
                    <h4>Tiểu sử</h4>
                    <p>${extendedInfo.bio}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Học vấn và Kinh nghiệm</h4>
                    <ul>
                        ${extendedInfo.education.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4>Chính sách chính</h4>
                    <ul>
                        ${extendedInfo.policies.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        // Show the modal
        modal.classList.add('active');
    }
    
    // Function to get extended candidate information
    // In a real application, this would be fetched from a server
    function getCandidateExtendedInfo(candidateId, name, party, shortBio) {
        // Simulated extended information based on candidateId
        const candidateInfo = {
            candidate1: {
                bio: "Nguyễn Văn A là một chính trị gia kỳ cựu với hơn 20 năm kinh nghiệm trong lĩnh vực chính trị và quản lý nhà nước. Ông đã từng đảm nhiệm nhiều vị trí quan trọng trong bộ máy chính quyền và có nhiều đóng góp trong việc đổi mới, cải cách hành chính và phát triển kinh tế.",
                education: [
                    "Tiến sĩ Quản lý Nhà nước, Đại học Quốc gia Hà Nội (2005)",
                    "Thạc sĩ Khoa học Chính trị, Đại học Oxford, Anh (1998)",
                    "Cử nhân Luật, Đại học Luật Hà Nội (1995)"
                ],
                policies: [
                    "Đẩy mạnh cải cách hành chính, xây dựng chính phủ điện tử",
                    "Phát triển kinh tế số, tăng cường ứng dụng công nghệ trong quản lý nhà nước",
                    "Mở rộng quan hệ ngoại giao, thúc đẩy hợp tác quốc tế",
                    "Phát triển bền vững, bảo vệ môi trường và ứng phó với biến đổi khí hậu"
                ]
            },
            candidate2: {
                bio: "Trần Thị B là một chuyên gia kinh tế hàng đầu với nhiều nghiên cứu và đóng góp trong việc phát triển chính sách kinh tế quốc gia. Bà có kinh nghiệm làm việc tại nhiều tổ chức tài chính lớn và am hiểu sâu sắc về thị trường tài chính trong nước và quốc tế.",
                education: [
                    "Tiến sĩ Kinh tế, Đại học Harvard, Mỹ (2003)",
                    "Thạc sĩ Quản trị Kinh doanh, Đại học Stanford, Mỹ (1999)",
                    "Cử nhân Kinh tế Đối ngoại, Đại học Ngoại thương (1996)"
                ],
                policies: [
                    "Cải cách hệ thống tài chính, ngân hàng",
                    "Thúc đẩy khởi nghiệp và đổi mới sáng tạo",
                    "Phát triển kinh tế tư nhân, tạo môi trường cạnh tranh bình đẳng",
                    "Tăng cường hội nhập kinh tế quốc tế, mở rộng thị trường xuất khẩu"
                ]
            },
            candidate3: {
                bio: "Lê Văn C là một nhà lãnh đạo trẻ với tầm nhìn hiện đại về phát triển đất nước và hội nhập quốc tế. Ông đã có nhiều đóng góp trong lĩnh vực công nghệ và đổi mới sáng tạo, đồng thời là người tiên phong trong việc ứng dụng công nghệ vào quản lý và phát triển kinh tế - xã hội.",
                education: [
                    "Tiến sĩ Khoa học Máy tính, Đại học MIT, Mỹ (2010)",
                    "Thạc sĩ Quản lý Công, Đại học Singapore (2006)",
                    "Cử nhân Kỹ thuật Điện tử - Viễn thông, Đại học Bách Khoa Hà Nội (2003)"
                ],
                policies: [
                    "Xây dựng chính phủ số, nền kinh tế số và xã hội số",
                    "Phát triển hạ tầng công nghệ thông tin và viễn thông hiện đại",
                    "Đầu tư vào giáo dục và đào tạo nguồn nhân lực chất lượng cao",
                    "Thúc đẩy đổi mới sáng tạo và chuyển đổi số trong mọi lĩnh vực"
                ]
            },
            candidate4: {
                bio: "Phạm Thị D là một chuyên gia về luật quốc tế và ngoại giao với nhiều năm kinh nghiệm làm việc tại các tổ chức quốc tế lớn. Bà đã có nhiều đóng góp trong việc xây dựng và thực thi các hiệp định thương mại quốc tế, bảo vệ chủ quyền quốc gia và thúc đẩy hợp tác đa phương.",
                education: [
                    "Tiến sĩ Luật Quốc tế, Đại học Columbia, Mỹ (2008)",
                    "Thạc sĩ Quan hệ Quốc tế, Đại học London, Anh (2004)",
                    "Cử nhân Luật Quốc tế, Đại học Luật Hà Nội (2001)"
                ],
                policies: [
                    "Tăng cường quan hệ ngoại giao đa phương, bảo vệ chủ quyền quốc gia",
                    "Thúc đẩy hòa bình, ổn định và hợp tác trong khu vực và quốc tế",
                    "Đàm phán và thực thi hiệu quả các hiệp định thương mại quốc tế",
                    "Bảo vệ quyền lợi của công dân Việt Nam ở nước ngoài"
                ]
            }
        };
        
        // Return the candidate info or a default if not found
        return candidateInfo[candidateId] || {
            bio: shortBio || "Không có thông tin chi tiết.",
            education: ["Không có thông tin về học vấn."],
            policies: ["Không có thông tin về chính sách."]
        };
    }
}); 