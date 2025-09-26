// Global variables
let userName = localStorage.getItem('userName') || 'Guest';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateWelcomeMessage();
    setupEventListeners();
    setupScrollAnimations();
});

// Initialize application
function initializeApp() {
    // Mobile navigation
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update welcome message
function updateWelcomeMessage() {
    const welcomeText = document.getElementById('welcome-text');
    if (welcomeText) {
        welcomeText.textContent = `Hi ${userName}! Welcome to TechVision Solutions`;
    }
}

// Prompt for user name
function promptName() {
    const name = prompt('Please enter your name:');
    if (name && name.trim() !== '') {
        userName = name.trim();
        localStorage.setItem('userName', userName);
        updateWelcomeMessage();
        
        // Show success message
        showNotification(`Welcome ${userName}! Thanks for visiting us.`, 'success');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
    }

    // Real-time validation
    const formInputs = ['name', 'email', 'phone', 'message'];
    formInputs.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('blur', () => validateField(field));
            input.addEventListener('input', () => clearError(field));
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateAllFields();
    
    if (isValid) {
        // Get form data
        const formData = getFormData();
        
        // Show loading state
        showLoadingState();
        
        // Simulate API call delay
        setTimeout(() => {
            hideLoadingState();
            displayFormResults(formData);
            resetForm();
            showNotification('Message sent successfully!', 'success');
        }, 2000);
    } else {
        showNotification('Please correct the errors in the form.', 'error');
    }
}

// Get form data
function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toLocaleString()
    };
}

// Validate all fields
function validateAllFields() {
    const fields = ['name', 'email', 'phone', 'message'];
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const value = field.value.trim();
    
    let isValid = true;
    let errorMessage = '';
    
    // Common validation
    if (!value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    } else {
        // Field-specific validation
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Name can only contain letters and spaces';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                } else if (value.length > 1000) {
                    isValid = false;
                    errorMessage = 'Message must be less than 1000 characters';
                }
                break;
        }
    }
    
    // Display error
    if (errorElement) {
        errorElement.textContent = errorMessage;
        field.classList.toggle('error', !isValid);
    }
    
    return isValid;
}

// Get field label
function getFieldLabel(fieldName) {
    const labels = {
        name: 'Name',
        email: 'Email',
        phone: 'Phone Number',
        message: 'Message'
    };
    return labels[fieldName] || fieldName;
}

// Clear error
function clearError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (errorElement && field) {
        errorElement.textContent = '';
        field.classList.remove('error');
    }
}

// Show loading state
function showLoadingState() {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
    }
}

// Hide loading state
function hideLoadingState() {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.innerHTML = 'Send Message';
        submitBtn.disabled = false;
    }
}

// Display form results in modal
function displayFormResults(formData) {
    const modal = document.getElementById('submission-result');
    const resultContent = document.getElementById('result-content');
    
    if (modal && resultContent) {
        resultContent.innerHTML = `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="color: #333; margin-bottom: 15px;">📋 Submission Details</h4>
                <div style="display: grid; gap: 10px;">
                    <div><strong>Name:</strong> ${formData.name}</div>
                    <div><strong>Email:</strong> ${formData.email}</div>
                    <div><strong>Phone:</strong> ${formData.phone}</div>
                    <div><strong>Submitted:</strong> ${formData.timestamp}</div>
                </div>
            </div>
            <div style="background: #e3f2fd; padding: 20px; border-radius: 10px;">
                <h4 style="color: #333; margin-bottom: 15px;">💬 Your Message</h4>
                <p style="line-height: 1.6; color: #555;">${formData.message}</p>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: center;">
                <p style="color: #2e7d32; margin: 0; font-weight: 500;">✅ We'll get back to you within 24 hours!</p>
            </div>
        `;
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('submission-result');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
        
        // Clear all error messages
        const errorElements = form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        // Remove error classes
        const inputElements = form.querySelectorAll('input, textarea');
        inputElements.forEach(element => {
            element.classList.remove('error');
        });
    }
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
}

// Setup scroll animations
function setupScrollAnimations() {
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
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.about-company, .vision-mission, .services, .service-card, .vm-card, .stat-item'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            max-width: 350px;
            animation: slideInRight 0.3s ease;
        ">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error {
        border: 2px solid #f44336 !important;
        background-color: #ffebee !important;
    }
`;
document.head.appendChild(style);

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('submission-result');
    if (event.target === modal) {
        closeModal();
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Utility function to format phone number as user types
document.getElementById('phone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    if (value.length >= 6) {
        formattedValue = value.replace(/(\d{3,4})(\d{3,4})(\d+)/, '$1-$2-$3');
    } else if (value.length >= 3) {
        formattedValue = value.replace(/(\d{3,4})(\d+)/, '$1-$2');
    }
    
    e.target.value = formattedValue;
});

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    // Subtle parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero && window.innerWidth > 768) {
        const rect = hero.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= 0) {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
            hero.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        }
    }
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll handler
window.addEventListener('scroll', debounce(handleNavbarScroll, 10));

console.log('🚀 TechVision Solutions website loaded successfully!');
