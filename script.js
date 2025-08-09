document.addEventListener('DOMContentLoaded', function() {
    initTerminalAnimation();
    initScrollAnimations();
    initSubjectCardInteractions();

    initSearchFunctionality();
    initTimeHighlighting();
    initKeyboardShortcuts();
    
    console.log('%c🚀 BSIT-5 Schedule System Initialized', 'color: #238636; font-size: 16px; font-weight: bold;');
});

function initTerminalAnimation() {
    const commands = [
        'cat schedule.json',
        'grep -r "BSIT-5" .',
        'ls -la classes/',
        'systemctl status schedule',
        'cat schedule.json'
    ];
    
    let currentCommand = 0;
    const commandElement = document.querySelector('.command');
    
    if (!commandElement) return;
    
    function typeCommand() {
        const command = commands[currentCommand];
        let currentChar = 0;
        commandElement.textContent = '';
        
        function typeChar() {
            if (currentChar < command.length) {
                commandElement.textContent += command[currentChar];
                currentChar++;
                setTimeout(typeChar, 100);
            } else {
                setTimeout(() => {
                    currentCommand = (currentCommand + 1) % commands.length;
                    setTimeout(typeCommand, 2000);
                }, 3000);
            }
        }
        
        typeChar();
    }
    
    setTimeout(typeCommand, 1000);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    

    const animatedElements = document.querySelectorAll('.day-column, .stat-card, .subject-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function initSubjectCardInteractions() {
    const subjectCards = document.querySelectorAll('.subject-card');
    
    subjectCards.forEach(card => {

        card.addEventListener('click', function() {
            showSubjectDetails(this);
        });
        

        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(4px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
}

function showSubjectDetails(card) {
    const subjectCode = card.querySelector('.subject-code').textContent;
    const subjectName = card.querySelector('.subject-name').textContent;
    const room = card.querySelector('.room') ? card.querySelector('.room').textContent.replace('Room ', '') : 'TBD';
    

    const existingModal = document.querySelector('.subject-modal');
    if (existingModal) {
        existingModal.remove();
    }
    

    const modal = document.createElement('div');
    modal.className = 'subject-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-book"></i> ${subjectCode}</h3>
                <button class="close-modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <h4>${subjectName}</h4>
                <div class="subject-details">
                    <div class="detail-item">
                        <span class="label">Room:</span>
                        <span class="value"><i class="fas fa-map-marker-alt"></i> ${room}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Section:</span>
                        <span class="value">BSIT-5</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Academic Year:</span>
                        <span class="value">2025-2026</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Type:</span>
                        <span class="value">Lecture</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Status:</span>
                        <span class="value status-active"><i class="fas fa-circle"></i> Active</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    

    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}



function initSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search subjects...';
    searchInput.className = 'search-input';
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <i class="fas fa-search"></i>
        ${searchInput.outerHTML}
    `;
    
    const scheduleSection = document.querySelector('.schedule-section');
    const sectionHeader = scheduleSection.querySelector('.section-header');
    sectionHeader.appendChild(searchContainer);
    

    const actualSearchInput = searchContainer.querySelector('input');
    actualSearchInput.addEventListener('input', handleSearch);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const subjectCards = document.querySelectorAll('.subject-card');
    
    subjectCards.forEach(card => {
        const subjectCode = card.querySelector('.subject-code').textContent.toLowerCase();
        const subjectName = card.querySelector('.subject-name').textContent.toLowerCase();
        
        const matches = subjectCode.includes(searchTerm) || subjectName.includes(searchTerm);
        
        card.style.opacity = matches || searchTerm === '' ? '1' : '0.3';
        card.style.transform = matches || searchTerm === '' ? 'scale(1)' : 'scale(0.95)';
    });
}

function initTimeHighlighting() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    

    const dayMapping = {
        1: 'Monday',
        2: 'Tuesday', 
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday'
    };
    
    const currentDayName = dayMapping[currentDay];
    if (!currentDayName) return;
    

    const dayColumns = document.querySelectorAll('.day-column');
    dayColumns.forEach(column => {
        const dayHeader = column.querySelector('.day-header h3');
        if (dayHeader.textContent === currentDayName) {
            column.classList.add('current-day');
            

            const timeSlots = column.querySelectorAll('.time-slot');
            timeSlots.forEach(slot => {
                const timeText = slot.querySelector('.time').textContent;
                if (isCurrentTimeSlot(timeText, currentHour)) {
                    slot.classList.add('current-time');
                }
            });
        }
    });
}

function isCurrentTimeSlot(timeText, currentHour) {
    const timeRange = timeText.match(/(\d+):(\d+)(AM|PM)\s*-\s*(\d+):(\d+)(AM|PM)/);
    if (!timeRange) return false;
    
    const startHour = parseInt(timeRange[1]) + (timeRange[3] === 'PM' && timeRange[1] !== '12' ? 12 : 0);
    const endHour = parseInt(timeRange[4]) + (timeRange[6] === 'PM' && timeRange[4] !== '12' ? 12 : 0);
    
    return currentHour >= startHour && currentHour < endHour;
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {

        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        

        if (e.key === 'Escape') {
            const modal = document.querySelector('.subject-modal');
            if (modal) {
                modal.remove();
            }
        }
    });
}

function playHoverSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {

    }
}


function animateCounter(element, target, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (target - start) * easeOutQuart(progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}


document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = target.textContent;
                
                if (!isNaN(value)) {
                    animateCounter(target, parseInt(value));
                }
                
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(el => observer.observe(el));
});


const additionalCSS = `
    .subject-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(13, 17, 23, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    }
    
    .subject-modal.show {
        opacity: 1;
    }
    
    .modal-content {
        background: var(--secondary-bg);
        border-radius: 12px;
        border: 1px solid var(--border-primary);
        max-width: 500px;
        width: 90%;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .subject-modal.show .modal-content {
        transform: scale(1);
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid var(--border-primary);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .modal-header h3 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--green-secondary);
    }
    
    .close-modal {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 18px;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: var(--transition-fast);
    }
    
    .close-modal:hover {
        background: var(--tertiary-bg);
        color: var(--text-primary);
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .modal-body h4 {
        margin: 0 0 16px 0;
        color: var(--text-primary);
    }
    
    .subject-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
    }
    
    .label {
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    .value {
        color: var(--text-primary);
        font-family: var(--font-mono);
    }
    
    .status-active {
        color: var(--green-secondary);
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .search-container {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--tertiary-bg);
        border: 1px solid var(--border-secondary);
        border-radius: 6px;
        padding: 8px 12px;
    }
    
    .search-container i {
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .search-input {
        background: none;
        border: none;
        color: var(--text-primary);
        font-family: var(--font-mono);
        font-size: 14px;
        outline: none;
        width: 200px;
    }
    
    .search-input::placeholder {
        color: var(--text-muted);
    }
    
    .current-day {
        border: 2px solid var(--green-secondary);
        box-shadow: 0 0 20px rgba(35, 134, 54, 0.3);
    }
    
    .current-time {
        animation: pulse-current 2s infinite;
    }
    
    @keyframes pulse-current {
        0%, 100% { 
            background: var(--tertiary-bg);
        }
        50% { 
            background: rgba(35, 134, 54, 0.1);
        }
    }
    
    .theme-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--green-secondary);
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: var(--transition-normal);
        z-index: 100;
    }
    
    .theme-toggle:hover {
        transform: scale(1.1);
        background: var(--green-primary);
    }
`;


const styleElement = document.createElement('style');
styleElement.textContent = additionalCSS;
document.head.appendChild(styleElement);
