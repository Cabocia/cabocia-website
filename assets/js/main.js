// ===== Main JavaScript =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ナビゲーション機能 =====
    
    // モバイルメニューの開閉
    const mobileToggle = document.querySelector('.nav__mobile-toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--open');
            
            // ハンバーガーメニューのアニメーション
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('nav__menu--open')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
    }
    
    // スムーススクロール
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                if (navMenu && navMenu.classList.contains('nav__menu--open')) {
                    navMenu.classList.remove('nav__menu--open');
                    const spans = mobileToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = '';
                        span.style.opacity = '';
                    });
                }
            }
        });
    });
    
    // ヘッダーのスクロール時スタイル変更
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
        
        // スクロール方向による表示/非表示（オプション）
        if (scrollTop > lastScrollTop && scrollTop > 500) {
            // 下にスクロール
            header.style.transform = 'translateY(-100%)';
        } else {
            // 上にスクロール
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    
    // ===== FAQ アコーディオン =====
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        const answer = item.querySelector('.faq-item__answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('faq-item--open');
                
                // 他のFAQを閉じる
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('faq-item--open');
                        const otherAnswer = otherItem.querySelector('.faq-item__answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });
                
                // 現在のFAQを開閉
                if (isOpen) {
                    item.classList.remove('faq-item--open');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('faq-item--open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
    
    
    // ===== デモチャット機能 =====
    
    const demoQuestions = [
        '「国ごとのユーザー数を教えて」',
        '「直近3ヶ月で売上が伸びた商品は？」',
        '「新規獲得コストが高騰しているチャネルは？」',
        '「今月の広告の費用対効果を比較して」',
        '「昨年同時期に比べて売上が落ちた要因は？」'
    ];
    
    const demoAnswers = [
        '日本のユーザー数が最も多く、続いてアメリカ、その他の順となっています。デバイス別では、日本ではモバイルが60%、アメリカではデスクトップが多い傾向です。',
        '「健康食品カテゴリ」で特にプロテイン関連商品の売上が40%増加しています。要因としては、健康志向の高まりと新商品の投入が影響しています。',
        'Instagram広告の新規獲得コストが先月比で25%上昇しています。競合他社の広告出稿増加が主な要因と分析されます。',
        'Google広告のROASが3.2倍で最も効率的です。一方、Facebook広告は2.1倍となっており、クリエイティブの見直しを推奨します。',
        '主な要因は「季節性の変化」と「競合の新商品投入」です。特に20-30代女性層の流出が顕著で、マーケティング戦略の見直しが必要です。'
    ];
    
    let currentQuestionIndex = 0;
    const demoQuestionElement = document.getElementById('demo-question');
    const demoAnswerElement = document.getElementById('demo-answer');
    
    if (demoQuestionElement && demoAnswerElement) {
        function updateDemoChat() {
            // フェードアウト
            demoQuestionElement.style.opacity = '0';
            demoAnswerElement.style.opacity = '0';
            
            setTimeout(() => {
                // テキスト更新
                demoQuestionElement.textContent = demoQuestions[currentQuestionIndex];
                demoAnswerElement.textContent = demoAnswers[currentQuestionIndex];
                
                // フェードイン
                demoQuestionElement.style.opacity = '1';
                
                // 答えは少し遅れて表示
                setTimeout(() => {
                    demoAnswerElement.style.opacity = '1';
                }, 500);
                
                // 次の質問へ
                currentQuestionIndex = (currentQuestionIndex + 1) % demoQuestions.length;
            }, 300);
        }
        
        // 初期設定
        demoQuestionElement.style.transition = 'opacity 0.3s ease';
        demoAnswerElement.style.transition = 'opacity 0.3s ease';
        
        // 5秒ごとに質問を変更
        setInterval(updateDemoChat, 5000);
    }
    
    
    // ===== 質問例のインタラクション =====
    
    const questionExamples = document.querySelectorAll('.question-example');
    
    questionExamples.forEach(example => {
        example.addEventListener('click', function() {
            const questionText = this.textContent.replace(/"/g, '');
            
            // デモチャットに質問を設定
            if (demoQuestionElement && demoAnswerElement) {
                demoQuestionElement.style.opacity = '0';
                setTimeout(() => {
                    demoQuestionElement.textContent = `"${questionText}"`;
                    demoQuestionElement.style.opacity = '1';
                    
                    // サンプル回答を表示
                    setTimeout(() => {
                        demoAnswerElement.style.opacity = '0';
                        setTimeout(() => {
                            demoAnswerElement.textContent = '分析中です...しばらくお待ちください。';
                            demoAnswerElement.style.opacity = '1';
                            
                            // 実際の分析結果風の表示
                            setTimeout(() => {
                                demoAnswerElement.style.opacity = '0';
                                setTimeout(() => {
                                    demoAnswerElement.textContent = 'ご質問いただいた内容について、現在のデータから分析した結果をお伝えします。詳細な分析結果は実際のシステムでご確認いただけます。';
                                    demoAnswerElement.style.opacity = '1';
                                }, 300);
                            }, 2000);
                        }, 300);
                    }, 1000);
                }, 300);
            }
            
            // ビジュアルフィードバック
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    
    // ===== 統計カードのカウントアップアニメーション =====
    
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '%';
        }, 16);
    }
    
    // Intersection Observerを使用してビューポートに入った時にアニメーション開始
    const statCards = document.querySelectorAll('.stat-card__number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const targetValue = parseInt(entry.target.textContent);
                entry.target.classList.add('animated');
                animateCounter(entry.target, targetValue);
            }
        });
    }, observerOptions);
    
    statCards.forEach(card => {
        statsObserver.observe(card);
    });
    
    
    // ===== プラン選択のインタラクション =====
    
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        card.addEventListener('click', function() {
            // 他のカードの選択状態を解除
            planCards.forEach(otherCard => {
                otherCard.classList.remove('plan-card--selected');
            });
            
            // 現在のカードを選択状態に
            this.classList.add('plan-card--selected');
            
            // お問い合わせフォームに選択したプランを設定
            const planName = this.querySelector('.plan-card__name').textContent;
            const inquiryTypeSelect = document.getElementById('inquiry-type');
            if (inquiryTypeSelect) {
                inquiryTypeSelect.value = 'consultation';
            }
            
            const messageTextarea = document.getElementById('message');
            if (messageTextarea && !messageTextarea.value) {
                messageTextarea.value = `${planName}プランについて詳しく知りたいです。`;
            }
            
            // お問い合わせセクションにスムーススクロール
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ===== ローディング状態の管理 =====
    
    function showLoading(button) {
        const originalText = button.textContent;
        button.textContent = '送信中...';
        button.disabled = true;
        button.style.opacity = '0.7';
        return originalText;
    }
    
    function hideLoading(button, originalText) {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }
    
    
    // ===== 成功・エラーメッセージの表示 =====
    
    function showMessage(message, type = 'success') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background-color: #4caf50;' : 'background-color: #f44336;'}
        `;
        
        document.body.appendChild(messageEl);
        
        // アニメーション
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // 自動削除
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 5000);
    }
    
    
    // ===== ユーティリティ関数 =====
    
    // デバウンス関数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // スロットル関数
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // スクロールイベントをスロットル化
    const throttledScrollHandler = throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // パララックス効果（オプション）
        const heroVisual = document.querySelector('.hero__visual');
        if (heroVisual && scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    }, 16);
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    
    // ===== パフォーマンス最適化 =====
    
    // 画像の遅延読み込み
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    
    // ===== アクセシビリティ強化 =====
    
    // キーボードナビゲーション
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // モバイルメニューを閉じる
            if (navMenu && navMenu.classList.contains('nav__menu--open')) {
                navMenu.classList.remove('nav__menu--open');
                const spans = mobileToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        }
    });
    
    // フォーカス管理
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElementsArray = Array.from(document.querySelectorAll(focusableElements));
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const firstFocusableElement = focusableElementsArray[0];
            const lastFocusableElement = focusableElementsArray[focusableElementsArray.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    
    // ===== 初期化完了ログ =====
    console.log('Cabocia website initialized successfully');
});