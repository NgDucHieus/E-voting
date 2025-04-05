/**
 * Voting module for E-Voting System
 * Handles the voting interface functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Lưu trữ state
    const state = {
        selectedCandidateId: null,
        initialized: false
    };
    
    // Cache DOM elements và selectors thường xuyên sử dụng
    const selectors = {
        ballotContainer: '#ballot-container',
        candidateCard: '.candidate-card',
        candidateRadio: 'input[name="candidate"]',
        viewDetails: '.view-details',
        proceedButton: '#proceed-to-review',
        resetButton: '#reset-selection',
        modal: '#candidate-details-modal',
        modalContent: '#candidate-details-content',
        closeModal: '.modal .close-btn, .modal .modal-close',
        progressSteps: '.progress-steps .step'
    };
    
    // Initialize the voting interface when needed
    window.initializeVoting = function() {
        if (state.initialized) return;
        
        console.log("Initializing voting interface");
        loadBallot();
        updateProgressBar(1); // Voting is step 2 (index 1)
        
        state.initialized = true;
    };
    
    // Load ballot component with improved error handling
    function loadBallot() {
        const ballotContainer = document.querySelector(selectors.ballotContainer);
        if (!ballotContainer) {
            console.error("Ballot container not found");
            return;
        }
        
        // Show loading state
        ballotContainer.innerHTML = '<div class="candidates-loading"><div class="spinner"></div><p>Đang tải thông tin phiếu bầu...</p></div>';
        
        // Fetch ballot component
        fetch('components/voting/ballot.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                ballotContainer.innerHTML = html;
                setupBallotEvents();
            })
            .catch(error => {
                console.error("Error loading ballot component:", error);
                ballotContainer.innerHTML = '<div class="error-message">Không thể tải phiếu bầu. Vui lòng thử lại sau.</div>';
            });
    }
    
    // Cập nhật thanh tiến trình
    function updateProgressBar(activeIndex) {
        const steps = document.querySelectorAll(selectors.progressSteps);
        if (!steps.length) return;
        
        steps.forEach((step, index) => {
            if (index < activeIndex) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else if (index === activeIndex) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }
    
    // Set up event listeners using event delegation where possible
    function setupBallotEvents() {
        const candidatesContainer = document.getElementById('candidates-container');
        const proceedButton = document.querySelector(selectors.proceedButton);
        const resetButton = document.querySelector(selectors.resetButton);
        
        if (!candidatesContainer || !proceedButton || !resetButton) {
            console.error("Required ballot elements not found");
            return;
        }
        
        // Event delegation cho các thẻ ứng viên
        candidatesContainer.addEventListener('click', handleCandidateInteraction);
        
        // Xử lý sự kiện bàn phím cho trợ năng
        candidatesContainer.addEventListener('keydown', handleKeyboardNavigation);
        
        // Reset selection button
        resetButton.addEventListener('click', resetSelection);
        
        // Proceed to review button
        proceedButton.addEventListener('click', proceedToReview);
        
        // Xử lý sự kiện đóng modal - event delegation
        document.addEventListener('click', handleModalCloseClick);
        
        // Xử lý phím ESC để đóng modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
    }
    
    // Xử lý sự kiện click vào thẻ ứng viên
    function handleCandidateInteraction(e) {
        const candidateCard = e.target.closest(selectors.candidateCard);
        
        // Nếu click vào "Xem chi tiết"
        if (e.target.classList.contains('view-details') || e.target.closest('.view-details')) {
            e.preventDefault();
            handleViewDetails(e);
            return;
        }
        
        // Nếu click vào thẻ ứng viên
        if (candidateCard) {
            const radio = candidateCard.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                handleCandidateSelection(radio);
            }
        }
    }
    
    // Xử lý khi "Xem chi tiết" được nhấp vào
    function handleViewDetails(e) {
        const link = e.target.closest('.view-details');
        if (!link) return;
        
        const candidateId = link.getAttribute('data-candidate');
        if (!candidateId) return;
        
        const candidateCard = link.closest('.candidate-card');
        if (!candidateCard) return;
        
        const candidateName = candidateCard.querySelector('h3').textContent;
        const candidateParty = candidateCard.querySelector('.party').textContent;
        const candidateBio = candidateCard.querySelector('.bio').textContent;
        
        showCandidateDetailsModal(candidateId, candidateName, candidateParty, candidateBio);
    }
    
    // Xử lý phím bấm cho trợ năng
    function handleKeyboardNavigation(e) {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        
        const candidateCard = e.target.closest(selectors.candidateCard);
        if (!candidateCard) return;
        
        // Đừng xử lý nếu đang focus vào link xem chi tiết
        if (e.target.classList.contains('view-details')) return;
        
        e.preventDefault(); // Ngăn scroll khi nhấn space
        
        const radio = candidateCard.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
            handleCandidateSelection(radio);
        }
    }
    
    // Xử lý việc chọn ứng viên
    function handleCandidateSelection(selectedRadio) {
        // Cập nhật state
        state.selectedCandidateId = selectedRadio.value;
        
        // Enable the proceed button
        const proceedButton = document.querySelector(selectors.proceedButton);
        if (proceedButton) {
            proceedButton.disabled = false;
        }
        
        // Highlight card đã chọn
        document.querySelectorAll(selectors.candidateCard).forEach(card => {
            if (card.contains(selectedRadio)) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }
    
    // Đóng tất cả modal đang mở
    function closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Xử lý sự kiện đóng modal
    function handleModalCloseClick(e) {
        const closeButton = e.target.closest(selectors.closeModal);
        if (closeButton) {
            const modal = closeButton.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        }
    }
    
    // Reset lựa chọn
    function resetSelection() {
        // Bỏ chọn tất cả radio button
        document.querySelectorAll(selectors.candidateRadio).forEach(radio => {
            radio.checked = false;
        });
        
        // Bỏ highlight tất cả card
        document.querySelectorAll(selectors.candidateCard).forEach(card => {
            card.classList.remove('selected');
        });
        
        // Disable nút tiếp tục
        const proceedButton = document.querySelector(selectors.proceedButton);
        if (proceedButton) {
            proceedButton.disabled = true;
        }
        
        // Reset state
        state.selectedCandidateId = null;
    }
    
    // Chuyển sang bước xem lại
    function proceedToReview() {
        // Kiểm tra xem đã chọn ứng cử viên chưa
        const selectedCandidate = document.querySelector(`${selectors.candidateRadio}:checked`);
        if (!selectedCandidate) {
            EVoting.ui.showAlert("Vui lòng chọn một ứng viên để tiếp tục.", "warning");
            return;
        }
        
        // Lấy thông tin ứng viên đã chọn
        const candidateCard = selectedCandidate.closest(selectors.candidateCard);
        const candidateData = {
            id: selectedCandidate.value,
            name: candidateCard.querySelector('h3').textContent,
            party: candidateCard.querySelector('.party').textContent
        };
        
        // Lưu vào state
        EVoting.state.selectedCandidate = candidateData;
        console.log("Selected candidate:", EVoting.state.selectedCandidate);
        
        // Hiện loading
        EVoting.ui.showLoading("Đang chuẩn bị thông tin xem lại...");
        
        // Chuyển sang bước xem lại sau khi loading
        setTimeout(() => {
            EVoting.ui.hideLoading();
            
            // Ẩn bước bỏ phiếu, hiện bước xem lại
            document.getElementById('voting-step').style.display = 'none';
            
            const reviewSection = document.querySelector('.review-section');
            if (reviewSection) {
                reviewSection.style.display = 'block';
                
                // Khởi tạo phần xem lại nếu có
                if (typeof initializeReview === 'function') {
                    initializeReview();
                }
            }
            
            // Cập nhật thanh tiến trình
            updateProgressBar(2); // Review là bước 3 (index 2)
        }, 1500);
    }
    
    // Hiển thị thông tin chi tiết ứng viên trong modal
    function showCandidateDetailsModal(candidateId, name, party, shortBio) {
        const modal = document.querySelector(selectors.modal);
        const modalContent = document.querySelector(selectors.modalContent);
        
        if (!modal || !modalContent) {
            console.error("Candidate details modal not found");
            return;
        }
        
        // Lấy thông tin chi tiết từ repository
        const extendedInfo = getCandidateInfo(candidateId, name, party, shortBio);
        
        // Tạo HTML content với destructuring để code sạch hơn
        const { bio, education, policies } = extendedInfo;
        
        // Render với template literals
        modalContent.innerHTML = createCandidateDetailHTML(candidateId, name, party, bio, education, policies);
        
        // Hiện modal và focus vào nó (cho trợ năng)
        modal.classList.add('active');
        modal.focus();
    }
    
    // Tạo HTML cho thông tin chi tiết ứng viên
    function createCandidateDetailHTML(candidateId, name, party, bio, education, policies) {
        return `
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
                    <p>${bio}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Học vấn và Kinh nghiệm</h4>
                    <ul>
                        ${education.map(item => `<li>${formatEducationItem(item)}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4>Chính sách chính</h4>
                    <ul class="ordered">
                        ${policies.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Định dạng mục học vấn
    function formatEducationItem(item) {
        if (!item.includes(',')) return item;
        
        const [degree, ...rest] = item.split(',');
        const restText = rest.join(',');
        
        // Regex để tìm năm (định dạng YYYY trong ngoặc đơn)
        const yearMatch = restText.match(/\((\d{4})\)/);
        if (yearMatch) {
            const year = yearMatch[0];
            const school = restText.replace(year, `<span class="highlight">${year}</span>`);
            return `<span class="highlight">${degree}</span>,${school}`;
        }
        
        return `<span class="highlight">${degree}</span>,${restText}`;
    }
    
    // Repository dữ liệu ứng viên
    function getCandidateInfo(candidateId, name, party, shortBio) {
        // Dữ liệu mẫu - thực tế nên lấy từ server
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
        
        // Default data nếu không tìm thấy
        const defaultData = {
            bio: shortBio || "Không có thông tin chi tiết.",
            education: ["Không có thông tin về học vấn."],
            policies: ["Không có thông tin về chính sách."]
        };
        
        return candidateRepository[candidateId] || defaultData;
    }
}); 