
document.addEventListener("DOMContentLoaded", () => {
    // ===== TYPEWRITER EFFECT =====
    const text = "Software Engineer";
    const typingSpeed = 120;
    const deletingSpeed = 120;
    const pauseAfterType = 1200;
    const pauseAfterDelete = 200;

    const target = document.getElementById("typewriter");

    let index = 0;
    let isDeleting = false;

    function typeLoop() {
        if (!isDeleting) {
            // Typing
            if (index < text.length) {
                target.textContent += text.charAt(index);
                index++;
                setTimeout(typeLoop, typingSpeed);
            } else {
                // Pause after full text
                setTimeout(() => {
                    isDeleting = true;
                    typeLoop();
                }, pauseAfterType);
            }
        } else {
            // Deleting
            if (index > 0) {
                target.textContent = text.substring(0, index - 1);
                index--;
                setTimeout(typeLoop, deletingSpeed);
            } else {
                // Pause before re-typing
                isDeleting = false;
                setTimeout(typeLoop, pauseAfterDelete);
            }
        }
    }

    typeLoop();

    // ===== PAGE LOADER =====
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 800);
    }

    // ===== SCROLL PROGRESS INDICATOR =====
    const scrollProgress = document.querySelector('.scroll-progress');

    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    }

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.querySelector('.back-to-top');

    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== STICKY HEADER SCROLL EFFECT =====
    const header = document.querySelector('header');

    function handleHeaderScroll() {
        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-center a');

    function highlightActiveNav() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Highlight "Home" when at the top
        if (scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#') {
                    link.classList.add('active');
                }
            });
        }
    }

    // ===== SMOOTH SCROLL FOR NAV LINKS =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href === '#' ? 'top' : href.substring(1);

                if (targetId === 'top') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
        });
    });

    // ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('scroll-reveal');
        observer.observe(section);
    });

    // Observe list items with stagger effect
    document.querySelectorAll('.list .item').forEach(item => {
        observer.observe(item);
    });

    // ===== PARALLAX EFFECT FOR HERO AVATAR =====
    const heroAvatar = document.querySelector('.hero-avatar');

    function handleParallax() {
        if (window.innerWidth > 768 && heroAvatar) {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.3;
            heroAvatar.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }

    // ===== DEBOUNCED SCROLL HANDLER =====
    let scrollTimeout;
    function debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(scrollTimeout);
                func(...args);
            };
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(later, wait);
        };
    }

    const debouncedScroll = debounce(() => {
        updateScrollProgress();
        toggleBackToTop();
        handleHeaderScroll();
        highlightActiveNav();
    }, 10);

    // Use requestAnimationFrame for smooth parallax
    function onScroll() {
        debouncedScroll();
        requestAnimationFrame(handleParallax);
    }

    window.addEventListener('scroll', onScroll);

    // ===== FORM VALIDATION =====
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('error');
                } else if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                } else {
                    input.classList.remove('error');
                }
            });

            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });

        contactForm.addEventListener('submit', (e) => {
            let hasError = false;

            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    input.classList.add('error');
                    hasError = true;
                }
            });

            if (hasError) {
                e.preventDefault();
            }
        });
    }

    // ===== INITIAL CALLS =====
    updateScrollProgress();
    toggleBackToTop();
    handleHeaderScroll();
    highlightActiveNav();
});

// ===== THEME TOGGLE =====
function toggleTheme() {
    document.body.dataset.theme =
        document.body.dataset.theme === 'dark' ? 'light' : 'dark';

    // Optional: Save preference to localStorage
    localStorage.setItem('theme', document.body.dataset.theme);
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.dataset.theme = savedTheme;
}
