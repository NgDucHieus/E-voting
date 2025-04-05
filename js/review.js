/**
 * Review module for E-Voting System
 * Handles the review functionality where voters can confirm their selections
 */

// Initialize review page functionality
window.initializeReview = function() {
    console.log("Initializing review interface");
    
    // Display selected candidate data
    displaySelections();
    
    // Set up event listeners
    setupReviewEvents();
};

// Display the selections made by the voter
function displaySelections() {
    const summaryContainer = document.getElementById('selection-summary');
    const noSelectionsMessage = document.querySelector('.no-selections-message');
    
    if (!summaryContainer) {
        console.error("Selection summary container not found");
        return;
    }
    
    // Check if global state exists and contains selections
    if (!window.EVoting || !window.EVoting.state || !window.EVoting.state.selectedCandidate) {
        console.error("No selection data found");
        if (noSelectionsMessage) {
            noSelectionsMessage.style.display = 'block';
        }
        return;
    }
    
    const candidate = window.EVoting.state.selectedCandidate;
    
    // Hide the "no selections" message if it exists
    if (noSelectionsMessage) {
        noSelectionsMessage.style.display = 'none';
    }
    
    // Get extended candidate info
    const extendedInfo = getCandidateInfo(candidate.id);
    
    // Create selection summary HTML with extended info
    const selectionHTML = `
        <div class="selection-item">
            <div class="selection-title">Ứng cử viên đã chọn:</div>
            <div class="selection-details">
                <div class="candidate-info-extended">
                    <div class="candidate-header">
                        <div class="candidate-photo">
                            <img src="assets/candidates/${candidate.id}.jpg" alt="${candidate.name}" onerror="this.src='assets/placeholder-avatar.png';">
                        </div>
                        <div class="candidate-basic">
                            <div class="candidate-name">${candidate.name}</div>
                            <div class="candidate-party">${candidate.party}</div>
                        </div>
                    </div>
                    
                    <div class="candidate-details">
                        <div class="candidate-bio">
                            <h4>Tiểu sử</h4>
                            <p>${extendedInfo.bio}</p>
                        </div>
                        
                        <div class="candidate-education">
                            <h4>Học vấn</h4>
                            <ul>
                                ${extendedInfo.education.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="candidate-policies">
                            <h4>Chính sách chính</h4>
                            <ul>
                                ${extendedInfo.policies.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Populate the summary container
    summaryContainer.innerHTML = selectionHTML;
}

// Get detailed candidate info from repository
function getCandidateInfo(candidateId) {
    // Repository dữ liệu ứng viên (copied from voting.js)
    const candidateRepository = {
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
    
    // Default data if candidate not found
    const defaultData = {
        bio: "Không có thông tin chi tiết.",
        education: ["Không có thông tin về học vấn."],
        policies: ["Không có thông tin về chính sách."]
    };
    
    return candidateRepository[candidateId] || defaultData;
}

// Set up event listeners for review page
function setupReviewEvents() {
    // Back button to return to voting
    const backButton = document.getElementById('backToVoteBtn');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Hide review section and show voting section
            document.querySelector('.review-section').style.display = 'none';
            document.getElementById('voting-step').style.display = 'block';
            
            // Update progress indicator
            if (typeof updateProgressBar === 'function') {
                updateProgressBar(1); // Go back to step 2 (index 1)
            }
        });
    }
    
    // Submit button to trigger confirmation modal
    const submitButton = document.getElementById('confirmSubmitBtn');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            // Show confirmation modal
            showConfirmationModal();
        });
    }
    
    // Final submit button in the confirmation modal
    const finalSubmitButton = document.getElementById('finalSubmitBtn');
    if (finalSubmitButton) {
        finalSubmitButton.addEventListener('click', function() {
            // Process the final submission
            submitVote();
        });
    }
    
    // Close modal when clicking on "Cancel" or "X"
    const modalCloseButtons = document.querySelectorAll('#confirmationModal .close, #confirmationModal .btn-secondary');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            hideConfirmationModal();
        });
    });
}

// Show the confirmation modal
function showConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }
}

// Hide the confirmation modal
function hideConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }
}

// Process the final vote submission
function submitVote() {
    // Hide confirmation modal
    hideConfirmationModal();
    
    // Show loading indicator
    if (window.EVoting && window.EVoting.ui && typeof window.EVoting.ui.showLoading === 'function') {
        window.EVoting.ui.showLoading("Đang gửi phiếu bầu...");
    }
    
    // Simulate API call to submit vote
    setTimeout(function() {
        // Hide loading indicator
        if (window.EVoting && window.EVoting.ui && typeof window.EVoting.ui.hideLoading === 'function') {
            window.EVoting.ui.hideLoading();
        }
        
        // Hide review section
        document.querySelector('.review-section').style.display = 'none';
        
        // Show completion page (step 4)
        showCompletionPage();
        
        // Update progress indicator to step 4
        if (typeof updateProgressBar === 'function') {
            updateProgressBar(3); // Complete is step 4 (index 3)
        }
    }, 2000);
}

// Show the completion page after successful vote submission
function showCompletionPage() {
    // Check if completion page exists, otherwise create it
    let completionSection = document.querySelector('.completion-section');
    
    if (!completionSection) {
        completionSection = document.createElement('section');
        completionSection.className = 'completion-section';
        
        const completionHTML = `
            <div class="completion-content">
                <div class="section-header">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Bỏ phiếu thành công!</h2>
                    <p class="section-description">
                        Phiếu bầu của bạn đã được gửi đi và mã hóa an toàn.
                        Cảm ơn bạn đã tham gia bỏ phiếu.
                    </p>
                </div>
                
                <div class="receipt-info card">
                    <div class="card-header">
                        <h3>Thông tin biên nhận</h3>
                    </div>
                    <div class="card-body">
                        <p>Mã biên nhận: <strong>${generateReceiptCode()}</strong></p>
                        <p>Thời gian: <strong>${formatDate(new Date())}</strong></p>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button class="btn btn-primary" id="finishBtn">
                        Hoàn tất
                    </button>
                </div>
            </div>
        `;
        
        completionSection.innerHTML = completionHTML;
        document.querySelector('main').appendChild(completionSection);
        
        // Add event listener to the finish button
        const finishButton = document.getElementById('finishBtn');
        if (finishButton) {
            finishButton.addEventListener('click', function() {
                // Redirect to home page or reset the voting app
                window.location.href = 'index.html';
            });
        }
    }
    
    // Show the completion section
    completionSection.style.display = 'block';
}

// Helper function to generate random receipt code
function generateReceiptCode() {
    return 'BN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Helper function to format date
function formatDate(date) {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
} 