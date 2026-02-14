// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}



// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);

        if (target) {
            e.preventDefault();
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all event, member cards, and timeline items for animation
// Observe all event, member cards, and timeline items for animation
const animateElements = document.querySelectorAll('.event, .member, .timeline-item, .info-card');

animateElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.8s cubic-bezier(0.5, 0, 0, 1), transform 0.8s cubic-bezier(0.5, 0, 0, 1)';
    // Add staggering delay based on index in its container if possible, or just global randomness
    // Simple stagger:
    const delay = (index % 3) * 150;
    element.style.transitionDelay = `${delay}ms`;
    observer.observe(element);
});

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section, footer');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.style.color = '#333';
        item.style.borderBottom = '2px solid transparent';

        if (item.getAttribute('href').slice(1) === current) {
            item.style.color = '#007bff';
            item.style.borderBottom = '2px solid #007bff';
        }
    });
});

// ===== PAGE LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Initial fade-in effect
if (document.readyState === 'loading') {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '1';
    });
} else {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// ===== EVENT LISTENERS FOR BUTTONS =====
// Redundant event listeners removed. Links are handled by anchor tags.

// ===== UTILITY FUNCTION: Log Page Info =====
function logPageInfo() {
    const members = document.querySelectorAll('.member');
    console.log('=== KARE OSS Website ===');
    console.log('Sections Found:', sections.length);
    console.log('Members Found:', members.length);
    console.log('Navigation Items:', navItems.length);
    console.log('========================');
}

// Run on page load
logPageInfo();

// ===== EVENT MODAL =====
const eventModal = document.getElementById('event-modal');
const eventModalImg = document.getElementById('event-modal-img');
const eventModalTitle = document.getElementById('event-modal-title');
const eventModalDescription = document.getElementById('event-modal-description');
const eventModalClose = eventModal ? eventModal.querySelector('.close') : null;

if (eventModal) {
    let currentImageIndex = 0;
    let modalImages = [];

    const updateModalImage = (index) => {
        currentImageIndex = index;
        eventModalImg.style.opacity = '0';
        setTimeout(() => {
            eventModalImg.src = modalImages[currentImageIndex];
            eventModalImg.style.opacity = '1';
        }, 200);

        // Update thumbnails active state
        const thumbs = document.querySelectorAll('.thumb');
        thumbs.forEach((thumb, i) => {
            if (i === currentImageIndex) thumb.classList.add('active');
            else thumb.classList.remove('active');
        });
    };

    document.querySelectorAll('.event').forEach(event => {
        event.addEventListener('click', function () {
            const title = this.querySelector('h3').innerText;
            const fullDetails = this.getAttribute('data-full-details') || this.querySelector('p').innerText;
            const phonesRaw = this.getAttribute('data-phones') || '';
            const imagesRaw = this.getAttribute('data-modal-images') || '';

            modalImages = imagesRaw ? imagesRaw.split(',').map(img => img.trim()).filter(img => img !== '') : [this.querySelector('img').src];
            currentImageIndex = 0;

            eventModalTitle.innerText = title;
            updateModalImage(0);

            // Populate thumbnails
            const galleryThumbs = document.getElementById('gallery-thumbs');
            galleryThumbs.innerHTML = '';
            if (modalImages.length > 1) {
                modalImages.forEach((imgSrc, index) => {
                    const thumb = document.createElement('img');
                    thumb.src = imgSrc;
                    thumb.classList.add('thumb');
                    if (index === 0) thumb.classList.add('active');
                    thumb.addEventListener('click', () => updateModalImage(index));
                    galleryThumbs.appendChild(thumb);
                });
            }

            // Construct detailed description
            let descriptionHtml = `<p>${fullDetails}</p>`;
            if (phonesRaw) {
                const phones = phonesRaw.split(',').map(p => p.trim());
                descriptionHtml += `
                    <div class="modal-details-phones">
                        <h4>Contact Organizers</h4>
                        <div class="phone-list">
                            ${phones.map(phone => `
                                <div class="phone-item">
                                    <i class="fas fa-phone"></i>
                                    <a href="tel:${phone.replace(/\s+/g, '')}" style="color: #fff; text-decoration: none;">${phone}</a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            eventModalDescription.innerHTML = descriptionHtml;
            eventModal.classList.add('show');
        });
    });

    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let nextIndex = currentImageIndex - 1;
            if (nextIndex < 0) nextIndex = modalImages.length - 1;
            updateModalImage(nextIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentImageIndex + 1) % modalImages.length;
            updateModalImage(nextIndex);
        });
    }

    if (eventModalClose) {
        eventModalClose.addEventListener('click', () => {
            eventModal.classList.remove('show');
        });
    }
}

// ===== MEMBER MODAL =====
const memberModal = document.getElementById('member-modal');
const modalName = document.getElementById('modal-name');
const modalPosition = document.getElementById('modal-position');
const modalEmail = document.getElementById('modal-email');
const modalLinkedin = document.getElementById('modal-linkedin');
const memberModalClose = memberModal ? memberModal.querySelector('.close') : null;

if (memberModal) {
    document.querySelectorAll('.member').forEach(member => {
        member.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;

            const name = this.getAttribute('data-name');
            const position = this.getAttribute('data-position');
            const email = this.getAttribute('data-email');
            const linkedin = this.getAttribute('data-linkedin');
            const image = this.getAttribute('data-image');

            modalName.textContent = name;
            modalPosition.textContent = position;
            modalEmail.innerHTML = `<i class="fas fa-envelope"></i> <a href="mailto:${email}">${email}</a>`;

            // Handle Member Photo in Modal
            let modalImg = document.getElementById('modal-image');
            if (!modalImg) {
                modalImg = document.createElement('img');
                modalImg.id = 'modal-image';
                memberModal.querySelector('.modal-content').insertBefore(modalImg, modalName);
            }

            const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=8b0000&color=fff`;
            modalImg.src = image || fallbackImg;
            modalImg.onerror = function () { this.src = fallbackImg; };

            const cleanLinkedin = linkedin ? linkedin.trim() : '';
            if (cleanLinkedin && cleanLinkedin !== '#') {
                modalLinkedin.setAttribute('href', cleanLinkedin);
                modalLinkedin.innerHTML = `<i class="fab fa-linkedin"></i> LinkedIn Profile`;
                modalLinkedin.style.display = 'inline-block';
            } else {
                modalLinkedin.style.display = 'none';
            }

            memberModal.classList.add('show');
        });
    });

    if (memberModalClose) {
        memberModalClose.addEventListener('click', () => {
            memberModal.classList.remove('show');
        });
    }
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === eventModal) {
        eventModal.classList.remove('show');
    }
    if (memberModal && event.target === memberModal) {
        memberModal.classList.remove('show');
    }
});

// Hero register button now handled directly by anchor tag in HTML.

// Register callout button now handled directly by anchor tag in HTML.

// ===== PREVENT MULTIPLE CLICKS =====
let isAnimating = false;

document.querySelectorAll('.member').forEach(member => {
    member.addEventListener('click', function (e) {
        if (isAnimating) return;
        isAnimating = true;
        setTimeout(() => { isAnimating = false; }, 300);
    });

});



// ===== 3D TILT EFFECT (Vanilla JS) =====
function initTilt(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            // Disable tilt for Charter Official section
            if (el.closest('#charter-official')) return;

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on mouse position
            const xRotation = -1 * ((y - rect.height / 2) / 10); // Rotate around X axis
            const yRotation = (x - rect.width / 2) / 10;   // Rotate around Y axis

            el.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
            el.style.transition = 'transform 0.1s ease';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            el.style.transition = 'transform 0.5s ease';
        });
    });
}

// Initialize tilt on cards
initTilt('.member');
initTilt('.event');
initTilt('.info-card');

// ===== TYPING ANIMATION =====
const heroTitle = document.querySelector('.hero h2');
if (heroTitle) {
    const originalText = "WONDERS OF AI 3.0";
    heroTitle.innerHTML = "";
    heroTitle.classList.add('typing-cursor');

    let charIndex = 0;
    function typeText() {
        if (charIndex < originalText.length) {
            heroTitle.innerHTML += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        } else {
            setTimeout(() => {
                heroTitle.classList.remove('typing-cursor');
                heroTitle.classList.add('animate-text-gradient');
            }, 1000);
        }
    }

    setTimeout(typeText, 500);
}

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== COUNTDOWN TIMER =====
const countdown = () => {
    // Target Date: March 13, 2026 09:00:00
    const countDate = new Date('March 13, 2026 09:00:00').getTime();
    const now = new Date().getTime();
    const gap = countDate - now;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const textDay = Math.floor(gap / day);
    const textHour = Math.floor((gap % day) / hour);
    const textMinute = Math.floor((gap % hour) / minute);
    const textSecond = Math.floor((gap % minute) / second);

    const format = (num) => num < 10 ? `0${num}` : num;

    if (gap > 0) {
        document.getElementById('days').innerText = format(textDay);
        document.getElementById('hours').innerText = format(textHour);
        document.getElementById('minutes').innerText = format(textMinute);
        document.getElementById('seconds').innerText = format(textSecond);
    }
};

if (document.getElementById('countdown')) {
    setInterval(countdown, 1000);
    countdown();
}
