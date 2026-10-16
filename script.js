document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Hero Slideshow (Changes every 3 seconds) ---
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const slideInterval = 3000;

    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }

    // --- 2. Auto-Flipping Core Values Cards ---
    const flipCards = document.querySelectorAll('.flip-card');

    function toggleFlip(card) {
        card.classList.toggle('auto-flip');
    }

    flipCards.forEach(card => {
        const delay = parseInt(card.getAttribute('data-flip-delay')) || 0;
        setTimeout(() => {
            toggleFlip(card);
            setInterval(() => {
                toggleFlip(card);
            }, 3000);
        }, delay);
    });

    // --- 3. Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });

    // --- 4. Page Navigation (SPA Logic) ---
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-links a, .footer-links a');
    const navbar = document.getElementById('navbar');

    function switchPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));

        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
            }
        });

        const navLinksContainer = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }

        setTimeout(() => {
            revealOnScroll();
            runCounters();
            runParallax();
        }, 100);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            if (pageId) {
                switchPage(pageId);
            }
        });
    });

    // --- 5. Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 6. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinksContainer.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // --- 7. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach(element => {
            if (element.closest('.page').classList.contains('active')) {
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < windowHeight - elementVisible) {
                    element.classList.add('visible');
                }
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- 8. Number Counter Animation (Live Stats) ---
    const counters = document.querySelectorAll('.stat-number');
    let counted = false;

    const runCounters = () => {
        const statsBar = document.querySelector('.live-stats-bar');
        if (!statsBar || !statsBar.closest('.page').classList.contains('active')) return;

        const sectionTop = statsBar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100 && !counted) {
            counted = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const increment = target / (duration / 16);

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCounter();
            });
        }
    };

    window.addEventListener('scroll', runCounters);
    runCounters();

    // --- 9. Parallax Background Effect ---
    const parallaxBgs = document.querySelectorAll('.parallax-bg');

    const runParallax = () => {
        const scrolled = window.pageYOffset;
        parallaxBgs.forEach(bg => {
            if (bg.closest('.page').classList.contains('active')) {
                const speed = 0.5;
                bg.style.transform = `translateY(${scrolled * speed}px)`;
            }
        });
    };

    window.addEventListener('scroll', runParallax);
    runParallax();

    // --- 10. About Page Accordion Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;

            // Close other items (optional, for a cleaner look)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('active');

            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // --- 11. Live Background Particles (Simulated) ---
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-2';
    canvas.style.pointerEvents = 'none';

    let particlesArray = [];
    const numberOfParticles = 50;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(214, 109, 75, 0.15)';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    initParticles();
    animateParticles();

});