/**
 * Value Proposition Section Animation Controller
 * カードアニメーション、コンテンツの順次表示、インタラクション効果を管理
 */

class ValuePropositionController {
  constructor() {
    this.section = document.querySelector('.value-proposition');
    this.targetCards = document.querySelectorAll('.target-card');
    this.sectionTitle = document.querySelector('.value-proposition .section-title');
    
    // アニメーション状態
    this.hasAnimated = {
      title: false,
      cards: false
    };
    
    // アニメーション設定
    this.animationConfig = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px',
      cardDelay: 300,
      contentDelay: 600
    };
    
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.setupCardInteractions();
    this.setupAccessibility();
    this.setupPerformanceOptimizations();
  }
  
  /**
   * Intersection Observerの設定
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: this.animationConfig.threshold,
      rootMargin: this.animationConfig.rootMargin
    };
    
    // セクションタイトルの監視
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.title) {
          this.animateTitle();
          this.hasAnimated.title = true;
        }
      });
    }, observerOptions);
    
    if (this.sectionTitle) {
      titleObserver.observe(this.sectionTitle);
    }
    
    // カードアニメーションの監視
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.cards) {
          this.animateCards();
          this.hasAnimated.cards = true;
        }
      });
    }, observerOptions);
    
    if (this.section) {
      cardObserver.observe(this.section);
    }
    
    // 個別カードのコンテンツアニメーション監視
    const contentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCardContent(entry.target);
          contentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    
    this.targetCards.forEach(card => {
      contentObserver.observe(card);
    });
  }
  
  /**
   * タイトルアニメーション
   */
  // animateTitleメソッドを以下の内容に置き換え
  animateTitle() {
    if (!this.sectionTitle) return;

    console.log('Animating value proposition title with <br> support');

    // 1. h2要素の元々のHTMLを取得
    const originalHTML = this.sectionTitle.innerHTML;
    // 2. 元のHTMLを空にする
    this.sectionTitle.innerHTML = '';
    
    // 3. テキストノードと<br>タグに分割
    //    元のHTMLを<br>タグで分割し、配列にする
    const parts = originalHTML.split(/<br\s*\/?>/i);

    parts.forEach((part, index) => {
      // 4. テキスト部分を1文字ずつspanで囲む
      const chars = part.split('');
      chars.forEach(char => {
        const span = document.createElement('span');
        if (char === ' ') {
          // スペースの場合は、そのままスペースのテキストノードを追加
          this.sectionTitle.appendChild(document.createTextNode(' '));
        } else {
          // 文字の場合はspanで囲む
          span.className = 'title-char';
          span.textContent = char;
          span.style.opacity = '0';
          span.style.transform = 'translateY(20px)';
          span.style.display = 'inline-block'; // アニメーションのために必要
          this.sectionTitle.appendChild(span);
        }
      });

      // 5. 最後の部分以外には、分割に使った<br>タグを再度追加する
      if (index < parts.length - 1) {
        this.sectionTitle.appendChild(document.createElement('br'));
      }
    });

    // 6. 文字を順次アニメーション表示
    const spanChars = this.sectionTitle.querySelectorAll('.title-char');
    spanChars.forEach((char, index) => {
      setTimeout(() => {
        char.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        char.style.opacity = '1';
        char.style.transform = 'translateY(0)';
      }, index * 50); // 1文字あたり50msの遅延
    });
  }
  
  /**
   * カードアニメーション
   */
  animateCards() {
    console.log('Animating value proposition cards');
    
    this.targetCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
        
        // アイコンの特別アニメーション
        this.animateCardIcon(card, index);
      }, index * this.animationConfig.cardDelay);
    });
  }
  
  /**
   * カードアイコンのアニメーション
   */
  animateCardIcon(card, index) {
    const icon = card.querySelector('.target-card__icon');
    if (!icon) return;
    
    // アイコンにスケールアニメーションを追加
    icon.style.transform = 'scale(0)';
    icon.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    setTimeout(() => {
      icon.style.transform = 'scale(1)';
    }, 200);
    
    // パルス効果
    setTimeout(() => {
      this.addPulseEffect(icon);
    }, 800);
  }
  
  /**
   * カードコンテンツのアニメーション
   */
  animateCardContent(card) {
    if (card.classList.contains('animate-content')) return;
    
    console.log('Animating card content');
    
    card.classList.add('animate-content');
    
    // 問題と解決策のリストアイテムを順次アニメーション
    const problemItems = card.querySelectorAll('.target-card__problems li');
    const solutionItems = card.querySelectorAll('.target-card__solutions li');
    
    problemItems.forEach((item, index) => {
      this.animateListItem(item, index * 100);
    });
    
    solutionItems.forEach((item, index) => {
      this.animateListItem(item, (index * 100) + 300);
    });
  }
  
  /**
   * リストアイテムのアニメーション
   */
  animateListItem(item, delay) {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease-out';
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }, delay);
  }
  
  /**
   * パルス効果の追加
   */
  addPulseEffect(element) {
    const pulseKeyframes = [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.1)', opacity: 0.8 },
      { transform: 'scale(1)', opacity: 1 }
    ];
    
    const pulseOptions = {
      duration: 800,
      easing: 'ease-in-out'
    };
    
    if (element.animate) {
      element.animate(pulseKeyframes, pulseOptions);
    }
  }
  
  /**
   * カードインタラクションの設定
   */
  setupCardInteractions() {
    this.targetCards.forEach((card, index) => {
      // ホバー効果
      card.addEventListener('mouseenter', () => {
        this.handleCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.handleCardHover(card, false);
      });
      
      // フォーカス効果（キーボードナビゲーション用）
      card.addEventListener('focus', () => {
        this.handleCardFocus(card, true);
      });
      
      card.addEventListener('blur', () => {
        this.handleCardFocus(card, false);
      });
      
      // タッチデバイス対応
      card.addEventListener('touchstart', () => {
        this.handleCardTouch(card);
      }, { passive: true });
    });
  }
  
  /**
   * カードホバー処理
   */
  handleCardHover(card, isHovering) {
    const icon = card.querySelector('.target-card__icon');
    const problems = card.querySelector('.target-card__problems');
    const solutions = card.querySelector('.target-card__solutions');
    
    if (isHovering) {
      // アイコンのアニメーション停止
      if (icon) {
        icon.style.animationPlayState = 'paused';
      }
      
      // コンテンツエリアの強調
      if (problems) {
        problems.style.transform = 'scale(1.02)';
      }
      if (solutions) {
        solutions.style.transform = 'scale(1.02)';
      }
      
      // 他のカードを薄暗くする
      this.dimOtherCards(card);
    } else {
      // 通常状態に戻す
      if (icon) {
        icon.style.animationPlayState = 'running';
      }
      
      if (problems) {
        problems.style.transform = '';
      }
      if (solutions) {
        solutions.style.transform = '';
      }
      
      this.restoreOtherCards();
    }
  }
  
  /**
   * カードフォーカス処理
   */
  handleCardFocus(card, isFocused) {
    if (isFocused) {
      card.style.outline = '2px solid var(--color-primary)';
      card.style.outlineOffset = '4px';
    } else {
      card.style.outline = '';
      card.style.outlineOffset = '';
    }
  }
  
  /**
   * カードタッチ処理
   */
  handleCardTouch(card) {
    // タッチデバイスでのフィードバック
    this.addPulseEffect(card);
  }
  
  /**
   * 他のカードを薄暗くする
   */
  dimOtherCards(activeCard) {
    this.targetCards.forEach(card => {
      if (card !== activeCard) {
        card.style.opacity = '0.6';
        card.style.filter = 'blur(1px)';
      }
    });
  }
  
  /**
   * カードの状態を復元
   */
  restoreOtherCards() {
    this.targetCards.forEach(card => {
      card.style.opacity = '';
      card.style.filter = '';
    });
  }
  
  /**
   * アクセシビリティの設定
   */
  setupAccessibility() {
    // カードにtabindexを追加（キーボードナビゲーション用）
    this.targetCards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `価値提案 ${index + 1}`);
      
      // キーボードでの操作
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardTouch(card);
        }
      });
    });
    
    // スクリーンリーダー用の説明を追加
    if (this.section) {
      this.section.setAttribute('aria-label', 'ホウジンAIの価値提案');
    }
  }
  
  /**
   * パフォーマンス最適化
   */
  setupPerformanceOptimizations() {
    // will-changeプロパティを動的に設定
    this.targetCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.willChange = 'transform, box-shadow';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.willChange = 'auto';
      });
    });
    
    // Intersection Observerのクリーンアップ
    this.observers = [];
  }
  
  /**
   * レスポンシブ対応
   */
  handleResize() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      this.optimizeForMobile();
    } else {
      this.optimizeForDesktop();
    }
  }
  
  /**
   * モバイル最適化
   */
  optimizeForMobile() {
    this.targetCards.forEach(card => {
      // モバイルでは hover 効果を簡略化
      card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    });
  }
  
  /**
   * デスクトップ最適化
   */
  optimizeForDesktop() {
    this.targetCards.forEach(card => {
      card.style.transition = '';
    });
  }
  
  /**
   * アニメーション状態のリセット
   */
  resetAnimations() {
    this.hasAnimated = {
      title: false,
      cards: false
    };
    
    // タイトルのリセット
    if (this.sectionTitle) {
      this.sectionTitle.style.opacity = '';
      this.sectionTitle.style.transform = '';
    }
    
    // カードのリセット
    this.targetCards.forEach(card => {
      card.classList.remove('animate-in', 'animate-content');
      card.style.opacity = '';
      card.style.transform = '';
      
      // リストアイテムのリセット
      const listItems = card.querySelectorAll('.target-card__problems li, .target-card__solutions li');
      listItems.forEach(item => {
        item.style.opacity = '';
        item.style.transform = '';
      });
    });
  }
  
  /**
   * デバッグ用：現在の状態を取得
   */
  getState() {
    return {
      hasAnimated: this.hasAnimated,
      targetCards: this.targetCards.length,
      animationConfig: this.animationConfig
    };
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    console.log('Destroying ValuePropositionController');
    
    // Observerのクリーンアップ
    if (this.observers) {
      this.observers.forEach(observer => observer.disconnect());
    }
    
    // イベントリスナーの削除
    this.targetCards.forEach(card => {
      card.style.willChange = 'auto';
    });
  }
}

/**
 * 初期化とイベント設定
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing ValuePropositionController');
  
  // Value Proposition Controller を初期化
  const valuePropositionController = new ValuePropositionController();
  
  // グローバルに参照可能にする（デバッグ用）
  window.valuePropositionController = valuePropositionController;
  
  // 初期状態をログ出力
  console.log('Value Proposition Controller State:', valuePropositionController.getState());
  
  // リサイズイベント
  window.addEventListener('resize', () => {
    valuePropositionController.handleResize();
  }, { passive: true });
});

/**
 * エクスポート（モジュール対応）
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ValuePropositionController;
}