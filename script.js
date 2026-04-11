// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// Navbar scroll effect - Apple style
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
});

// Active navigation link
const sections = document.querySelectorAll('section[id]');
const navLinksArray = document.querySelectorAll('.nav-links a');

function setActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ============================================
// SMOOTH SCROLL - Apple Style
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const navHeight = 72;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL HINT - Click to scroll
// ============================================
const scrollHint = document.querySelector('.scroll-hint');

if (scrollHint) {
    scrollHint.addEventListener('click', () => {
        const bioSection = document.getElementById('bio');
        if (bioSection) {
            bioSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// ============================================
// HERO BACKGROUND PARALLAX ON SCROLL
// ============================================
const heroBg = document.querySelector('.hero-bg');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
    
    if (scrolled < heroHeight) {
        // Parallax effect for background elements
        if (heroBg) {
            const spheres = heroBg.querySelectorAll('.gradient-sphere');
            spheres.forEach((sphere, index) => {
                const speed = 0.15 + (index * 0.05);
                sphere.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
        
        // Fade out hero content on scroll
        if (heroContent) {
            const opacity = 1 - (scrolled / (heroHeight * 0.6));
            const translateY = scrolled * 0.3;
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
        
        // Parallax for suminagashi
        const suminagashi = document.querySelector('.suminagashi-bg');
        if (suminagashi) {
            suminagashi.style.transform = `translateY(${scrolled * 0.1}px) scale(${1 + scrolled * 0.0002})`;
        }
    }
});
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Add scroll animation classes to elements
document.querySelectorAll('.section-header, .fade-up, .fade-in, .scale-in, .slide-left, .slide-right, .stagger-children').forEach(el => {
    scrollObserver.observe(el);
});

// Auto-add fade-up to common elements
document.querySelectorAll('.bio-grid, .highlight-card, .project-card, .mod-category, .contact-layout').forEach(el => {
    el.classList.add('fade-up');
    scrollObserver.observe(el);
});

// Stagger gallery items
document.querySelectorAll('.gallery-masonry').forEach(grid => {
    grid.classList.add('stagger-children');
    scrollObserver.observe(grid);
});

// Stagger perforation cards
document.querySelectorAll('.perforation-grid').forEach(grid => {
    grid.classList.add('stagger-children');
    scrollObserver.observe(grid);
});

// Stagger projects grid
document.querySelectorAll('.projects-grid').forEach(grid => {
    grid.classList.add('stagger-children');
    scrollObserver.observe(grid);
});

// Observe all scroll-animate elements
document.querySelectorAll('.scroll-animate').forEach(el => {
    scrollObserver.observe(el);
});

// ============================================
// GALLERY FILTER
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        // Filter items with animation
        galleryItems.forEach((item, index) => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hidden');
                item.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        
        // Apple-style success feedback
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#34c759';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            contactForm.reset();
        }, 3000);
        
        console.log('Form submitted:', {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        });
    });
}

// ============================================
// PARALLAX EFFECTS - Subtle
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const spheres = document.querySelectorAll('.gradient-sphere');
    
    spheres.forEach((sphere, index) => {
        const speed = 0.1 + (index * 0.05);
        sphere.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ============================================
// SMOOTH HOVER EFFECTS
// ============================================
document.querySelectorAll('.gallery-item, .project-card, .highlight-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
    });
});

// ============================================
// INITIAL PAGE LOAD
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    setActiveNav();
});

// ============================================
// RESIZE HANDLER
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            if (hamburger) hamburger.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        }
    }, 250);
});
