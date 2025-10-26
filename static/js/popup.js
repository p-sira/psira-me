// Popup card functionality (for home page)
const arcButtons = document.querySelectorAll('.arc-button');
const popupCards = document.querySelectorAll('.popup-card');
const backdrop = document.getElementById('popup-backdrop');

function closeAllPopups() {
    popupCards.forEach(card => {
        card.classList.remove('visible');
    });
    if (backdrop) {
        backdrop.classList.remove('opacity-35', 'visible');
        backdrop.classList.add('opacity-0', 'invisible');
    }
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'auto';
}

function openPopup(cardId) {
    const targetCard = document.getElementById(cardId + '-card');
    
    // Close all other popup cards first
    closeAllPopups();
    
    // Show backdrop and target card
    if (backdrop) {
        backdrop.classList.remove('opacity-0', 'invisible');
        backdrop.classList.add('opacity-35', 'visible');
    }
    if (targetCard) {
        targetCard.classList.add('visible');
        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';
    }
}

arcButtons.forEach(button => {
    button.addEventListener('click', () => {
        const cardId = button.getAttribute('data-card');
        openPopup(cardId);
    });
});

// Close popup cards when clicking close button
popupCards.forEach(card => {
    const closeBtn = card.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeAllPopups();
        });
    }
});

// Close popup cards when clicking backdrop
if (backdrop) {
    backdrop.addEventListener('click', () => {
        closeAllPopups();
    });
}

// Tab functionality for research popup
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');

        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        const targetPanel = document.getElementById(tabId + '-tab');
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// Keyboard support for closing popups
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeAllPopups();
    }
});

// Prevent popup from closing when clicking inside the popup content
popupCards.forEach(card => {
    card.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});
