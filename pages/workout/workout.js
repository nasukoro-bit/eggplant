document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Remove active class from all buttons and sections
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked button and target section
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Level tabs functionality
    const levelTabs = document.querySelectorAll('.level-tab');
    const levelSections = document.querySelectorAll('.level-section');

    levelTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            
            // Remove active class from all tabs and sections
            levelTabs.forEach(t => t.classList.remove('active'));
            levelSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and target section
            this.classList.add('active');
            document.getElementById(level).classList.add('active');
        });
    });

    // Exercise filter functionality
    const exerciseFilters = document.querySelectorAll('.exercise-filter');
    const exerciseCards = document.querySelectorAll('.exercise-card');

    exerciseFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all filters
            exerciseFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide exercise cards based on category
            exerciseCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Start button functionality
    const startBtns = document.querySelectorAll('.start-btn');
    startBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.workout-card');
            const title = card.querySelector('h3').textContent;
            
            // Add loading state
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate loading and show success message
            setTimeout(() => {
                this.textContent = '開始済み ✓';
                this.style.background = '#28a745';
                
                // Show success notification
                showNotification(`${title}のトレーニングを開始しました！`, 'success');
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    this.textContent = 'トレーニング開始';
                    this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    this.disabled = false;
                }, 3000);
            }, 1500);
        });
    });

    // Program button functionality
    const programBtns = document.querySelectorAll('.program-btn');
    programBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.program-card');
            const title = card.querySelector('h4').textContent;
            
            // Add loading state
            this.textContent = 'プログラム準備中...';
            this.disabled = true;
            
            // Simulate loading and show success message
            setTimeout(() => {
                this.textContent = 'プログラム開始 ✓';
                showNotification(`${title}を開始しました！週間スケジュールをメールで送信いたします。`, 'success');
                
                // Reset button after 4 seconds
                setTimeout(() => {
                    this.textContent = 'プログラム開始';
                    this.disabled = false;
                }, 4000);
            }, 2000);
        });
    });

    // Type button functionality
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.type-card');
            const title = card.querySelector('h3').textContent;
            showNotification(`${title}の詳細プログラムページに移動します`, 'info');
        });
    });

    // Video controls functionality
    const playBtns = document.querySelectorAll('.play-btn');
    const infoBtns = document.querySelectorAll('.info-btn');
    
    playBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseCard = this.closest('.exercise-card');
            const exerciseName = exerciseCard.querySelector('h4').textContent;
            
            // Simulate video playing
            this.textContent = '⏸️ 停止';
            this.classList.add('playing');
            
            showNotification(`${exerciseName}の動画を再生中`, 'info');
            
            // Reset after 3 seconds (simulate short demo)
            setTimeout(() => {
                this.textContent = '▶️ 再生';
                this.classList.remove('playing');
            }, 3000);
        });
    });
    
    infoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseCard = this.closest('.exercise-card');
            const exerciseName = exerciseCard.querySelector('h4').textContent;
            showNotification(`${exerciseName}の詳細情報を表示します`, 'info');
        });
    });

    // Smooth scrolling for internal links
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const quickNavHeight = document.querySelector('.quick-nav').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight - quickNavHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Card hover effects enhancement
    const cards = document.querySelectorAll('.workout-card, .type-card, .program-card, .exercise-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Search functionality (if needed later)
    function initSearch() {
        const searchInput = document.getElementById('exercise-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const cards = document.querySelectorAll('.exercise-card');
                
                cards.forEach(card => {
                    const title = card.querySelector('h4').textContent.toLowerCase();
                    const description = card.querySelector('.exercise-description').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }

    // Initialize search if search input exists
    initSearch();
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .playing {
        background: #dc3545 !important;
    }
`;
document.head.appendChild(notificationStyles);