// Popup card functionality
const popupButtons = document.querySelectorAll('.popup-button') as NodeListOf<HTMLElement>;
const popupCards = document.querySelectorAll('.popup-card') as NodeListOf<HTMLElement>;
const backdrop = document.getElementById('popup-backdrop') as HTMLElement | null;

// Close all popup cards and hide backdrop
function closeAllPopups() {
    popupCards.forEach(card => {
        card.classList.remove('visible');
        card.setAttribute('aria-hidden', 'true');
    });
    if (backdrop) {
        backdrop.classList.remove('opacity-65', 'dark:opacity-50', 'visible');
        backdrop.classList.add('opacity-0', 'invisible');
        backdrop.setAttribute('aria-hidden', 'true');
    }
    // Restore scroll when popup is closed
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

// Open a specific popup card by its base ID (e.g., "about")
function openPopup(cardId: string) {
    const targetCard = document.getElementById(cardId + '-card') as HTMLElement | null;

    // Close all other popup cards first
    closeAllPopups();

    // Show backdrop and target card
    if (backdrop) {
        backdrop.classList.remove('opacity-0', 'invisible');
        backdrop.classList.add('opacity-65', 'dark:opacity-50', 'visible');
        backdrop.setAttribute('aria-hidden', 'false');
    }
    if (targetCard) {
        targetCard.classList.add('visible');
        targetCard.setAttribute('aria-hidden', 'false');
        // Prevent scroll when popup is open
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        const closeBtn = targetCard.querySelector('.close-btn') as HTMLElement | null;
        if (closeBtn) {
            closeBtn.focus();
        }
    }
}

// Open popups based on URL hash (e.g., /#about)
function handlePopupHash() {
    const hash = window.location.hash ? window.location.hash.substring(1) : '';

    if (!hash) {
        // No hash means no popup should be forced open
        return;
    }

    // Special case: "#contact" should trigger scroll to footer instead of a popup
    if (hash === 'contact') {
        const footer = document.getElementById('footer') as HTMLElement | null;
        if (footer) {
            // Close any open popups before scrolling
            closeAllPopups();
            footer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            } as ScrollIntoViewOptions);
        }
        return;
    }

    const validCards = ['about', 'research', 'achievements', 'code', 'experience'];

    if (validCards.includes(hash)) {
        openPopup(hash);
    }
}

function initializePopups() {
    // Close popup cards when clicking close button
    popupCards.forEach(card => {
        const closeBtn = card.querySelector('.close-btn') as HTMLElement | null;
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

    popupButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cardId = button.getAttribute('data-card');
            if (cardId) {
                openPopup(cardId);
            }
        });
    });

    // Tab functionality for research popup
    const tabButtons = document.querySelectorAll('.tab-button') as NodeListOf<HTMLElement>;
    const tabPanels = document.querySelectorAll('.tab-panel') as NodeListOf<HTMLElement>;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            if (!tabId) return;

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const targetPanel = document.getElementById(tabId + '-tab') as HTMLElement | null;
            if (targetPanel) {
                targetPanel.classList.add('active');

                // Ensure close button in the new tab panel has event listener
                const closeBtn = targetPanel.querySelector('.close-btn') as HTMLElement | null;
                if (closeBtn) {
                    closeBtn.addEventListener('click', closeAllPopups);
                }
            }
        });
    });

    // Keyboard support for closing popups
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            closeAllPopups();
        }
    });

    // Prevent popup from closing when clicking inside the popup content
    popupCards.forEach(card => {
        card.addEventListener('click', (event: Event) => {
            event.stopPropagation();
        });
    });

    // Open popup based on initial URL hash (e.g., /#about)
    handlePopupHash();

    // Keep URL hash and popup state in sync when hash changes
    window.addEventListener('hashchange', handlePopupHash);
}

// Ensure DOM is loaded before initializing
document.addEventListener('DOMContentLoaded', function () {
    initializePopups();
    initializeContactScroll();
});

// Contact button scroll functionality
function initializeContactScroll() {
    const contactButton = document.getElementById('contact-button') as HTMLElement | null;
    const footer = document.getElementById('footer') as HTMLElement | null;
    
    if (contactButton && footer) {
        contactButton.addEventListener('click', () => {
            footer.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            } as ScrollIntoViewOptions);
        });
    }
}
