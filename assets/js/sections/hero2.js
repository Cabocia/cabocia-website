/**
 * Hero 2 Section Controller (assets/js/sections/hero2.js)
 * hero2セクションのアニメーションとインタラクションを管理
 */
class Hero2Controller {
  constructor() {
    this.section = document.querySelector('.hero2');
    if (!this.section) {
      console.warn('Hero2 section not found. Controller will not initialize.');
      return;
    }

    this.videoContainer = this.section.querySelector('.hero2__video-container');
    this.scrollIndicator = this.section.querySelector('.hero__scroll-indicator');
    
    this.init();
  }

  init() {
    this.setupScrollIndicator();
    this.setupVideoInteraction();
  }

  /**
   * スクロールダウンインジケーターのクリックイベントを設定
   */
  setupScrollIndicator() {
    if (this.scrollIndicator) {
      this.scrollIndicator.addEventListener('click', () => {
        // 次のセクションを取得してスクロール
        const nextSection = this.section.nextElementSibling;
        if (nextSection) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
          const targetPosition = nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  }

  /**
   * 動画コンテナへのホバーエフェクトを設定
   */
  setupVideoInteraction() {
    if (this.videoContainer) {
      this.videoContainer.addEventListener('mouseenter', () => {
        this.videoContainer.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
        this.videoContainer.style.transform = 'scale(1.02)';
        this.videoContainer.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)';
      });

      this.videoContainer.addEventListener('mouseleave', () => {
        this.videoContainer.style.transform = 'scale(1)';
        this.videoContainer.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)';
      });
    }
  }
}

/**
 * DOMが読み込まれたらコントローラーを初期化
 */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('hero2')) {
    new Hero2Controller();
    console.log('Hero2Controller initialized.');
  }
});