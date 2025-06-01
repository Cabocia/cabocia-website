// ===== Animation Controls =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Intersection Observer for scroll animations =====
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    // アニメーション要素の監視
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // 一度アニメーションしたら監視を停止
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素
    const animatedElements = document.querySelectorAll(`
        .section-header,
        .feature-card,
        .problem-card,
        .stat-card,
        .diff-card,
        .target-card,
        .plan-card,
        .benefit-card,
        .future-feature,
        .team-member,
        .value-item,
        .faq-item
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('animate-element');
        animationObserver.observe(el);
    });
    
    
    // ===== Staggered animations for grouped elements =====
    
    function addStaggeredAnimation(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delay}ms`;
        });
    }
    
    // グループ要素にスタガード効果を適用
    addStaggeredAnimation('.hero__stats .stat-card', 200);
    addStaggeredAnimation('.problem-cards .problem-card', 150);
    addStaggeredAnimation('.product__features .feature-card', 150);
    addStaggeredAnimation('.diff__features .diff-card', 200);
    addStaggeredAnimation('.pricing__table .plan-card', 100);
    addStaggeredAnimation('.future-feature-cards .future-feature', 150);
    addStaggeredAnimation('.team-members .team-member', 200);
    addStaggeredAnimation('.values-grid .value-item', 100);
    
    
    // ===== Floating elements animation =====
    
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // ランダムな遅延とデュレーションを設定
        const delay = Math.random() * 2;
        const duration = 3 + Math.random() * 2;
        
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${duration}s`;
        
        // マウスホバーで一時停止
        element.addEventListener('mouseenter', () => {
            element.style.animationPlayState = 'paused';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.animationPlayState = 'running';
        });
    });
    
    
    // ===== Typing animation for hero subtitle =====
    
    const heroSubtitle = document.querySelector('.hero__subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.borderRight = '2px solid var(--color-primary)';
        
        function typeText(text, element, speed = 50) {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    // カーソルを点滅させて最後に消す
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 2000);
                }
            }, speed);
        }
        
        // 少し遅延してからタイピングアニメーション開始
        setTimeout(() => {
            typeText(originalText, heroSubtitle, 30);
        }, 1000);
    }
    
    
    // ===== Parallax scrolling effects =====
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        // Hero background parallax
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPosition = `center ${rate}px`;
        }
        
        // Floating elements parallax
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // パフォーマンスを考慮してスクロールイベントを制限
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(requestParallaxUpdate);
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 16); // 60fps制限
        }
    });
    
    
    // ===== Card hover effects =====
    
    const cards = document.querySelectorAll(`
        .feature-card,
        .problem-card,
        .diff-card,
        .target-card,
        .plan-card,
        .benefit-card,
        .future-feature,
        .team-member
    `);
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // グロー効果のための疑似要素を作成
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            glow.style.cssText = `
                position: absolute;
                top: ${y - 50}px;
                left: ${x - 50}px;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(255, 140, 0, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                transition: opacity 0.3s ease;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(glow);
            
            // マウスムーブでグローを追従
            const handleMouseMove = (e) => {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                glow.style.top = `${y - 50}px`;
                glow.style.left = `${x - 50}px`;
            };
            
            this.addEventListener('mousemove', handleMouseMove);
            
            // マウスリーブ時にクリーンアップ
            this.addEventListener('mouseleave', function() {
                if (glow.parentNode) {
                    glow.style.opacity = '0';
                    setTimeout(() => {
                        if (glow.parentNode) {
                            glow.parentNode.removeChild(glow);
                        }
                    }, 300);
                }
                this.removeEventListener('mousemove', handleMouseMove);
            }, { once: true });
        });
    });
    
    
    // ===== Progress bar for scroll =====
    
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
    
    // ===== Button click ripple effect =====
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                top: ${y}px;
                left: ${x}px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    
    // ===== Number counting animation =====
    
    function animateNumber(element, targetNumber, duration = 2000, suffix = '') {
        const startNumber = 0;
        const increment = targetNumber / (duration / 16);
        let currentNumber = startNumber;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentNumber) + suffix;
        }, 16);
    }
    
    // 統計カードの数値アニメーション
    const statNumbers = document.querySelectorAll('.stat-card__number');
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const targetText = entry.target.textContent;
                const targetNumber = parseInt(targetText);
                const suffix = targetText.replace(/\d/g, '');
                
                entry.target.dataset.animated = 'true';
                animateNumber(entry.target, targetNumber, 2000, suffix);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => numberObserver.observe(num));
    
    
    // ===== CSS Animations Definition =====
    
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .floating-element {
            animation: float 3s ease-in-out infinite;
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
            .animate-element,
            .floating-element,
            * {
                animation: none !important;
                transition: none !important;
            }
            
            .animate-element {
                opacity: 1;
                transform: none;
            }
        }
    `;
    
    document.head.appendChild(animationStyles);
    
    
    // ===== Performance monitoring =====
    
    let animationFrameId;
    
    function monitorPerformance() {
        const fps = performance.now();
        
        // 60fps以下の場合はアニメーションを簡素化
        if (fps < 16) {
            document.body.classList.add('reduced-animations');
        }
        
        animationFrameId = requestAnimationFrame(monitorPerformance);
    }
    
    // パフォーマンス監視を開始
    monitorPerformance();
    
    // ページを離れる時にクリーンアップ
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
    
    console.log('Animations initialized successfully');
});