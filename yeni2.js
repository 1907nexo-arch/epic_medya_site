/**
 * ==========================================================================
 * EPIC MEDYA SÜPER PREMIUM MOTORU - TÜM SAYFALARIN KALBİ (ENGINE)
 * ==========================================================================
 */

let lenis;

// Miyavlama ses motoru ve yedek (fallback) kedi sesi adresi
let meowSound = new Audio('assets/audio/meow.mp3');
meowSound.addEventListener('error', () => {
    meowSound.src = "https://www.orangefreesounds.com/wp-content/uploads/2015/01/Cat-meow-sound-effect.mp3";
});

/**
 * Admin Panelinden Girilen Dinamik Verileri Çekme ve Sayfaya Yazma Motoru (YENİ)
 */
/**
 * Admin Panelinden Girilen Dinamik Verileri Çekme ve Sayfaya Yazma Motoru (GÜNCELLENDİ)
 */
async function loadDynamicContent() {
    try {
        const response = await fetch('assets/data.json');
        if (!response.ok) return;
        const data = await response.json();
        
        const heroLabel = document.querySelector('.technical-label');
        const heroGlow = document.querySelector('.text-glow');
        const heroDesc = document.querySelector('.hero-desc');
        
        // HTML üzerindeki paragraf (<p>) etiketlerinizi hedefleyen güncel seçiciler
        const phoneElements = document.querySelectorAll('.cta-phone, .mobile-menu-footer p');
        const emailElements = document.querySelectorAll('.cta-email');

        if (heroLabel && data.hero_label) heroLabel.textContent = data.hero_label;
        if (heroGlow && data.hero_glow_text) heroGlow.textContent = data.hero_glow_text;
        if (heroDesc && data.hero_desc) heroDesc.textContent = data.hero_desc;
        
        // Telefon numarasını sayfadaki tüm ilgili alanlarda günceller
        if (data.phone_number) {
            phoneElements.forEach(el => {
                el.textContent = data.phone_number;
            });
        }
        // E-posta adresini sayfadaki tüm ilgili alanlarda günceller
        if (data.email_address) {
            emailElements.forEach(el => {
                el.textContent = data.email_address;
            });
        }
    } catch (err) {
        console.log("Dinamik veriler yüklenirken hata oluştu (Lokaldeyken normaldir):", err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicContent(); // Verileri ilk sırada yükler
    
    initSmoothScroll();
    initCustomCursor();
    initMobileMenu();
    initGridHoverEffect();
    initAnimationsOnScroll();
    initCatInteractions();
    initCinemaParallax(); 
    initHomepageMotifAnimations(); 
    initScratchCard(); 
    initPageSpecificEngines();
});

/**
 * Lenis Smooth Scroll Altyapısı
 */
function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

/**
 * Kedi İmleci Takip Motoru (Custom Cat Cursor)
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');
    
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        gsap.to(dot, {
            x: mouseX,
            y: mouseY,
            duration: 0.05,
            ease: "power2.out"
        });
    });

    gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
        cursorX += (mouseX - cursorX) * dt;
        cursorY += (mouseY - cursorY) * dt;
        
        gsap.set(cursor, {
            x: cursorX,
            y: cursorY
        });
    });

    const interactives = document.querySelectorAll('a, button, input, textarea, .portfolio-item, .ticker-item, .matrix-card');
    interactives.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hovered');
            gsap.to(".cat-cursor-svg", { scale: 1.3, rotate: -5, duration: 0.2 });
        });
        item.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hovered');
            gsap.to(".cat-cursor-svg", { scale: 1, rotate: 0, duration: 0.2 });
        });
    });
}

/**
 * Mobil Menü Aç/Kapat Mantığı
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuLines = document.querySelectorAll('.menu-line');

    if (!toggleBtn || !menuOverlay) return;

    let isOpen = false;

    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        toggleBtn.setAttribute('aria-expanded', isOpen);
        menuOverlay.setAttribute('aria-hidden', !isOpen);

        if (isOpen) {
            menuOverlay.classList.add('active');
            gsap.to(menuLines[0], { rotate: 45, y: 4, duration: 0.3 });
            gsap.to(menuLines[1], { rotate: -45, y: -4, duration: 0.3 });
        } else {
            menuOverlay.classList.remove('active');
            gsap.to(menuLines[0], { rotate: 0, y: 0, duration: 0.3 });
            gsap.to(menuLines[1], { rotate: 0, y: 0, duration: 0.3 });
        }
    });
}

/**
 * Grid Çizgileri Mouse Takip Efekti
 */
function initGridHoverEffect() {
    const lines = document.querySelectorAll('.grid-overlay-line');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        lines.forEach(line => {
            const rect = line.getBoundingClientRect();
            const dist = Math.abs(x - rect.left);
            if (dist < 150) {
                const opacity = 1 - (dist / 150);
                line.style.borderColor = `rgba(197, 168, 128, ${0.08 + opacity * 0.18})`; 
            } else {
                line.style.borderColor = 'var(--color-border)';
            }
        });
    });
}

/**
 * Giriş ve Kaydırma Animasyonları
 */
function initAnimationsOnScroll() {
    gsap.from(".hero-title", {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.3
    });

    gsap.from(".hero-desc, .cta-wrapper", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        delay: 0.6,
        stagger: 0.2
    });

    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        const header = sec.querySelector('.section-header');
        if (header) {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: sec,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out"
            });
        }
    });

    gsap.from(".service-card", {
        scrollTrigger: {
            trigger: ".services-summary",
            start: "top 75%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
    });
}

/**
 * Kontrollü, Tek Miyavlama Çalma Algoritması
 */
function playSingleMeow() {
    meowSound.currentTime = 0;
    meowSound.play().catch(err => console.log("Ses çalma engellendi:", err));

    setTimeout(() => {
        gsap.to(meowSound, {
            volume: 0,
            duration: 0.15,
            onComplete: () => {
                meowSound.pause();
                meowSound.currentTime = 0;
                meowSound.volume = 1;
            }
        });
    }, 1000);
}

/**
 * DAĞINIK SIVI GLITCH GEÇİŞ PERDESİ MOTORU (KUSURSUZLAŞTIRILDI)
 */
function triggerFluidTransition(onCompleteCallback) {
    try {
        const overlay = document.querySelector('.fluid-glitch-overlay');
        const slices = document.querySelectorAll('.fluid-slice');
        
        if (!overlay || !slices || slices.length === 0) {
            onCompleteCallback();
            return;
        }

        overlay.classList.add('active');
        
        gsap.fromTo(slices, 
            { width: "0%" }, 
            { 
                width: "100%", 
                duration: 0.55, 
                stagger: 0.04, 
                ease: "power3.inOut",
                onComplete: () => {
                    onCompleteCallback();
                    
                    gsap.to(slices, {
                        width: "0%",
                        duration: 0.55,
                        stagger: 0.04,
                        ease: "power3.inOut",
                        delay: 0.15,
                        onComplete: () => {
                            overlay.classList.remove('active');
                        }
                    });
                }
            }
        );
    } catch (err) {
        console.error("Geçiş efekti hatası:", err);
        onCompleteCallback(); 
    }
}

/**
 * Kedi Tıklama ve Miyavlama Etkileşim Yönetimi (Sarsıntısız & Güvenlik Kilitli)
 */
function initCatInteractions() {
    const links = document.querySelectorAll('a');
    const buttons = document.querySelectorAll('button, .menu-toggle, .portfolio-item');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && !href.startsWith('#') && href !== 'javascript:void(0);') {
                e.preventDefault(); 
                playSingleMeow(); 

                // GÜVENLİK KİLİDİ (FAIL-SAFE): Tarayıcı veya GSAP donarsa, 600ms sonra kesin olarak yönlendir!
                let redirected = false;
                const forceRedirect = () => {
                    if (!redirected) {
                        redirected = true;
                        window.location.href = href;
                    }
                };
                const redirectTimeout = setTimeout(forceRedirect, 600);

                // Kedi zıplama efekti
                gsap.to(".cat-cursor-svg", { 
                    scale: 1.6, 
                    y: -15, 
                    rotate: 15, 
                    duration: 0.15, 
                    yoyo: true, 
                    repeat: 1, 
                    ease: "power2.out" 
                });

                if (link.classList.contains('logo-trigger')) {
                    clearTimeout(redirectTimeout); 
                    triggerFluidTransition(() => {
                        openCinemaReel();
                    });
                } 
                else if (link.classList.contains('about-trigger')) {
                    clearTimeout(redirectTimeout); 
                    const menuOverlay = document.querySelector('.mobile-menu-overlay');
                    if (menuOverlay && menuOverlay.classList.contains('active')) {
                        menuOverlay.classList.remove('active');
                        const menuLines = document.querySelectorAll('.menu-line');
                        gsap.to(menuLines[0], { rotate: 0, y: 0, duration: 0.3 });
                        gsap.to(menuLines[1], { rotate: 0, y: 0, duration: 0.3 });
                    }
                    
                    triggerFluidTransition(() => {
                        openAboutCinema();
                    });
                } else {
                    triggerFluidTransition(() => {
                        clearTimeout(redirectTimeout);
                        forceRedirect();
                    });
                }
            }
        });
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSingleMeow();
            gsap.to(".cat-cursor-svg", { 
                scale: 1.5, 
                rotate: -15, 
                duration: 0.12, 
                yoyo: true, 
                repeat: 1, 
                ease: "power2.out" 
            });
        });
    });
}

/**
 * Hakkımızda Sinema Modunu Açma
 */
function openAboutCinema() {
    const overlay = document.getElementById('aboutCinemaPanel');
    if (!overlay) return;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; 

    if (lenis) {
        lenis.stop();
    }

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(overlay.querySelector('.about-cinema-window'), 
        { scale: 0.92, y: 30 }, 
        { scale: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );

    const closeBtn = overlay.querySelector('.about-cinema-close');
    closeBtn.onclick = closeAboutCinema;
    overlay.onclick = (e) => {
        if (e.target === overlay) closeAboutCinema();
    };

    window.onkeydown = (e) => {
        if (e.key === "Escape") closeAboutCinema();
    };
}

/**
 * Hakkımızda Sinema Modunu Kapatma
 */
function closeAboutCinema() {
    const overlay = document.getElementById('aboutCinemaPanel');
    if (!overlay) return;

    gsap.to(overlay.querySelector('.about-cinema-window'), { 
        scale: 0.92, 
        y: 20, 
        duration: 0.4, 
        ease: "power3.in" 
    });

    gsap.to(overlay, { 
        opacity: 0, 
        duration: 0.4, 
        ease: "power2.in", 
        onComplete: () => {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; 
            
            if (lenis) {
                lenis.start();
            }
            
            window.onkeydown = null;
        }
    });
}

/**
 * Sinema Modu Arka Plan Motifleri Kaydırma Parallaks Motoru
 */
function initCinemaParallax() {
    const windowEl = document.querySelector('.about-cinema-window');
    if (!windowEl) return;

    windowEl.addEventListener('scroll', () => {
        const scrollTop = windowEl.scrollTop;
        
        const motif1 = document.querySelector('.cinema-motifs .motif-1');
        const motif2 = document.querySelector('.cinema-motifs .motif-2');
        const motif3 = document.querySelector('.cinema-motifs .motif-3');

        if (motif1) {
            gsap.set(motif1, { y: scrollTop * 0.15, rotation: scrollTop * 0.04 });
        }
        if (motif2) {
            gsap.set(motif2, { y: scrollTop * -0.1, rotation: scrollTop * -0.02 });
        }
        if (motif3) {
            gsap.set(motif3, { y: scrollTop * 0.12, rotation: scrollTop * 0.015 });
        }
    });
}

/**
 * INTERACTİVE HTML5 KAZI KAZAN SİSTEMİ MOTORU
 */
function initScratchCard() {
    const canvas = document.querySelector('.scratch-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight || 180;
        drawFoil();
    }

    function drawFoil() {
        ctx.globalCompositeOperation = 'source-over';
        
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#c5a880'); 
        grad.addColorStop(0.5, '#444447'); 
        grad.addColorStop(1, '#1c1c1f'); 
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SCRATCH TO REVEAL // KAZI KAZAN', canvas.width / 2, canvas.height / 2 + 4);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isDrawing = false;

    function scratch(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2); 
        ctx.fill();
    }

    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);

    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        scratch(e);
    });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
}

/**
 * SİNEMATİK REEL OYNATICI MOTORU (GSAP & AUDIO CONTROLS)
 */
function openCinemaReel() {
    const overlay = document.getElementById('cinemaReelPanel');
    const video = document.getElementById('cinemaReelVideo');
    if (!overlay) return;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; 

    if (lenis) lenis.stop(); 

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(overlay.querySelector('.cinema-reel-window'), 
        { scale: 0.92, y: 40 }, 
        { scale: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );

    if (video) {
        video.currentTime = 0;
        video.play().catch(err => console.log("Video otomatik oynatılamadı:", err));
    }

    const closeBtn = overlay.querySelector('.cinema-reel-close');
    closeBtn.onclick = closeCinemaReel;
    overlay.onclick = (e) => {
        if (e.target === overlay) closeCinemaReel();
    };

    window.onkeydown = (e) => {
        if (e.key === "Escape") closeCinemaReel();
    };
}

function closeCinemaReel() {
    const overlay = document.getElementById('cinemaReelPanel');
    const video = document.getElementById('cinemaReelVideo');
    if (!overlay) return;

    if (video) {
        video.pause();
    }

    gsap.to(overlay.querySelector('.cinema-reel-window'), { 
        scale: 0.92, 
        y: 30, 
        duration: 0.4, 
        ease: "power3.in" 
    });

    gsap.to(overlay, { 
        opacity: 0, 
        duration: 0.4, 
        ease: "power2.in", 
        onComplete: () => {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; 
            if (lenis) lenis.start(); 
            window.onkeydown = null;
        }
    });
}

/**
 * ANA SAYFA DİNAMİK 3D MOTİF ANİMASYONLARI
 */
function initHomepageMotifAnimations() {
    const heroSection = document.querySelector('.hero-section');
    const heroMotif = document.querySelector('.hero-section .section-motif');
    
    if (heroSection && heroMotif) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateY = (x / rect.width) * 45; 
            const rotateX = -(y / rect.height) * 45;
            
            gsap.to(heroMotif, {
                rotateY: rotateY,
                rotateX: rotateX,
                z: 60, 
                duration: 0.5,
                ease: "power2.out"
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroMotif, {
                rotateY: 0,
                rotateX: 0,
                z: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        gsap.to(heroMotif, {
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            rotationZ: 140,
            y: 80,
            ease: "none"
        });
    }

    const aboutSummaryMotif = document.querySelector('.about-summary .section-motif');
    if (aboutSummaryMotif) {
        gsap.to(aboutSummaryMotif, {
            scrollTrigger: {
                trigger: ".about-summary",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            y: -140,
            scale: 1.15,
            rotationY: 35, 
            ease: "none"
        });
    }

    const servicesMotif = document.querySelector('.services-summary .section-motif');
    if (servicesMotif) {
        gsap.to(servicesMotif, {
            scrollTrigger: {
                trigger: ".services-summary",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            rotationZ: 360, 
            rotationX: 140, 
            y: -100,
            ease: "none"
        });
    }

    const portfolioMotif = document.querySelector('.portfolio-summary .section-motif');
    if (portfolioMotif) {
        gsap.to(portfolioMotif, {
            scrollTrigger: {
                trigger: ".portfolio-summary",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            x: 130, 
            skewX: -20, 
            rotationY: -45, 
            ease: "none"
        });
    }

    const contactMotif = document.querySelector('.cta-contact-section .section-motif');
    if (contactMotif) {
        gsap.to(contactMotif, {
            scrollTrigger: {
                trigger: ".cta-contact-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            },
            rotationZ: -180, 
            scale: 1.3, 
            ease: "none"
        });
    }
}

/**
 * ==========================================================================
 * SAYFA SPESİFİK ETKİLEŞİM MOTORLARI (KREATİF SÜRPRİZLER)
 * ==========================================================================
 */
function initPageSpecificEngines() {
    // 1. PORTFOLYO: Manyetik 3D Ayna Eğilme Efekti (Magnetic Mirror)
    const portItems = document.querySelectorAll('.magnetic-portfolio-item');
    portItems.forEach(item => {
        const media = item.querySelector('.magnetic-media');
        
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotY = (x / rect.width) * 30;
            const rotX = -(y / rect.height) * 30;
            
            gsap.to(item, {
                rotateY: rotY,
                rotateX: rotX,
                z: 25,
                duration: 0.3,
                ease: "power2.out"
            });
            
            if (media) {
                gsap.to(media, {
                    x: x * 0.15,
                    y: y * 0.15,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotateY: 0,
                rotateX: 0,
                z: 0,
                duration: 0.6,
                ease: "power3.out"
            });
            if (media) {
                gsap.to(media, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out"
                });
            }
        });
    });

    // 2. BLOG: Matrix Decrypt (Siber Kod Çözme) Efekti
    const decryptTitles = document.querySelectorAll('.blog-decrypt-title');
    const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789_#@$*";
    
    decryptTitles.forEach(title => {
        const originalText = title.getAttribute('data-decrypt') || title.innerText;
        let isAnimating = false;
        
        title.addEventListener('mouseenter', () => {
            if (isAnimating) return;
            isAnimating = true;
            
            let iteration = 0;
            const interval = setInterval(() => {
                title.innerText = originalText.split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
                
                if (iteration >= originalText.length) {
                    clearInterval(interval);
                    isAnimating = false;
                }
                
                iteration += 1 / 3;
            }, 30);
        });
    });

    // 3. İLETİŞİM: Manyetik Gravite Çekim Düğümleri (Gravity Nodes)
    const gravityNodes = document.querySelectorAll('.gravity-node');
    gravityNodes.forEach(node => {
        const link = node.querySelector('.gravity-link');
        if (!link) return;
        
        node.addEventListener('mousemove', (e) => {
            const rect = node.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(link, {
                x: x * 0.4,
                y: y * 0.4,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        node.addEventListener('mouseleave', () => {
            gsap.to(link, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power3.out"
            });
        });
    });
}
