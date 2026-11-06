// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

function setMenuOpen(open) {
    if (!hamburger || !navLinks) return;
    hamburger.classList.toggle('active', open);
    navLinks.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

// Mobile menu toggle
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        setMenuOpen(hamburger.getAttribute('aria-expanded') !== 'true');
    });
}

// Close mobile menu when clicking links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        setMenuOpen(false);
    });
});

// Keep scroll work to one lightweight, frame-throttled update.
const navbar = document.querySelector('.navbar');
let scrollUpdateQueued = false;

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
            link.setAttribute('aria-current', 'location');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function updateScrollState() {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
    setActiveNav();
    scrollUpdateQueued = false;
}

window.addEventListener('scroll', () => {
    if (!scrollUpdateQueued) {
        scrollUpdateQueued = true;
        window.requestAnimationFrame(updateScrollState);
    }
}, { passive: true });

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
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
        }
    });
});

const observerOptions = {
    root: null,
    rootMargin: '0px',
    // Tall mobile galleries may never fit 15% of their height in the viewport.
    threshold: 0
};

const scrollObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions) : null;

// Add scroll animation classes to elements
document.querySelectorAll('.section-header, .fade-up, .fade-in, .scale-in, .slide-left, .slide-right, .stagger-children').forEach(el => {
    if (scrollObserver) scrollObserver.observe(el);
    else el.classList.add('show');
});

// Auto-add fade-up to common elements
document.querySelectorAll('.bio-grid, .highlight-card, .project-card, .mod-category, .contact-layout').forEach(el => {
    if (scrollObserver) {
        el.classList.add('fade-up');
        scrollObserver.observe(el);
    }
});

// Stagger gallery items
document.querySelectorAll('.gallery-masonry').forEach(grid => {
    if (scrollObserver) {
        grid.classList.add('stagger-children');
        scrollObserver.observe(grid);
    }
});

// Stagger perforation cards
document.querySelectorAll('.perforation-grid').forEach(grid => {
    if (scrollObserver) {
        grid.classList.add('stagger-children');
        scrollObserver.observe(grid);
    }
});

// Stagger projects grid
document.querySelectorAll('.projects-grid').forEach(grid => {
    if (scrollObserver) {
        grid.classList.add('stagger-children');
        scrollObserver.observe(grid);
    }
});

// Observe all scroll-animate elements
document.querySelectorAll('.scroll-animate').forEach(el => {
    if (scrollObserver) scrollObserver.observe(el);
    else el.classList.add('show');
});

// ============================================
// GALLERY FILTER
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

function applyGalleryFilter(filterValue) {
    galleryItems.forEach((item, index) => {
        if (item.getAttribute('data-category') === filterValue) {
            item.classList.remove('hidden');
            item.style.animation = `fadeInUp 0.45s ease ${Math.min(index, 6) * 0.05}s both`;
        } else {
            item.classList.add('hidden');
        }
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        applyGalleryFilter(btn.getAttribute('data-filter'));
    });
});

applyGalleryFilter(document.querySelector('.filter-btn.active')?.getAttribute('data-filter'));
document.documentElement.classList.remove('gallery-pending');

// ============================================
// GALLERY LIGHTBOX
// ============================================
const galleryLightbox = document.getElementById('galleryLightbox');
const lightboxImage = galleryLightbox?.querySelector('img');
const lightboxClose = galleryLightbox?.querySelector('.gallery-lightbox-close');
let lastGalleryFrame;

function closeGalleryLightbox() {
    if (!galleryLightbox) return;

    galleryLightbox.classList.remove('is-open');
    galleryLightbox.inert = true;
    galleryLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-lightbox-open');
    lastGalleryFrame?.focus();
}

function openGalleryLightbox(image, frame) {
    if (!galleryLightbox || !lightboxImage) return;

    lastGalleryFrame = frame;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    galleryLightbox.inert = false;
    galleryLightbox.classList.add('is-open');
    galleryLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-lightbox-open');
    lightboxClose?.focus();
}

document.querySelectorAll('.gallery-frame img, .perforation-photo-gallery img').forEach(image => {
    const zoomTarget = image.closest('.gallery-frame') || image;

    zoomTarget.classList.add('gallery-zoom');
    zoomTarget.tabIndex = 0;
    zoomTarget.setAttribute('role', 'button');
    zoomTarget.setAttribute('aria-label', `Ampliar ${image.alt}`);
    zoomTarget.addEventListener('click', () => openGalleryLightbox(image, zoomTarget));
    zoomTarget.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openGalleryLightbox(image, zoomTarget);
        }
    });
});

lightboxClose?.addEventListener('click', closeGalleryLightbox);
galleryLightbox?.addEventListener('click', event => {
    if (event.target === galleryLightbox) closeGalleryLightbox();
});
document.addEventListener('keydown', event => {
    if (galleryLightbox?.classList.contains('is-open')) {
        if (event.key === 'Escape') closeGalleryLightbox();
        if (event.key === 'Tab') {
            event.preventDefault();
            lightboxClose?.focus();
        }
    } else if (event.key === 'Escape' && hamburger?.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        hamburger.focus();
    }
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
        if (window.innerWidth > 840) {
            setMenuOpen(false);
        }
    }, 250);
});
