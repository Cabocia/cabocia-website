/**
 * Pricing Section (Table Layout) Animation Controller
 * 料金テーブルのアニメーション、プランのインタラクション効果を管理
 */
class PricingTableController {
    constructor() {
      this.section = document.querySelector('.pricing');
      this.pricingTableWrapper = document.querySelector('.pricing__table-wrapper');
      this.pricingTable = document.querySelector('.pricing__table');
      this.sectionTitle = document.querySelector('.pricing .section-title');
      this.campaignBanner = document.querySelector('.pricing .section-description');
      this.featuredBadge = document.querySelector('.featured-badge'); // テーブル外のおすすめバッジ
  
      // HTML構造からプランヘッダーとデータ行を取得
      this.planHeaders = this.pricingTable ? Array.from(this.pricingTable.querySelectorAll('thead th.pricing__header--plan')) : [];
      this.tableRows = this.pricingTable ? Array.from(this.pricingTable.querySelectorAll('tbody tr.pricing__row')) : [];
  
      this.hasAnimated = {
        title: false,
        banner: false,
        table: false,
        rows: false,
        badge: false
      };
  
      this.animationConfig = {
        threshold: 0.1, // 要素が10%見えたら発火
        rootMargin: '0px 0px -50px 0px', // ビューポートの下端から50px手前で判定
        rowDelay: 100, // 各行のアニメーション遅延 (ms)
      };
  
      this.selectedPlanIndex = null; // 現在選択されているプランのインデックス
      // 「おすすめ」プランのインデックスを特定
      this.featuredPlanIndex = this.planHeaders.findIndex(th => th.classList.contains('pricing__header--featured'));
  
      this.init();
    }
  
    init() {
      if (!this.pricingTable) {
        console.warn('Pricing table (.pricing__table) not found. Controller will not initialize fully.');
        // 主要要素がない場合でも、存在する要素のアニメーションは試みる
        if (this.sectionTitle) this.setupIntersectionObserverForElement(this.sectionTitle, 'title', this.animateTitle.bind(this));
        if (this.campaignBanner) this.setupIntersectionObserverForElement(this.campaignBanner, 'banner', this.animateCampaignBanner.bind(this));
        return;
      }
  
      this.setupIntersectionObserver();
      this.setupPlanInteractions();
      this.setupCampaignBannerInteraction();
      this.setupAccessibility();
      this.positionFeaturedBadge(); // おすすめバッジの位置を調整
  
      // ウィンドウリサイズ時にバッジ位置を再計算
      window.addEventListener('resize', this.debounce(this.positionFeaturedBadge.bind(this), 200));
      // テーブルラッパーがスクロールされた時にもバッジ位置を再計算
      if (this.pricingTableWrapper) {
          this.pricingTableWrapper.addEventListener('scroll', this.debounce(this.positionFeaturedBadge.bind(this), 50));
      }
    }
  
    /**
     * 特定の要素に対してIntersection Observerを設定する汎用メソッド
     */
    setupIntersectionObserverForElement(element, flagName, animationCallback) {
      if (!element) return;
  
      const observerOptions = {
        threshold: this.animationConfig.threshold,
        rootMargin: this.animationConfig.rootMargin
      };
  
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated[flagName]) {
            animationCallback(element); // アニメーション実行
            this.hasAnimated[flagName] = true; // アニメーション済みフラグを立てる
            obs.unobserve(entry.target); // 目的達成後、監視を解除
          }
        });
      }, observerOptions);
  
      observer.observe(element);
    }
  
    /**
     * 各要素のアニメーションのためのIntersection Observerを設定
     */
    setupIntersectionObserver() {
      this.setupIntersectionObserverForElement(this.sectionTitle, 'title', this.animateTitle.bind(this));
      this.setupIntersectionObserverForElement(this.campaignBanner, 'banner', this.animateCampaignBanner.bind(this));
      this.setupIntersectionObserverForElement(this.featuredBadge, 'badge', this.animateFeaturedBadge.bind(this));
  
      // テーブル本体と各行のアニメーション用Observer
      const tableContentObserverOptions = {
        threshold: this.animationConfig.threshold,
        rootMargin: this.animationConfig.rootMargin
      };
  
      const tableContentObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!this.hasAnimated.table) {
              this.animateTable(); // テーブル全体の表示アニメーション
              this.hasAnimated.table = true;
            }
            if (!this.hasAnimated.rows) {
              this.animateTableRows(); // テーブル各行の表示アニメーション
              this.hasAnimated.rows = true;
            }
            // テーブルと行のアニメーションが完了したら監視解除
            if (this.hasAnimated.table && this.hasAnimated.rows) {
              obs.unobserve(entry.target);
            }
          }
        });
      }, tableContentObserverOptions);
  
      // pricingTableWrapper (スクロールコンテナ) を監視対象にする
      if (this.pricingTableWrapper) {
        tableContentObserver.observe(this.pricingTableWrapper);
      }
    }
  
    /**
     * セクションタイトルのアニメーション
     */
    animateTitle(element) {
      console.log('Animating pricing title');
      element.style.opacity = '0';
      element.style.transform = 'translateY(-20px)';
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 50); // 微小な遅延でトランジションを確実に発動
    }
  
    /**
     * キャンペーンバナーのアニメーション
     */
    animateCampaignBanner(element) {
      console.log('Animating campaign banner');
      element.style.opacity = '0';
      element.style.transform = 'scale(0.9) translateY(10px)';
      // CSSに `animation: campaignPulse 3s ease-in-out infinite;` があるので、
      // 初期表示のアニメーションだけJSで制御し、あとはCSSに任せる
      element.style.transition = 'opacity 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1) translateY(0)';
      }, 200);
    }
  
    /**
     * 「おすすめ」バッジのアニメーション
     */
    animateFeaturedBadge(element) {
      console.log('Animating featured badge');
      // 初期状態はCSSで `transform: translateX(-50%)` がかかっている想定
      element.style.opacity = '0';
      element.style.transform = 'translateX(-50%) translateY(-10px) scale(0.8)';
      // CSSに `animation: badgePulse 2s ease-in-out infinite;` がある
      element.style.transition = 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateX(-50%) translateY(0) scale(1)';
      }, this.hasAnimated.table ? 100 : 400); // テーブルアニメーション後か少し遅れて
    }
  
  
    /**
     * テーブル全体の表示アニメーション (CSSの .animate-in を利用)
     */
    animateTable() {
      if (!this.pricingTable) return;
      console.log('Animating pricing table visibility');
      this.pricingTable.classList.add('animate-in');
    }
  
    /**
     * テーブル各行の表示アニメーション (CSSの .animate-in と transition-delay を利用)
     */
    animateTableRows() {
      if (!this.tableRows.length) return;
      console.log('Animating pricing table rows');
      this.tableRows.forEach((row, index) => {
        // CSS側で :nth-child と transition-delay が設定されている前提
        // もしJSで制御する場合: row.style.transitionDelay = `${index * this.animationConfig.rowDelay}ms`;
        row.classList.add('animate-in');
  
        // 価格行であれば、価格カウンターアニメーションをトリガー
        if (row.classList.contains('pricing__row--price')) {
          const priceCells = row.querySelectorAll('.pricing__cell');
          priceCells.forEach((cell, cellIndex) => {
            // カテゴリセルは除く (最初のセル)
            if (cellIndex > 0 && cell.querySelector('.price-amount')) {
               // アニメーションの遅延は行の遅延 + 微小なオフセット
              this.animatePriceCounter(cell, (index * this.animationConfig.rowDelay) + 200);
            }
          });
        }
      });
    }
  
    /**
     * 価格カウンターアニメーション
     */
    animatePriceCounter(priceCellElement, delay = 0) { // priceCellElement は .pricing__cell
      const priceAmountElement = priceCellElement.querySelector('.price-amount');
      if (!priceAmountElement) return;
  
      const priceText = priceAmountElement.textContent; // 例: "10,000円" や "500,000～円"
      const priceMatch = priceText.match(/([\d,]+)(.*)/); // 数字部分とそれ以降の単位（円、～円など）
      
      if (!priceMatch || priceMatch[1] === undefined || priceMatch[2] === undefined) {
          console.warn('Price format not recognized for counter:', priceText);
          return;
      }
  
      const finalPrice = parseInt(priceMatch[1].replace(/,/g, ''));
      const unitSuffix = priceMatch[2]; // 例: "円", "～円"
      
      if (isNaN(finalPrice)) {
          console.warn('Final price is NaN for:', priceText);
          return;
      }
  
      const duration = 1200; // アニメーション時間 (ms)
      let startTime = null;
  
      const step = (currentTime) => {
        if (!startTime) {
          startTime = currentTime;
        }
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < delay) { // 指定された遅延時間待機
            requestAnimationFrame(step);
            return;
        }
        
        const timeAfterDelay = elapsedTime - delay;
        const progress = Math.min(timeAfterDelay / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
  
        const currentDisplayPrice = Math.floor(easedProgress * finalPrice);
        priceAmountElement.textContent = `${currentDisplayPrice.toLocaleString()}${unitSuffix}`;
  
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // アニメーション完了後、正確な値を表示
          priceAmountElement.textContent = `${finalPrice.toLocaleString()}${unitSuffix}`;
        }
      };
  
      // 初期値を0として表示
      priceAmountElement.textContent = `0${unitSuffix}`;
      requestAnimationFrame(step);
    }
  
    /**
     * 「おすすめ」バッジの位置を、対応するプランヘッダーの中央上部に調整
     */
    positionFeaturedBadge() {
      if (!this.featuredBadge || !this.pricingTableWrapper || this.featuredPlanIndex === -1 || !this.planHeaders[this.featuredPlanIndex]) {
        if (this.featuredBadge) this.featuredBadge.style.opacity = '0'; // 対象がない場合は非表示
        return;
      }
  
      const featuredHeader = this.planHeaders[this.featuredPlanIndex];
      const tableWrapperRect = this.pricingTableWrapper.getBoundingClientRect();
      const headerRect = featuredHeader.getBoundingClientRect();
  
      // テーブルラッパーのスクロール量を考慮して、バッジのleft位置を計算
      const scrollLeft = this.pricingTableWrapper.scrollLeft;
      // バッジのX方向中央が、ヘッダーのX方向中央に来るように設定
      // headerRect.left - tableWrapperRect.left はラッパー内でのヘッダーの相対左位置
      const badgeLeftPosition = (headerRect.left - tableWrapperRect.left + scrollLeft) + (headerRect.width / 2);
  
      this.featuredBadge.style.left = `${badgeLeftPosition}px`;
      // top と transform: translateX(-50%) はCSSで設定されていると仮定
      // (CSS: top: -15px; transform: translateX(-50%);)
      // もしバッジが表示されていなければ表示する
      if(this.hasAnimated.badge) this.featuredBadge.style.opacity = '1';
    }
  
    /**
     * プランヘッダーと対応する列セルに対するインタラクション設定
     */
    setupPlanInteractions() {
      this.planHeaders.forEach((header, planIndex) => {
        // ヘッダーへのイベントリスナー
        header.addEventListener('mouseenter', () => this.handlePlanHover(planIndex, true));
        header.addEventListener('mouseleave', () => this.handlePlanHover(planIndex, false));
        header.addEventListener('click', () => this.handlePlanSelection(planIndex));
        header.addEventListener('focus', () => this.handlePlanFocus(planIndex, true));
        header.addEventListener('blur', () => this.handlePlanFocus(planIndex, false));
  
        // 対応する列のデータセルにも同様のイベントを設定する場合 (オプション)
        // const columnDataCells = this.getPlanColumnDataCells(planIndex);
        // columnDataCells.forEach(cell => {
        //   cell.addEventListener('mouseenter', () => this.handlePlanHover(planIndex, true, cell));
        //   cell.addEventListener('mouseleave', () => this.handlePlanHover(planIndex, false, cell));
        // });
      });
    }
  
    /**
     * 指定されたプランインデックスの列に属するデータセル（td）を取得
     */
    getPlanColumnDataCells(planIndex) {
      const cells = [];
      if (planIndex < 0 || planIndex >= this.planHeaders.length) return cells;
  
      this.tableRows.forEach(row => {
        // querySelectorAll の結果は NodeList なので配列に変換してからアクセス
        // +1 はカテゴリ列 (.pricing__cell--category) の分を考慮
        const cell = Array.from(row.querySelectorAll('td.pricing__cell'))[planIndex + 1];
        if (cell) cells.push(cell);
      });
      return cells;
    }
  
    /**
     * プランホバー時の処理
     */
    handlePlanHover(planIndex, isHovering) {
      const header = this.planHeaders[planIndex];
      const columnDataCells = this.getPlanColumnDataCells(planIndex);
  
      // ホバー対象のスタイルクラス (CSSで定義することを推奨)
      const hoverClassHeader = 'pricing__header--hovered';
      const hoverClassCell = 'pricing__cell--hovered';
  
      if (isHovering) {
        header.classList.add(hoverClassHeader);
        columnDataCells.forEach(cell => cell.classList.add(hoverClassCell));
        this.dimOtherPlans(planIndex); // 他のプランを薄暗く
      } else {
        header.classList.remove(hoverClassHeader);
        columnDataCells.forEach(cell => cell.classList.remove(hoverClassCell));
        this.restoreOtherPlans(); // 他のプランの薄暗さを解除
      }
    }
  
    /**
     * アクティブでない他のプランを薄暗く表示
     */
    dimOtherPlans(activeIndex) {
      this.planHeaders.forEach((header, index) => {
        if (index !== activeIndex) {
          header.style.opacity = '0.6';
          this.getPlanColumnDataCells(index).forEach(cell => cell.style.opacity = '0.6');
        }
      });
    }
  
    /**
     * 薄暗くしたプランを元の表示に戻す
     */
    restoreOtherPlans() {
      this.planHeaders.forEach((header, index) => {
        header.style.opacity = '1';
        this.getPlanColumnDataCells(index).forEach(cell => cell.style.opacity = '1');
      });
    }
  
    /**
     * プラン選択時の処理
     */
    handlePlanSelection(planIndex) {
      const newlySelectedHeader = this.planHeaders[planIndex];
      console.log(`Plan selected: ${newlySelectedHeader.textContent.trim()} (Index: ${planIndex})`);
  
      // 選択解除と選択のスタイルクラス (CSSで定義)
      const selectedClass = 'plan--selected';
  
      // 既に選択されているプランがあれば、その選択を解除
      if (this.selectedPlanIndex !== null && this.selectedPlanIndex !== planIndex) {
        this.planHeaders[this.selectedPlanIndex].classList.remove(selectedClass);
        this.getPlanColumnDataCells(this.selectedPlanIndex).forEach(c => c.classList.remove(selectedClass));
      }
  
      // 新しいプランを選択、または既に選択されていれば選択解除
      if (this.selectedPlanIndex === planIndex) {
        newlySelectedHeader.classList.remove(selectedClass);
        this.getPlanColumnDataCells(planIndex).forEach(c => c.classList.remove(selectedClass));
        this.selectedPlanIndex = null; // 選択解除
      } else {
        newlySelectedHeader.classList.add(selectedClass);
        this.getPlanColumnDataCells(planIndex).forEach(c => c.classList.add(selectedClass));
        this.selectedPlanIndex = planIndex; // 新しいプランを選択
        this.animatePlanSelectionEffect(newlySelectedHeader); // 選択時の簡易アニメーション
      }
  
      // 外部向けにイベントを発火 (プラン詳細データと共に)
      const planData = this.selectedPlanIndex !== null ? this.extractPlanData(this.selectedPlanIndex) : null;
      const event = new CustomEvent('planSelected', { detail: { planData } });
      document.dispatchEvent(event);
    }
    
    /**
     * プラン選択時の視覚的フィードバック
     */
    animatePlanSelectionEffect(selectedHeader) {
      selectedHeader.style.transition = 'transform 0.15s ease-in-out';
      selectedHeader.style.transform = 'scale(1.03)';
      setTimeout(() => {
        selectedHeader.style.transform = 'scale(1)';
      }, 150);
    }
  
    /**
     * プランフォーカス時の処理
     */
    handlePlanFocus(planIndex, isFocused) {
      const header = this.planHeaders[planIndex];
      // フォーカススタイルクラス (CSSで定義)
      const focusClass = 'plan--focused';
      if (isFocused) {
        header.classList.add(focusClass);
      } else {
        header.classList.remove(focusClass);
      }
    }
  
    /**
     * 指定されたプランインデックスからプラン情報を抽出
     */
    extractPlanData(planIndex) {
      if (planIndex < 0 || planIndex >= this.planHeaders.length) return null;
  
      const header = this.planHeaders[planIndex];
      const data = {
        index: planIndex,
        name: header.textContent.trim(),
        isFeatured: header.classList.contains('pricing__header--featured'),
        details: {}
      };
  
      this.tableRows.forEach(row => {
        const categoryCell = row.querySelector('.pricing__cell--category');
        const valueCell = Array.from(row.querySelectorAll('td.pricing__cell'))[planIndex + 1];
  
        if (!categoryCell || !valueCell) return;
  
        let key = categoryCell.textContent.trim();
        let value = valueCell.innerText.trim(); // innerText で子要素のテキストも含め、改行はスペースに
  
        // 特定の行のクラスに基づいてキーを標準化
        if (row.classList.contains('pricing__row--service')) key = 'サービス内容';
        else if (row.classList.contains('pricing__row--price')) key = '料金';
        else if (row.classList.contains('pricing__row--connections')) key = 'データ接続数/データ容量';
        else if (row.classList.contains('pricing__row--target')) key = 'こんな人におすすめ';
        
        data.details[key] = value;
      });
      return data;
    }
    
    /**
     * キャンペーンバナーのインタラクション設定
     */
    setupCampaignBannerInteraction() {
      if (!this.campaignBanner) return;
      this.campaignBanner.addEventListener('click', () => {
        console.log('Campaign banner clicked!');
        // 例: 簡易的なクリックエフェクト
        this.campaignBanner.style.transform = 'scale(0.97)';
        this.campaignBanner.style.transition = 'transform 0.1s ease-in-out';
        setTimeout(() => {
          this.campaignBanner.style.transform = 'scale(1)';
        }, 100);
        // ここでキャンペーン詳細ページへの遷移やモーダル表示などのロジックを実装可能
      });
    }
  
    /**
     * アクセシビリティ関連の設定
     */
    setupAccessibility() {
      if (this.section) {
          this.section.setAttribute('aria-label', 'ご利用料金プラン一覧');
      }
      if (this.pricingTable) {
          this.pricingTable.setAttribute('role', 'table');
          // テーブルのキャプションがあれば aria-describedby や aria-labelledby で関連付け
      }
  
      this.planHeaders.forEach((header, index) => {
        header.setAttribute('tabindex', '0'); // キーボードフォーカス可能に
        header.setAttribute('role', 'button'); // 列全体を選択するボタンとして
        header.setAttribute('aria-label', `プラン ${header.textContent.trim()} を選択`);
        // aria-pressed は選択状態に応じて更新
        header.setAttribute('aria-pressed', 'false');
  
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // スペースキーでのスクロールを防止
            this.handlePlanSelection(index);
            // aria-pressed 状態を更新
            header.setAttribute('aria-pressed', this.selectedPlanIndex === index ? 'true' : 'false');
          }
        });
      });
      
      // テーブルの各行の最初のセル（カテゴリセル）に scope="row" を設定することを推奨 (HTML側で)
      // 例: <td class="pricing__cell pricing__cell--category" scope="row">サービス内容</td>
      // ヘッダーセル (th) には scope="col" を設定 (HTML側で)
      // 例: <th class="pricing__header pricing__header--plan" scope="col">ライト</th>
    }
  
    /**
     * debounce関数: イベントが連続して発生する場合に、最後のイベントから指定時間後に処理を実行
     */
    debounce(func, delay) {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }
  
    /**
     * クリーンアップ (ページ遷移時などに不要なイベントリスナー等を削除する場合)
     */
    destroy() {
      console.log('Destroying PricingTableController and cleaning up listeners.');
      // Intersection Observerの停止
      // (保存しておいたObserverインスタンスに対して .disconnect() を呼び出す)
      
      // イベントリスナーの削除
      window.removeEventListener('resize', this.debounce(this.positionFeaturedBadge.bind(this), 200));
      if (this.pricingTableWrapper) {
          this.pricingTableWrapper.removeEventListener('scroll', this.debounce(this.positionFeaturedBadge.bind(this), 50));
      }
      // 他、動的に追加したリスナーがあればここで削除
    }
  }
  
  /**
   * DOMContentLoaded後に関数を実行
   */
  document.addEventListener('DOMContentLoaded', () => {
    // .pricing__table がページに存在する場合のみコントローラーを初期化
    if (document.querySelector('.pricing__table')) {
      const pricingTableControllerInstance = new PricingTableController();
      // デバッグ用にグローバルスコープにインスタンスを公開 (本番では不要)
      window.pricingTableControllerInstance = pricingTableControllerInstance;
      console.log('PricingTableController initialized successfully.');
  
      // カスタムイベント 'planSelected' のリッスン例
      document.addEventListener('planSelected', (event) => {
        if (event.detail.planData) {
          console.log('Event "planSelected" caught. Selected plan details:', event.detail.planData);
        } else {
          console.log('Event "planSelected" caught. Plan deselected.');
        }
      });
  
    } else {
      console.warn('Element with class ".pricing__table" not found. PricingTableController will not be initialized.');
    }
  });