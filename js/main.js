/**
 * Market Macrostructure Website - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Animate hamburger to X
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation class to elements and observe them
    const animateElements = [
        '.pillar-card',
        '.comparison-card',
        '.feature-card',
        '.application-card',
        '.paper-category',
        '.key-quote'
    ];

    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        const navHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add hover effects to SVG diagrams
    const heroNodes = document.querySelectorAll('.hero-diagram .node');
    heroNodes.forEach(node => {
        node.style.cursor = 'pointer';
        node.addEventListener('mouseenter', function() {
            this.querySelector('circle').style.filter = 'brightness(1.1)';
        });
        node.addEventListener('mouseleave', function() {
            this.querySelector('circle').style.filter = 'none';
        });
    });

    // Paper filtering (if we add search later)
    function filterPapers(query) {
        const papers = document.querySelectorAll('.paper-item');
        const lowerQuery = query.toLowerCase();

        papers.forEach(paper => {
            const title = paper.querySelector('h4').textContent.toLowerCase();
            const authors = paper.querySelector('.paper-authors').textContent.toLowerCase();
            const venue = paper.querySelector('.paper-venue').textContent.toLowerCase();

            if (title.includes(lowerQuery) || authors.includes(lowerQuery) || venue.includes(lowerQuery)) {
                paper.style.display = 'flex';
            } else {
                paper.style.display = 'none';
            }
        });
    }

    // Expose filter function globally if needed
    window.filterPapers = filterPapers;

    console.log('Market Macrostructure website loaded successfully');
});
