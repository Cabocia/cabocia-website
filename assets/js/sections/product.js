/**
 * Product Section Animation Controller
 * カードアニメーション、スクロール検知、画像遅延読み込みを管理
 */

class ProductController {
  constructor() {
    this.section = document.querySelector('.product');
    this.challengeCards = document.querySelectorAll('.challenge-card');
    this.solutionCards = document.querySelectorAll('.solution-card');
    this.comparisonCards = document.querySelectorAll('.comparison-card');
    this.images = document.querySelectorAll('.challenge-card__img, .solution-card__img');
    
    // アニメーション状態
    this.hasAnimated = {
      challenges: false,
      solutions: false,
      comparison: false
    };
    
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.setupImageLoading();
    this.setupImagePlaceholders();
    this.preloadCriticalImages();
  }
  
  /**
   * Intersection Observerの設定
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };
    
    // チャレンジカードの監視
    const challengeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.challenges) {
          this.animateChallengeCards();
          this.hasAnimated.challenges = true;
        }
      });
    }, observerOptions);
    
    const challengesSection = document.querySelector('.challenges-section');
    if (challengesSection) {
      challengeObserver.observe(challengesSection);
    }
    
    // ソリューションカードの監視
    const solutionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.solutions) {
          this.animateSolutionCards();
          this.hasAnimated.solutions = true;
        }
      });
    }, observerOptions);
    
    const solutionsSection = document.querySelector('.solutions-section');
    if (solutionsSection) {
      solutionObserver.observe(solutionsSection);
    }
    
    // 比較セクションの監視
    const comparisonObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.comparison) {
          this.animateComparisonCards();
          this.hasAnimated.comparison = true;
        }
      });
    }, observerOptions);
    
    const comparisonSection = document.querySelector('.comparison-section');
    if (comparisonSection) {
      comparisonObserver.observe(comparisonSection);
    }
  }
  
  /**
   * チャレンジカードのアニメーション
   */
  animateChallengeCards() {
    console.log('Animating challenge cards');
    
    this.challengeCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.classList.add('card-animate-in');
      }, index * 150);
    });
  }
  
  /**
   * ソリューションカードのアニメーション
   */
  animateSolutionCards() {
    console.log('Animating solution cards');
    
    this.solutionCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.classList.add('card-animate-in');
      }, index * 150);
    });
  }
  
  /**
   * 比較カードのアニメーション
   */
  animateComparisonCards() {
    console.log('Animating comparison cards');
    
    this.comparisonCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.classList.add('card-animate-in');
      }, index * 200);
    });
  }
  
  /**
   * 画像の遅延読み込み設定
   */
  setupImageLoading() {
    const imageObserverOptions = {
      threshold: 0.1,
      rootMargin: '50px 0px 50px 0px'
    };
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          imageObserver.unobserve(img);
        }
      });
    }, imageObserverOptions);
    
    this.images.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
  
  /**
   * 画像読み込み処理
   */
  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;
    
    console.log('Loading image:', src);
    
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      console.log('Image loaded successfully:', src);
    };
    
    tempImg.onerror = () => {
      console.log('Failed to load image:', src);
      // フォールバック画像を設定
      this.setFallbackImage(img);
    };
    
    tempImg.src = src;
  }
  
  /**
   * フォールバック画像の設定
   */
  setFallbackImage(img) {
    // プレースホルダー画像のパターンを生成
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 300;
    
    // グラデーション背景
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);
    
    // テキスト描画
    ctx.fillStyle = '#999';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('画像を読み込めませんでした', 200, 150);
    
    img.src = canvas.toDataURL();
    img.classList.add('loaded');
  }
  
  /**
   * 画像プレースホルダーの設定
   */
  setupImagePlaceholders() {
    this.images.forEach(img => {
      if (!img.src && !img.dataset.src) {
        // デフォルトのプレースホルダー画像を設定
        const category = this.getImageCategory(img);
        img.dataset.src = this.getPlaceholderImageUrl(category);
      }
    });
  }
  
  /**
   * 画像カテゴリを取得
   */
  getImageCategory(img) {
    const card = img.closest('.challenge-card, .solution-card');
    if (!card) return 'default';
    
    const challengeType = card.dataset.challenge;
    const solutionType = card.dataset.solution;
    
    return challengeType || solutionType || 'default';
  }
  
  /**
   * プレースホルダー画像URLを取得
   */
  getPlaceholderImageUrl(category) {
    const placeholders = {
      'data': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      'skill': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      'efficiency': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      'integration': 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop',
      'ai': 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=300&fit=crop',
      'dashboard': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      'default': 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=300&fit=crop'
    };
    
    return placeholders[category] || placeholders.default;
  }
  
  /**
   * 重要な画像の事前読み込み
   */
  preloadCriticalImages() {
    const criticalImages = [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
  
  /**
   * カードホバーエフェクトの強化
   */
  setupCardInteractions() {
    const allCards = [...this.challengeCards, ...this.solutionCards, ...this.comparisonCards];
    
    allCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.handleCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.handleCardHover(card, false);
      });
      
      // タッチデバイス対応
      card.addEventListener('touchstart', () => {
        this.handleCardHover(card, true);
      }, { passive: true });
    });
  }
  
  /**
   * カードホバー処理
   */
  handleCardHover(card, isHovering) {
    const img = card.querySelector('.challenge-card__img, .solution-card__img');
    
    if (img) {
      if (isHovering) {
        img.style.transform = 'scale(1.05)';
      } else {
        img.style.transform = 'scale(1)';
      }
    }
    
    // 周辺のカードにサブトル効果
    if (isHovering) {
      this.dimOtherCards(card);
    } else {
      this.restoreOtherCards();
    }
  }
  
  /**
   * 他のカードを薄暗くする
   */
  dimOtherCards(activeCard) {
    const allCards = [...this.challengeCards, ...this.solutionCards, ...this.comparisonCards];
    
    allCards.forEach(card => {
      if (card !== activeCard) {
        card.style.opacity = '0.7';
        card.style.transform = 'scale(0.98)';
      }
    });
  }
  
  /**
   * カードの状態を復元
   */
  restoreOtherCards() {
    const allCards = [...this.challengeCards, ...this.solutionCards, ...this.comparisonCards];
    
    allCards.forEach(card => {
      card.style.opacity = '';
      card.style.transform = '';
    });
  }
  
  /**
   * パフォーマンス監視
   */
  measurePerformance() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'measure' && entry.name.includes('product-section')) {
          console.log(`${entry.name}: ${entry.duration}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    // アニメーション開始時間を記録
    performance.mark('product-section-start');
  }
  
  /**
   * アニメーション状態をリセット
   */
  resetAnimations() {
    this.hasAnimated = {
      challenges: false,
      solutions: false,
      comparison: false
    };
    
    const allCards = [...this.challengeCards, ...this.solutionCards, ...this.comparisonCards];
    allCards.forEach(card => {
      card.classList.remove('card-animate-in');
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
    });
  }
  
  /**
   * レスポンシブ対応
   */
  handleResize() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    console.log(`Product section resize: mobile=${isMobile}, tablet=${isTablet}`);
    
    // モバイルでは一部のアニメーションを簡略化
    if (isMobile) {
      this.simplifyAnimations();
    } else {
      this.restoreAnimations();
    }
  }
  
  /**
   * モバイル用アニメーション簡略化
   */
  simplifyAnimations() {
    const allCards = [...this.challengeCards, ...this.solutionCards, ...this.comparisonCards];
    allCards.forEach(card => {
      card.style.transition = 'opacity 0.3s ease-out';
    });
  }
  
  /**
   * アニメーション復元
   */
  restoreAnimations() {
    const allCards = [...this.challengeCards, ...this.solutionCards, ...this.comparisonCards];
    allCards.forEach(card => {
      card.style.transition = '';
    });
  }
  
  /**
   * デバッグ用：現在の状態を取得
   */
  getState() {
    return {
      hasAnimated: this.hasAnimated,
      challengeCards: this.challengeCards.length,
      solutionCards: this.solutionCards.length,
      comparisonCards: this.comparisonCards.length,
      images: this.images.length,
      loadedImages: document.querySelectorAll('.challenge-card__img.loaded, .solution-card__img.loaded').length
    };
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    console.log('Destroying ProductController');
    
    // イベントリスナーの削除
    window.removeEventListener('resize', this.handleResize);
    
    // パフォーマンス監視の停止
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

/**
 * 初期化とイベント設定
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing ProductController');
  
  // Product Controller を初期化
  const productController = new ProductController();
  
  // グローバルに参照可能にする（デバッグ用）
  window.productController = productController;
  
  // 初期状態をログ出力
  console.log('Product Controller State:', productController.getState());
  
  // リサイズイベント
  window.addEventListener('resize', () => {
    productController.handleResize();
  }, { passive: true });
  
  // カードインタラクションの設定
  productController.setupCardInteractions();
  
  // パフォーマンス監視開始
  productController.measurePerformance();
});

/**
 * エクスポート（モジュール対応）
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductController;
}