/**
 * Tester Recruitment Section Controller
 * アニメーションとインタラクションを管理
 */
class TesterRecruitmentController {
  constructor() {
    this.section = document.querySelector('.tester-recruitment');
    this.benefitCards = this.section ? this.section.querySelectorAll('.benefit-card') : [];
    this.demoVideoButton = this.section ? this.section.querySelector('.tester-recruitment__demo-video-btn') : null;

    this.animationConfig = {
      threshold: 0.2, // 要素が20%見えたら発火
      rootMargin: '0px 0px -50px 0px',
      cardDelay: 200, // カードごとのアニメーション遅延 (ms)
    };

    this.init();
  }

  init() {
    if (!this.section) {
      console.warn('Tester Recruitment section not found. Controller will not initialize.');
      return;
    }
    this.setupIntersectionObserver();
    this.setupDemoVideoInteraction();
  }

  /**
   * Intersection Observerを設定し、要素がビューポートに入ったらアニメーションを実行
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: this.animationConfig.threshold,
      rootMargin: this.animationConfig.rootMargin,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('benefit-card')) {
            // benefit-card の個別アニメーション
            const cardIndex = Array.from(this.benefitCards).indexOf(entry.target);
            this.animateCard(entry.target, cardIndex);
          }
          // 一度アニメーションしたら監視を解除
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // benefit-card を監視対象に追加
    this.benefitCards.forEach(card => {
      if (card) observer.observe(card);
    });
  }

  /**
   * カードをアニメーション表示
   */
  animateCard(cardElement, index) {
    cardElement.style.transition = `opacity 0.6s ease-out ${index * this.animationConfig.cardDelay}ms, transform 0.6s ease-out ${index * this.animationConfig.cardDelay}ms`;
    cardElement.style.opacity = '1';
    cardElement.style.transform = 'translateY(0)';
  }

  /**
   * 「デモ動画を見る」ボタンのインタラクション設定
   */
  setupDemoVideoInteraction() {
    if (this.demoVideoButton) {
      this.demoVideoButton.addEventListener('click', (e) => {
        e.preventDefault();
        // TODO: ここにデモ動画のモーダル表示処理などを実装
        console.log('「デモ動画を見る」ボタンがクリックされました。');
        alert('デモ動画の再生機能をここに実装します。');
        // 例: YouTube動画IDがあれば、Heroセクションで使ったようなモーダル表示処理を呼び出す
        // if (window.heroController && typeof window.heroController.playVideoInModal === 'function') {
        //   window.heroController.playVideoInModal('YOUR_DEMO_VIDEO_ID');
        // }
      });
    }
  }
}

// DOMContentLoaded後に関数を実行
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tester')) {
    new TesterRecruitmentController();
    console.log('TesterRecruitmentController initialized.');
  }
});