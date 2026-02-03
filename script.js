
document.addEventListener("DOMContentLoaded", () => {
    // ===== TYPEWRITER EFFECT =====
    const text = "Software Engineer";
    const typingSpeed = 120;
    const deletingSpeed = 120;
    const pauseAfterType = 1200;
    const pauseAfterDelete = 200;

    const target = document.getElementById("typewriter");

    if (target) {
        let index = 0;
        let isDeleting = false;

        const typeLoop = () => {
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
            } else if (index > 0) {
                // Deleting
                target.textContent = text.substring(0, index - 1);
                index--;
                setTimeout(typeLoop, deletingSpeed);
            } else {
                // Pause before re-typing
                isDeleting = false;
                setTimeout(typeLoop, pauseAfterDelete);
            }
        };

        typeLoop();
    }

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

    const updateScrollProgress = () => {
        const { scrollHeight, clientHeight } = document.documentElement;
        const { scrollY } = window;
        const windowHeight = scrollHeight - clientHeight;
        const scrolled = (scrollY / windowHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    };

    // ===== BACK TO TOP BUTTON =====
    const backToTop = document.querySelector('.back-to-top');

    const toggleBackToTop = () => {
        const { scrollY } = window;
        if (scrollY > 300) {
            backToTop?.classList.add('visible');
        } else {
            backToTop?.classList.remove('visible');
        }
    };

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
    let { scrollY: lastScrollY } = window;
    let ticking = false;

    const handleHeaderScroll = () => {
        const { scrollY: currentScrollY } = window;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);

        if (currentScrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

    // Keep header visible at all times (no hide-on-scroll behavior)
    if (scrollDifference > 10) {
        lastScrollY = currentScrollY;
    }

        ticking = false;
    };

    const requestHeaderUpdate = () => {
        if (!ticking) {
            requestAnimationFrame(handleHeaderScroll);
            ticking = true;
        }
    };

    // ===== ACTIVE NAV LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-center a');

    const highlightActiveNav = () => {
        const { scrollY } = window;

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
    };

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

    // ===== HERO AVATAR (STATIC) =====
    const heroAvatar = document.querySelector('.hero-avatar');
    if (heroAvatar) {
        heroAvatar.style.transform = '';
    }

    // ===== DEBOUNCED SCROLL HANDLER =====
    let scrollTimeout;
    const debounce = (func, wait) => {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(scrollTimeout);
                func(...args);
            };
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(later, wait);
        };
    };

    const debouncedScroll = debounce(() => {
        updateScrollProgress();
        toggleBackToTop();
        requestHeaderUpdate();
        highlightActiveNav();
    }, 10);

    // Use requestAnimationFrame for smooth scroll updates
    const onScroll = () => {
        debouncedScroll();
    };

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
    requestHeaderUpdate();
    highlightActiveNav();
});

// ===== THEME TOGGLE =====
function toggleTheme() {
    const { dataset } = document.body;
    dataset.theme = dataset.theme === 'dark' ? 'light' : 'dark';

    // Optional: Save preference to localStorage
    localStorage.setItem('theme', dataset.theme);
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    const { dataset } = document.body;
    dataset.theme = savedTheme;
}

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
    const nav = document.querySelector('.nav-center');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    nav.classList.toggle('active');
    menuBtn.classList.toggle('active');
}

// Close menu when clicking a link
document.querySelectorAll('.nav-center a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.querySelector('.nav-center');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
});

// ===== TECH STACK DROPDOWN TOGGLE (Mobile Only) =====
function toggleStack(header) {
    // Only toggle on mobile
    if (window.innerWidth <= 768) {
        const stackGroup = header.parentElement;
        stackGroup.classList.toggle('active');
    }
}
