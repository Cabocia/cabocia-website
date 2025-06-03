/**
 * Differentiation Section Animation Controller
 * カードアニメーション、インタラクティブ要素、スクロール検知を管理
 */

class DifferentiationController {
  constructor() {
    this.section = document.querySelector('.differentiation');
    this.diffCards = document.querySelectorAll('.diff-card');
    this.comparisonTable = document.querySelector('.comparison-table');
    this.contextCircles = document.querySelectorAll('.context-circle');
    this.flowSteps = document.querySelectorAll('.flow-step');
    this.chatBubbles = document.querySelectorAll('.chat-bubble');
    
    // アニメーション状態
    this.hasAnimated = {
      cards: false,
      table: false
    };
    
    // パララックス用の初期状態を保存
    this.initialTransforms = new Map();
    
    this.init();
  }
  
  init() {
    this.saveInitialTransforms();
    this.setupIntersectionObserver();
    this.setupCardInteractions();
    this.setupChatDemo();
    this.setupTableAnimation();
    this.setupParallaxEffects();
    this.setupIntegrationServices();
  }
  
  /**
   * 初期のtransform状態を保存
   */
  saveInitialTransforms() {
    const bgElements = this.section?.querySelectorAll('.context-circle, .flow-step') || [];
    bgElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const transform = computedStyle.transform;
      this.initialTransforms.set(element, transform === 'none' ? '' : transform);
    });
  }
  
  /**
   * Intersection Observerの設定
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };
    
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
    
    // 比較表の監視
    const tableObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated.table) {
          this.animateTable();
          this.hasAnimated.table = true;
        }
      });
    }, observerOptions);
    
    if (this.comparisonTable) {
      tableObserver.observe(this.comparisonTable);
    }
  }
  
  /**
   * カードアニメーション
   */
  animateCards() {
    console.log('Animating differentiation cards');
    
    this.diffCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-in');
      }, index * 300);
    });
  }
  
  /**
   * テーブルアニメーション
   */
  animateTable() {
    console.log('Animating comparison table');
    
    const rows = this.comparisonTable.querySelectorAll('.comparison-table__row');
    const header = this.comparisonTable.querySelector('.comparison-table__header');
    
    // ヘッダーを最初にアニメーション
    if (header) {
      header.style.opacity = '0';
      header.style.transform = 'translateY(-20px)';
      header.style.transition = 'all 0.5s ease-out';
      
      setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
      }, 100);
    }
    
    // 行を順次アニメーション
    rows.forEach((row, index) => {
      row.style.opacity = '0';
      row.style.transform = 'translateX(-20px)';
      row.style.transition = 'all 0.5s ease-out';
      
      setTimeout(() => {
        row.style.opacity = '1';
        row.style.transform = 'translateX(0)';
      }, 200 + (index * 100));
    });
  }
  
  /**
   * カードインタラクション設定
   */
  setupCardInteractions() {
    this.diffCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        this.handleCardHover(card, index, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.handleCardHover(card, index, false);
      });
      
      // タッチデバイス対応
      card.addEventListener('touchstart', () => {
        this.handleCardHover(card, index, true);
      }, { passive: true });
    });
  }
  
  /**
   * カードホバー処理
   */
  handleCardHover(card, index, isHovering) {
    const visual = card.querySelector('.diff-card__visual');
    const number = card.querySelector('.diff-card__number');
    
    if (isHovering) {
      // カード全体の強調
      card.style.transform = 'translateY(-10px) scale(1.02)';
      card.style.boxShadow = '0 25px 50px rgba(255, 140, 0, 0.3)';
      
      // 番号の強調
      if (number) {
        number.style.transform = 'scale(1.1)';
      }
      
      // ビジュアル要素の強調
      this.enhanceVisual(visual, index);
      
      // 他のカードを薄暗くする
      this.dimOtherCards(card);
    } else {
      // 通常状態に戻す
      card.style.transform = '';
      card.style.boxShadow = '';
      
      if (number) {
        number.style.transform = '';
      }
      
      this.resetVisual(visual, index);
      this.restoreOtherCards();
    }
  }
  
  /**
   * ビジュアル要素の強調
   */
  enhanceVisual(visual, cardIndex) {
    if (!visual) return;
    
    switch (cardIndex) {
      case 0: // Context visualization
        const circles = visual.querySelectorAll('.context-circle');
        circles.forEach(circle => {
          const currentTransform = this.initialTransforms.get(circle) || '';
          circle.style.transform = currentTransform + ' scale(1.1)';
          circle.style.animationDuration = '3s';
        });
        break;
        
      case 1: // Integration flow
        const steps = visual.querySelectorAll('.flow-step');
        steps.forEach((step, index) => {
          setTimeout(() => {
            const currentTransform = this.initialTransforms.get(step) || '';
            step.style.transform = currentTransform + ' translateY(-5px) scale(1.05)';
            step.style.boxShadow = '0 10px 25px rgba(255, 140, 0, 0.4)';
          }, index * 100);
        });
        break;
        
      case 2: // Chat demo
        const bubbles = visual.querySelectorAll('.chat-bubble');
        bubbles.forEach((bubble, index) => {
          setTimeout(() => {
            bubble.style.transform = 'scale(1.05)';
            bubble.style.boxShadow = '0 5px 15px rgba(255, 140, 0, 0.3)';
          }, index * 150);
        });
        break;
        
      case 3: // Integration services (04番カード - ビジュアルなし)
        // 04番カードはビジュアル要素がないので何もしない
        break;
    }
  }
  
  /**
   * ビジュアル要素のリセット
   */
  resetVisual(visual, cardIndex) {
    if (!visual) return;
    
    switch (cardIndex) {
      case 0: // Context visualization
        const circles = visual.querySelectorAll('.context-circle');
        circles.forEach(circle => {
          const initialTransform = this.initialTransforms.get(circle) || '';
          circle.style.transform = initialTransform;
          circle.style.boxShadow = '';
          circle.style.animationDuration = '';
        });
        break;
        
      case 1: // Integration flow
        const steps = visual.querySelectorAll('.flow-step');
        steps.forEach(step => {
          const initialTransform = this.initialTransforms.get(step) || '';
          step.style.transform = initialTransform;
          step.style.boxShadow = '';
        });
        break;
        
      case 2: // Chat demo
        const bubbles = visual.querySelectorAll('.chat-bubble');
        bubbles.forEach(bubble => {
          bubble.style.transform = '';
          bubble.style.boxShadow = '';
        });
        break;
    }
  }
  
  /**
   * 他のカードを薄暗くする
   */
  dimOtherCards(activeCard) {
    this.diffCards.forEach(card => {
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
    this.diffCards.forEach(card => {
      card.style.opacity = '';
      card.style.filter = '';
    });
  }
  
  /**
   * チャットデモの設定
   */
  setupChatDemo() {
    const chatDemo = document.querySelector('.chat-demo');
    if (!chatDemo) return;
    
    // チャットバブルの順次表示
    const bubbles = chatDemo.querySelectorAll('.chat-bubble');
    const typingIndicator = chatDemo.querySelector('.typing-indicator');
    
    // 初期状態では非表示
    bubbles.forEach(bubble => {
      bubble.style.opacity = '0';
      bubble.style.transform = 'translateY(20px)';
    });
    
    if (typingIndicator) {
      typingIndicator.style.opacity = '0';
    }
    
    // デモの監視
    const demoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.playChattingAnimation();
          demoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    demoObserver.observe(chatDemo);
  }
  
  /**
   * チャットアニメーションの再生
   */
  playChattingAnimation() {
    const bubbles = document.querySelectorAll('.chat-demo .chat-bubble');
    const typingIndicator = document.querySelector('.typing-indicator');
    
    // ユーザーの質問を表示
    setTimeout(() => {
      if (bubbles[0]) {
        bubbles[0].style.transition = 'all 0.5s ease-out';
        bubbles[0].style.opacity = '1';
        bubbles[0].style.transform = 'translateY(0)';
      }
    }, 500);
    
    // タイピングインジケーターを表示
    setTimeout(() => {
      if (typingIndicator) {
        typingIndicator.style.transition = 'opacity 0.3s ease-out';
        typingIndicator.style.opacity = '1';
      }
    }, 1500);
    
    // AIの回答を表示
    setTimeout(() => {
      if (typingIndicator) {
        typingIndicator.style.opacity = '0';
      }
      
      if (bubbles[1]) {
        bubbles[1].style.transition = 'all 0.5s ease-out';
        bubbles[1].style.opacity = '1';
        bubbles[1].style.transform = 'translateY(0)';
      }
    }, 3000);
  }
  
  /**
   * パララックス効果の設定
   */
  setupParallaxEffects() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // handleScrollをインスタンスメソッドとして保存（cleanup用）
    this.handleScroll = handleScroll;
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  /**
   * パララックス更新（修正版）
   */
  updateParallax() {
    if (!this.section) return;
    
    const scrolled = window.pageYOffset;
    const sectionTop = this.section.getBoundingClientRect().top + scrolled;
    const sectionHeight = this.section.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // セクションが表示範囲内にある場合のみ処理
    if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
      const progress = (scrolled + windowHeight - sectionTop) / (windowHeight + sectionHeight);
      const parallaxOffset = (progress - 0.5) * 50;
      
      // 背景要素のパララックス（修正：初期transformを基準に設定）
      const bgElements = this.section.querySelectorAll('.context-circle, .flow-step');
      bgElements.forEach((element, index) => {
        const speed = 0.3 + (index % 3) * 0.1;
        const yPos = parallaxOffset * speed;
        const initialTransform = this.initialTransforms.get(element) || '';
        
        // 初期transformに対してパララックス効果を追加
        element.style.transform = initialTransform + ` translateY(${yPos}px)`;
      });
    }
  }
  
  /**
   * 連携サービス画像の設定
   */
  setupIntegrationServices() {
    const integrationImage = document.querySelector('.integration-services-img');
    if (!integrationImage) return;
    
    // 画像読み込み完了時の処理
    integrationImage.addEventListener('load', () => {
      integrationImage.classList.add('loaded');
      console.log('Integration services image loaded');
    });
    
    // 画像読み込みエラー時の処理
    integrationImage.addEventListener('error', () => {
      console.log('Failed to load integration services image');
      this.setFallbackIntegrationImage(integrationImage);
    });
    
    // Intersection Observerで画像の表示を監視
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateIntegrationImage();
          imageObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    const imageContainer = document.querySelector('.integration-showcase__image');
    if (imageContainer) {
      imageObserver.observe(imageContainer);
    }
  }
  
  /**
   * 連携サービス画像のアニメーション
   */
  animateIntegrationImage() {
    const imageContainer = document.querySelector('.integration-showcase__image');
    const noteSection = document.querySelector('.integration-showcase__text');
    
    if (imageContainer) {
      imageContainer.style.opacity = '0';
      imageContainer.style.transform = 'translateY(30px)';
      imageContainer.style.transition = 'all 0.8s ease-out';
      
      setTimeout(() => {
        imageContainer.style.opacity = '1';
        imageContainer.style.transform = 'translateY(0)';
      }, 200);
    }
    
    if (noteSection) {
      noteSection.style.opacity = '0';
      noteSection.style.transform = 'translateY(20px)';
      noteSection.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        noteSection.style.opacity = '1';
        noteSection.style.transform = 'translateY(0)';
      }, 600);
    }
  }
  
  /**
   * フォールバック画像の設定
   */
  setFallbackIntegrationImage(img) {
    // プレースホルダー画像のパターンを生成
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 400;
    
    // グラデーション背景
    const gradient = ctx.createLinearGradient(0, 0, 800, 400);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 400);
    
    // テキスト描画
    ctx.fillStyle = '#6c757d';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('連携サービス一覧', 400, 180);
    
    ctx.font = '18px Arial';
    ctx.fillText('220以上のサービスと連携可能', 400, 220);
    
    img.src = canvas.toDataURL();
    img.classList.add('loaded');
  }
  
  /**
   * テーブルアニメーション設定
   */
  setupTableAnimation() {
    // 既にsetupIntersectionObserverで実装済み
  }
  
  /**
   * レスポンシブ対応
   */
  handleResize() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // モバイルでは一部のアニメーションを簡略化
      this.simplifyMobileAnimations();
    } else {
      this.restoreDesktopAnimations();
    }
  }
  
  /**
   * モバイル用アニメーション簡略化
   */
  simplifyMobileAnimations() {
    this.diffCards.forEach(card => {
      card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    });
  }
  
  /**
   * デスクトップアニメーション復元
   */
  restoreDesktopAnimations() {
    this.diffCards.forEach(card => {
      card.style.transition = '';
    });
  }
  
  /**
   * アニメーション状態をリセット
   */
  resetAnimations() {
    this.hasAnimated = {
      cards: false,
      table: false
    };
    
    this.diffCards.forEach(card => {
      card.classList.remove('animate-in');
    });
    
    const tableElements = this.comparisonTable?.querySelectorAll('.comparison-table__header, .comparison-table__row');
    tableElements?.forEach(element => {
      element.style.opacity = '';
      element.style.transform = '';
    });
  }
  
  /**
   * デバッグ用：現在の状態を取得
   */
  getState() {
    return {
      hasAnimated: this.hasAnimated,
      diffCards: this.diffCards.length,
      contextCircles: this.contextCircles.length,
      flowSteps: this.flowSteps.length,
      chatBubbles: this.chatBubbles.length
    };
  }
  
  /**
   * クリーンアップ
   */
  destroy() {
    console.log('Destroying DifferentiationController');
    
    // イベントリスナーの削除
    if (this.handleScroll) {
      window.removeEventListener('scroll', this.handleScroll);
    }
    window.removeEventListener('resize', this.handleResize);
  }
}

/**
 * 初期化とイベント設定
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing DifferentiationController');
  
  // Differentiation Controller を初期化
  const differentiationController = new DifferentiationController();
  
  // グローバルに参照可能にする（デバッグ用）
  window.differentiationController = differentiationController;
  
  // 初期状態をログ出力
  console.log('Differentiation Controller State:', differentiationController.getState());
  
  // リサイズイベント
  window.addEventListener('resize', () => {
    differentiationController.handleResize();
  }, { passive: true });
});

/**
 * エクスポート（モジュール対応）
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DifferentiationController;
}