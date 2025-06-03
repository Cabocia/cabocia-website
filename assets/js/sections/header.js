/**
 * Header Animation and Functionality
 * ヘッダーのスクロール検知、モバイルメニュー、アニメーションを管理
 */
class HeaderController {
  constructor() {
    this.header = document.querySelector('.header');
    this.navLogoImg = document.querySelector('.nav__logo-img');
    this.mobileToggle = document.querySelector('.nav__mobile-toggle');
    this.mobileMenu = null; // createMobileMenu で設定
    this.mobileOverlay = null; // createMobileMenu で設定
    this.mobileMenuItems = []; // createMobileMenu で設定
    this.mobileMenuActions = null; // createMobileMenu で設定
    
    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY; // 初期値を設定
    this.isScrollingDown = false;
    this.scrollThreshold = 50; // スクロール検知の閾値を少し下げる

    this.init();
  }

  init() {
    if (!this.header) {
      console.warn('Header element not found. Controller will not initialize.');
      return;
    }
    this.createMobileMenu(); // 先にDOMを生成
    this.bindEvents();
    this.handleScroll(); // 初期スクロール状態を適用
    this.logoLoadingAnimation();
    this.updateHeaderHeight(); // 初期読み込み時にも実行
  }

  logoLoadingAnimation() {
    if (this.navLogoImg) {
      // 画像が読み込まれたか、キャッシュされていればすぐに表示
      if (this.navLogoImg.complete) {
        this.navLogoImg.classList.add('loading-animation');
      } else {
        this.navLogoImg.addEventListener('load', () => {
          this.navLogoImg.classList.add('loading-animation');
        }, { once: true });
      }
    }
  }

  createMobileMenu() {
    if (document.querySelector('.nav__mobile-menu')) {
        // 既に存在する場合は要素を再取得
        this.mobileMenu = document.querySelector('.nav__mobile-menu');
        this.mobileOverlay = document.querySelector('.nav__mobile-overlay');
        if (this.mobileMenu) {
            this.mobileMenuItems = Array.from(this.mobileMenu.querySelectorAll('.nav__mobile-item'));
            this.mobileMenuActions = this.mobileMenu.querySelector('.nav__mobile-actions');
        }
        return;
    }

    const mobileMenuHTML = `
      <div class="nav__mobile-overlay"></div>
      <div class="nav__mobile-menu">
        <div class="nav__mobile-content">
          <ul class="nav__mobile-links">
            <li class="nav__mobile-item"><a href="#product" class="nav__mobile-link">プロダクト</a></li>
            <li class="nav__mobile-item"><a href="#solution" class="nav__mobile-link">提供価値</a></li>
            <li class="nav__mobile-item"><a href="#pricing" class="nav__mobile-link">料金プラン</a></li>
            <li class="nav__mobile-item"><a href="#faq" class="nav__mobile-link">よくある質問</a></li>
          </ul>
          <div class="nav__mobile-actions">
            <a href="#contact" class="btn btn--primary btn--large">資料請求</a>
            <a href="#tester" class="btn btn--secondary btn--large">デモ・利用開始</a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
    
    this.mobileMenu = document.querySelector('.nav__mobile-menu');
    this.mobileOverlay = document.querySelector('.nav__mobile-overlay');
    if (this.mobileMenu) { // nullチェックを追加
        this.mobileMenuItems = Array.from(this.mobileMenu.querySelectorAll('.nav__mobile-item'));
        this.mobileMenuActions = this.mobileMenu.querySelector('.nav__mobile-actions');
    }
  }

  bindEvents() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      this.lastScrollY = window.scrollY; // 常に最新のスクロール位置を更新
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', () => {
        if (this.isMenuOpen) this.closeMobileMenu();
      });
    }

    if (this.mobileMenu) {
      const mobileLinks = this.mobileMenu.querySelectorAll('.nav__mobile-link, .nav__mobile-actions .btn');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (link.getAttribute('href').startsWith('#')) {
            this.closeMobileMenu();
          }
        });
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
      this.updateHeaderHeight(); // リサイズ時にもヘッダー高さを更新
    });

    this.setupSmoothScroll();
  }

  handleScroll() {
    const currentScrollY = this.lastScrollY; // requestAnimationFrame外で取得した値を使用

    if (currentScrollY > 50) {
      this.header.classList.add('header--scrolled');
    } else {
      this.header.classList.remove('header--scrolled');
    }

    // スクロールが閾値を超え、かつメニューが開いていない場合のみヘッダーを隠す
    if (currentScrollY > this.scrollThreshold && !this.isMenuOpen) {
      // window.scrollY を直接参照して最新のスクロール位置と比較
      if (window.scrollY > this.previousScrollYForHiding && !this.isScrollingDown) { // previousScrollYForHiding は新しいプロパティ
        this.header.classList.add('header--hidden');
        this.isScrollingDown = true;
      } else if (window.scrollY < this.previousScrollYForHiding && this.isScrollingDown) {
        this.header.classList.remove('header--hidden');
        this.isScrollingDown = false;
      }
    } else if (!this.isMenuOpen) { // メニューが開いていない、かつスクロールが閾値以下の場合
      this.header.classList.remove('header--hidden');
      this.isScrollingDown = false;
    }
    this.previousScrollYForHiding = window.scrollY; // 次の比較のために保存
  }
  // handleScroll内で使うためのスクロール位置保存用プロパティを追加
  previousScrollYForHiding = window.scrollY;


  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    if (!this.mobileMenu || !this.mobileOverlay || !this.mobileToggle) return;
    this.isMenuOpen = true;
    this.mobileToggle.classList.add('nav__mobile-toggle--open');
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    this.mobileOverlay.classList.add('nav__mobile-overlay--open');
    this.mobileMenu.classList.add('nav__mobile-menu--open');
    document.body.style.overflow = 'hidden';
    // ヘッダーが隠れている場合は表示する
    this.header.classList.remove('header--hidden');


    // メニューアイテムのアニメーションクラスをリセットして再付与（CSSアニメーション発火のため）
    this.mobileMenuItems.forEach(item => {
        item.style.opacity = '0'; // JSで初期状態を確実に設定
        item.style.transform = 'translateY(15px)';
    });
    if(this.mobileMenuActions) {
        this.mobileMenuActions.style.opacity = '0';
        this.mobileMenuActions.style.transform = 'translateY(15px)';
    }


    // CSSアニメーションの遅延はCSS側で :nth-child で設定されているので、クラス追加だけで発火するはず
    // もしJSで制御するなら以下のようにする
    this.mobileMenuItems.forEach((item, index) => {
      setTimeout(() => { // 微小な遅延を入れて再描画を促す
        item.style.animationDelay = `${0.1 + index * 0.05}s`; // CSSの遅延と合わせるか、ここで上書き
        // item.classList.add('animate-in'); // もし専用のアニメーションクラスがあれば
      }, 50); // 少し遅らせてアニメーション開始
    });
    // if (this.mobileMenuActions) {
    //   setTimeout(() => {
    //      this.mobileMenuActions.style.animationDelay = `${0.1 + this.mobileMenuItems.length * 0.05}s`;
    //   }, 50);
    // }


    this.trapFocus();
    const firstLink = this.mobileMenu.querySelector('.nav__mobile-link');
    if (firstLink) setTimeout(() => firstLink.focus(), 300); // transition後にフォーカス
  }

  closeMobileMenu() {
    if (!this.mobileMenu || !this.mobileOverlay || !this.mobileToggle) return;
    this.isMenuOpen = false;
    this.mobileToggle.classList.remove('nav__mobile-toggle--open');
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.mobileOverlay.classList.remove('nav__mobile-overlay--open');
    this.mobileMenu.classList.remove('nav__mobile-menu--open');
    document.body.style.overflow = '';
    this.mobileToggle.focus();
  }

  trapFocus() {
    if (!this.mobileMenu) return;
    const focusableElements = Array.from(this.mobileMenu.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    ));
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (!this.isMenuOpen || e.key !== 'Tab') return;

      if (e.shiftKey) { /* shift + tab */
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { /* tab */
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    // 以前のリスナーを削除してから新しいリスナーを追加
    document.removeEventListener('keydown', this.boundHandleTabKey);
    this.boundHandleTabKey = handleTabKey; // イベントリスナー削除用に保存
    document.addEventListener('keydown', this.boundHandleTabKey);
  }
  boundHandleTabKey = null; // 初期化

  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '#!') return; // 単なる # や #! は無視

        try {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            e.preventDefault();
            const headerHeight = this.header.offsetHeight || 70; // フォールバック値
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // 20pxの追加オフセット

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        } catch (error) {
          // 無効なセレクタの場合のエラーを無視
          console.warn(`Invalid selector for smooth scroll: ${href}`, error);
        }
      });
    });
  }

  updateHeaderHeight() {
    const headerHeight = this.header ? this.header.offsetHeight : 70;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }

  // setupIntersectionObserver はPC版の .nav__link や .btn に対するものなので、
  // 今回の修正範囲では直接的な影響は少ないかもしれませんが、残しておきます。
  setupIntersectionObserver() {
    // ... (既存のコード)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const headerController = new HeaderController();
  window.headerController = headerController; // for debugging
  console.log('HeaderController initialized.');
});

// 'load' イベントリスナーは削除または調整。
// 初期ローディングアニメーションは HeaderController 内の logoLoadingAnimation で対応。
// パフォーマンス測定も必要であれば残す。