/**
 * Minimalist Portfolio - Core Interactive Logic
 * Architecture: Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initScrollAnimations();
    initProjectPreviews();
    initCopyEmail();
    initPaperCrushCursor();
    initWhatsAppConnect();
});

/**
 * 1. Ambient Mouse Glow Tracking
 */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animate() {
        // Smooth linear interpolation (lerp) for fluid lag effect
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * 2. Intersection Observer for Scroll Entrance Animations
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Trigger initial hero animations with staggered delay
    fadeElements.forEach((el, index) => {
        if (el.closest('#hero')) {
            setTimeout(() => {
                el.classList.add('visible');
            }, 100 + (index * 150));
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        if (!el.closest('#hero')) {
            scrollObserver.observe(el);
        }
    });
}

/**
 * 3. Flagship Works Hover Preview Reveal
 */
function initProjectPreviews() {
    const workItems = document.querySelectorAll('.work-item');
    const previewFloat = document.getElementById('work-preview-float');
    const worksContainer = document.getElementById('works-list');

    if (!previewFloat || !worksContainer || window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;

    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX + 24;
        targetY = e.clientY - 100;
    }, { passive: true });

    function animatePreview() {
        if (isHovering) {
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;
            previewFloat.style.top = `${currentY}px`;
            previewFloat.style.left = `${currentX}px`;
        }
        requestAnimationFrame(animatePreview);
    }

    animatePreview();

    const mockupEl = document.getElementById('preview-mockup');

    workItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            isHovering = true;
            if (currentX === 0 && currentY === 0) {
                currentX = e.clientX + 24;
                currentY = e.clientY - 100;
            }
            if (mockupEl) {
                const project = item.getAttribute('data-project');
                if (project === 'solid') {
                    mockupEl.style.background = "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80') center/cover no-repeat";
                } else if (project === 'oak-ember') {
                    mockupEl.style.background = "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80') center/cover no-repeat";
                }
            }
            previewFloat.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            isHovering = false;
            previewFloat.classList.remove('active');
        });

        // Click handler to open mock demo link or alert if no direct link
        item.addEventListener('click', () => {
            if (item.getAttribute('href') && item.getAttribute('href') !== '#') return;
            const projectName = item.querySelector('.work-name')?.textContent || 'Project';
            alert(`Opening case study for ${projectName}...`);
        });
    });
}

/**
 * Helper to securely reconstruct contact data at runtime (prevents bot harvesting)
 */
function getSecureContact() {
    const e = [110, 97, 114, 101, 115, 104, 46, 99, 97, 116, 105, 111, 110, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109].map(c => String.fromCharCode(c)).join('');
    const p = [57, 49, 57, 52, 52, 52, 54, 55, 53, 56, 48, 56].map(c => String.fromCharCode(c)).join('');
    return { email: e, phone: p };
}

/**
 * 4. Secure Client Onboarding Copy Email Handler
 */
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    const copyTextEl = document.getElementById('copy-btn-text');
    const directMailBtn = document.getElementById('direct-mailto-btn');

    if (!copyBtn || !toast) return;

    const { email } = getSecureContact();

    // Dynamically assign mailto link on interaction to prevent scraping
    if (directMailBtn) {
        directMailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `mailto:${email}?subject=Project%20Inquiry%20-%20Portfolio`;
        });
    }

    let toastTimer;

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            if (toastMsg) toastMsg.textContent = `Email ${email} copied to clipboard.`;
            showToast();
            
            // Temporary button state
            const originalText = copyTextEl.textContent;
            copyTextEl.textContent = email;
            copyBtn.style.borderColor = 'var(--accent-emerald)';
            
            setTimeout(() => {
                copyTextEl.textContent = originalText;
                copyBtn.style.borderColor = '';
            }, 3000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            if (toastMsg) toastMsg.textContent = `Email ${email} copied to clipboard.`;
            showToast();
        }
    });

    function showToast() {
        clearTimeout(toastTimer);
        toast.classList.add('show');
        
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

/**
 * 5. Permanent Minimalist Dot Cursor
 */
function initPaperCrushCursor() {
    const cursorDot = document.getElementById('custom-cursor-dot');
    if (!cursorDot || window.matchMedia('(pointer: coarse)').matches) return;

    document.body.classList.add('custom-cursor-active');

    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    }, { passive: true });
}

/**
 * 6. WhatsApp Direct Connect Handler (Secure Assembly)
 */
function initWhatsAppConnect() {
    const waBtn = document.getElementById('whatsapp-connect-btn');
    if (!waBtn) return;

    waBtn.addEventListener('click', () => {
        const { phone } = getSecureContact();
        const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=Hi%20Naresh,%20I'm%20ready%20to%20initiate%20a%20project.`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
}
