//=============== CONTACT FORM HANDLING ===============

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
});

//========== FORM SUBMISSION ==========
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    if (!validateForm(data)) {
        showMessage('error', 'Veuillez corriger les erreurs dans le formulaire.');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.contact__submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> ENVOI EN COURS...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success simulation
        showMessage('success', 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
        e.target.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

//========== FORM VALIDATION ==========
function validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        markFieldError('fullName', 'Le nom doit contenir au moins 2 caractères.');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        markFieldError('email', 'Veuillez entrer une adresse email valide.');
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject || data.subject.trim().length < 3) {
        markFieldError('subject', 'Le sujet doit contenir au moins 3 caractères.');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        markFieldError('message', 'Le message doit contenir au moins 10 caractères.');
        isValid = false;
    }
    
    return isValid;
}

//========== FIELD VALIDATION ==========
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value || value.length < 2) {
                errorMessage = 'Le nom doit contenir au moins 2 caractères.';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value)) {
                errorMessage = 'Veuillez entrer une adresse email valide.';
                isValid = false;
            }
            break;
            
        case 'subject':
            if (!value || value.length < 3) {
                errorMessage = 'Le sujet doit contenir au moins 3 caractères.';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value || value.length < 10) {
                errorMessage = 'Le message doit contenir au moins 10 caractères.';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        markFieldError(field.id, errorMessage);
    } else {
        clearFieldError(field);
    }
}

//========== ERROR HANDLING ==========
function markFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ff4757;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease-out;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

//========== MESSAGE DISPLAY ==========
function showMessage(type, message) {
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    // Hide all messages first
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
    
    // Show appropriate message
    if (type === 'success') {
        successMessage.textContent = message;
        successMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    } else {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
}

//========== CHARACTER COUNTER ==========
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.75rem;
            color: var(--text-color);
            margin-top: 0.25rem;
        `;
        
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const length = messageField.value.length;
            const maxLength = 1000;
            counter.textContent = `${length}/${maxLength} caractères`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = '#ffa502';
            } else {
                counter.style.color = 'var(--text-color)';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }
}

//========== ACCESSIBILITY IMPROVEMENTS ==========
function enhanceAccessibility() {
    const form = document.getElementById('contactForm');
    if (form) {
        // Add ARIA labels and descriptions
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-labelledby', label.id);
                input.setAttribute('aria-describedby', `${input.id}-description`);
            }
        });
        
        // Add keyboard navigation
        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const nextField = e.target.parentNode.nextElementSibling?.querySelector('input, textarea');
                if (nextField) {
                    nextField.focus();
                }
            }
        });
    }
}

//========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initCharacterCounter();
    enhanceAccessibility();
});

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

// Sanitize input
function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

// Format phone number
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
        return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return phone;
} 