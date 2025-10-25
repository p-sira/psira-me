// Popup card functionality (for home page)
const arcButtons = document.querySelectorAll('.arc-button');
const popupCards = document.querySelectorAll('.popup-card');
const backdrop = document.getElementById('popup-backdrop');

function closeAllPopups() {
    popupCards.forEach(card => {
        card.classList.remove('opacity-100', 'visible', 'scale-100');
        card.classList.add('opacity-0', 'invisible', 'scale-75');
    });
    if (backdrop) {
        backdrop.classList.remove('opacity-100', 'visible');
        backdrop.classList.add('opacity-0', 'invisible');
    }
}

arcButtons.forEach(button => {
    button.addEventListener('click', () => {
        const cardId = button.getAttribute('data-card');
        const targetCard = document.getElementById(cardId + '-card');

        // Close all other popup cards
        closeAllPopups();

        // Show backdrop and target card
        if (backdrop) {
            backdrop.classList.remove('opacity-0', 'invisible');
            backdrop.classList.add('opacity-100', 'visible');
        }
        if (targetCard) {
            targetCard.classList.remove('opacity-0', 'invisible', 'scale-75');
            targetCard.classList.add('opacity-100', 'visible', 'scale-100');
        }
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

// Tab functionality for projects popup
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
