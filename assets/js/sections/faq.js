/**
 * FAQ Section Controller
 * アコーディオン機能と表示アニメーションを管理 (height と opacity で制御)
 */
class FaqController {
  constructor() {
    this.section = document.getElementById('faq');
    this.faqItems = this.section ? this.section.querySelectorAll('.faq-item') : [];

    this.animationConfig = {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px',
      itemDelay: 150,
    };

    this.handleResize = this.debounce(this._handleResize.bind(this), 250); // debounceの時間を少し長く

    this.init();
  }

  init() {
    if (!this.section) {
      console.warn('FAQ section not found. Controller will not initialize.');
      return;
    }
    this.setupAccordion();
    this.setupIntersectionObserver();
    window.addEventListener('resize', this.handleResize);
  }

  setupAccordion() {
    this.faqItems.forEach((item, index) => {
      const questionButton = item.querySelector('.faq-item__question');
      const answerDiv = item.querySelector('.faq-item__answer');

      if (questionButton && answerDiv) {
        const answerId = `faq-answer-${index}`;
        answerDiv.id = answerId;
        questionButton.setAttribute('aria-expanded', 'false');
        questionButton.setAttribute('aria-controls', answerId);
        answerDiv.setAttribute('aria-hidden', 'true');

        // 初期状態で answerDiv の opacity を 0 に設定
        answerDiv.style.opacity = '0';


        questionButton.addEventListener('click', () => {
          const isOpen = item.classList.contains('faq-item--open');
          if (isOpen) {
            this.closeItem(item, answerDiv, questionButton);
          } else {
            // 他のアイテムを閉じる (オプション)
            this.faqItems.forEach(otherItem => {
              if (otherItem !== item && otherItem.classList.contains('faq-item--open')) {
                const otherAnswer = otherItem.querySelector('.faq-item__answer');
                const otherQuestionButton = otherItem.querySelector('.faq-item__question');
                if (otherAnswer && otherQuestionButton) {
                  this.closeItem(otherItem, otherAnswer, otherQuestionButton);
                }
              }
            });
            this.openItem(item, answerDiv, questionButton);
          }
        });
      }
    });
  }

  openItem(item, answerDiv, questionButton) {
    item.classList.add('faq-item--open');
    questionButton.setAttribute('aria-expanded', 'true');
    answerDiv.setAttribute('aria-hidden', 'false');

    // answerDiv の現在の transition を保存
    const originalTransition = answerDiv.style.transition;
    // scrollHeight を正確に取得するために、一時的に transition を解除し、height: auto にする
    answerDiv.style.transition = 'none';
    answerDiv.style.height = 'auto'; // height: auto で自然な高さを確保
    answerDiv.style.display = 'block'; // 非表示だった場合は表示

    const height = answerDiv.scrollHeight; // この時点で高さを取得

    // 即座に height: 0 に戻す (アニメーションの開始点)
    answerDiv.style.height = '0';
    
    // 元のトランジションを再適用し、アニメーションを開始
    requestAnimationFrame(() => {
      answerDiv.style.transition = originalTransition || 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease-out, padding-top 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding-bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1)'; // CSSで定義されたものを優先
      requestAnimationFrame(() => { // さらに次のフレームでアニメーションプロパティを設定
          answerDiv.style.height = height + 'px';
          answerDiv.style.opacity = '1';
      });
    });
  }

  closeItem(item, answerDiv, questionButton) {
    item.classList.remove('faq-item--open');
    questionButton.setAttribute('aria-expanded', 'false');
    answerDiv.setAttribute('aria-hidden', 'true');
    
    // CSSのトランジションに任せる
    answerDiv.style.height = '0';
    answerDiv.style.opacity = '0';
  }

  setupIntersectionObserver() {
    // (前回と同様の実装で問題ないはずです)
    const observerOptions = {
      threshold: this.animationConfig.threshold,
      rootMargin: this.animationConfig.rootMargin,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const itemIndex = Array.from(this.faqItems).indexOf(item);
          if (itemIndex !== -1) {
            item.style.transitionDelay = `${itemIndex * this.animationConfig.itemDelay}ms`;
          }
          item.classList.add('animate-in');
          obs.unobserve(item);
        }
      });
    }, observerOptions);

    this.faqItems.forEach(item => {
      if (item) observer.observe(item);
    });
  }

  _handleResize() {
    this.faqItems.forEach(item => {
      if (item.classList.contains('faq-item--open')) {
        const answerDiv = item.querySelector('.faq-item__answer');
        if (answerDiv) {
          const originalTransition = answerDiv.style.transition;
          answerDiv.style.transition = 'none'; // トランジションを一時的に無効化

          // height: auto で自然な高さを確保し、scrollHeight を再取得
          answerDiv.style.height = 'auto';
          const newHeight = answerDiv.scrollHeight;
          
          // 新しい高さを適用 (ただし、アニメーションはさせない)
          answerDiv.style.height = newHeight + 'px';

          // トランジションを元に戻す
          requestAnimationFrame(() => { // 次の描画フレームで
            answerDiv.style.transition = originalTransition;
          });
        }
      }
    });
  }

  debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('faq')) {
    new FaqController();
    console.log('FaqController initialized (Approach 1: height & opacity).');
  }
});