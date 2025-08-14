//=============== PROJECTS PAGE FUNCTIONALITY ===============

document.addEventListener('DOMContentLoaded', function() {
    initProjectsPage();
});

//========== INITIALIZATION ==========
function initProjectsPage() {
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.querySelectorAll('.filter-tag');
    const projectCards = document.querySelectorAll('.project__card');
    const noResults = document.getElementById('noResults');

    if (searchInput) {
        // Debounced search for better performance
        const debouncedSearch = debounce(handleSearch, 300);
        searchInput.addEventListener('input', debouncedSearch);
        
        // Clear search on escape key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                handleSearch({ target: searchInput });
            }
        });
    }

    if (filterTags.length > 0) {
        initFilterTags(filterTags, projectCards);
    }

    // Initialize animations
    initProjectAnimations();
    
    // Initialize keyboard navigation
    initKeyboardNavigation();
}

//========== SEARCH FUNCTIONALITY ==========
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const projectCards = document.querySelectorAll('.project__card');
    const noResults = document.getElementById('noResults');
    let visibleCards = 0;

    projectCards.forEach(card => {
        const title = card.querySelector('.project__title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.project__description')?.textContent.toLowerCase() || '';
        const tags = Array.from(card.querySelectorAll('.project__tag'))
            .map(tag => tag.textContent.toLowerCase());
        
        const isVisible = title.includes(searchTerm) || 
                         description.includes(searchTerm) || 
                         tags.some(tag => tag.includes(searchTerm));
        
        if (isVisible) {
            card.classList.remove('hidden');
            visibleCards++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Show/hide no results message
    if (noResults) {
        if (visibleCards === 0 && searchTerm !== '') {
            noResults.classList.add('show');
        } else {
            noResults.classList.remove('show');
        }
    }

    // Update URL for shareable search
    updateSearchURL(searchTerm);
}

//========== FILTER FUNCTIONALITY ==========
function initFilterTags(filterTags, projectCards) {
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            filterTags.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tag
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            const selectedTag = this.getAttribute('data-tag').toLowerCase();
            
            projectCards.forEach(card => {
                if (selectedTag === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const cardTags = Array.from(card.querySelectorAll('.project__tag'))
                        .map(t => t.textContent.toLowerCase());
                    const isVisible = cardTags.includes(selectedTag);
                    
                    if (isVisible) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });

            // Update URL for shareable filter
            updateFilterURL(selectedTag);
        });

        // Keyboard navigation for filter tags
        tag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tag.click();
            }
        });
    });
}

//========== ANIMATIONS ==========
function initProjectAnimations() {
    const projectCards = document.querySelectorAll('.project__card');
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe project cards
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

//========== KEYBOARD NAVIGATION ==========
function initKeyboardNavigation() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const searchInput = document.getElementById('searchInput');

    // Filter tags navigation
    filterTags.forEach((tag, index) => {
        tag.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    const nextTag = filterTags[index + 1] || filterTags[0];
                    nextTag.focus();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevTag = filterTags[index - 1] || filterTags[filterTags.length - 1];
                    prevTag.focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    filterTags[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    filterTags[filterTags.length - 1].focus();
                    break;
            }
        });
    });

    // Focus management
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !e.shiftKey) {
                // Move to first filter tag after search input
                const firstFilterTag = document.querySelector('.filter-tag');
                if (firstFilterTag) {
                    e.preventDefault();
                    firstFilterTag.focus();
                }
            }
        });
    }
}

//========== URL MANAGEMENT ==========
function updateSearchURL(searchTerm) {
    const url = new URL(window.location);
    if (searchTerm) {
        url.searchParams.set('search', searchTerm);
    } else {
        url.searchParams.delete('search');
    }
    window.history.replaceState({}, '', url);
}

function updateFilterURL(filter) {
    const url = new URL(window.location);
    if (filter && filter !== 'all') {
        url.searchParams.set('filter', filter);
    } else {
        url.searchParams.delete('filter');
    }
    window.history.replaceState({}, '', url);
}

// Load URL parameters on page load
function loadURLParameters() {
    const url = new URL(window.location);
    const searchTerm = url.searchParams.get('search');
    const filter = url.searchParams.get('filter');

    if (searchTerm) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchTerm;
            handleSearch({ target: searchInput });
        }
    }

    if (filter) {
        const filterTag = document.querySelector(`[data-tag="${filter}"]`);
        if (filterTag) {
            filterTag.click();
        }
    }
}

//========== UTILITY FUNCTIONS ==========

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

//========== ERROR HANDLING ==========
function handleProjectError(error) {
    console.error('Project page error:', error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <i class="ri-error-warning-line"></i>
        <p>Une erreur s'est produite lors du chargement des projets.</p>
    `;
    errorMessage.style.cssText = `
        text-align: center;
        padding: 2rem;
        color: #ff4757;
        background: rgba(255, 71, 87, 0.1);
        border-radius: 0.5rem;
        margin: 2rem 0;
    `;
    
    const container = document.querySelector('.projects__container');
    if (container) {
        container.appendChild(errorMessage);
    }
}

//========== PERFORMANCE OPTIMIZATION ==========

// Optimize image loading
function optimizeImageLoading() {
    const projectImages = document.querySelectorAll('.project__image img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    projectImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

//========== ACCESSIBILITY IMPROVEMENTS ==========

// Announce search results to screen readers
function announceSearchResults(visibleCount, totalCount) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${visibleCount} projet${visibleCount > 1 ? 's' : ''} trouvé${visibleCount > 1 ? 's' : ''} sur ${totalCount}`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Screen reader only class
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);

//========== INITIALIZATION ON LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    loadURLParameters();
    optimizeImageLoading();
});

//========== ERROR HANDLING ==========
window.addEventListener('error', function(e) {
    handleProjectError(e.error);
}); 