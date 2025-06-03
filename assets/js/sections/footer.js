/**
 * Footer Section Controller
 * 要素の表示アニメーションを管理
 */
class FooterController {
  constructor() {
    this.footer = document.querySelector('.footer');
    if (!this.footer) {
      console.warn('Footer section not found. Controller will not initialize.');
      return;
    }

    this.animatedElements = [
      this.footer.querySelector('.footer__brand'),
      ...this.footer.querySelectorAll('.footer__section'), // NodeListを配列に展開
      this.footer.querySelector('.footer__bottom')
    ].filter(el => el !== null); // null要素を除外

    this.animationConfig = {
      threshold: 0.1, // 要素が10%見えたら発火
      rootMargin: '0px 0px -30px 0px',
      itemDelayStep: 100, // 各要素のアニメーション遅延ステップ (ms)
    };

    this.init();
  }

  init() {
    if (this.animatedElements.length > 0) {
      this.setupIntersectionObserver();
    }
    this.updateCopyrightYear();
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
          const element = entry.target;
          const index = this.animatedElements.indexOf(element);
          
          element.style.transitionDelay = `${index * this.animationConfig.itemDelayStep}ms`;
          element.classList.add('animate-in');
          
          obs.unobserve(element); // 一度アニメーションしたら監視を解除
        }
      });
    }, observerOptions);

    this.animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * コピーライトの年を現在の年に動的に更新 (オプション)
   */
  updateCopyrightYear() {
    const copyrightElement = this.footer.querySelector('.footer__copyright');
    if (copyrightElement) {
      const currentYear = new Date().getFullYear();
      // HTMLが "© 2024 Cabocia Co., Ltd. ..." のようになっていると仮定
      copyrightElement.textContent = copyrightElement.textContent.replace(/©\s*\d{4}/, `© ${currentYear}`);
    }
  }
}

// DOMContentLoaded後に関数を実行
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.footer')) {
    new FooterController();
    console.log('FooterController initialized.');
  }
});