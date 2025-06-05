/**
 * Hero Section Animation Controller
 * YouTube動画、スクロールアニメーションを管理
 */

class HeroController {
    constructor() {
      this.hero = document.querySelector('.hero');
      this.videoContainer = document.querySelector('.hero__video-container');
      this.videoPlaceholder = document.querySelector('.hero__video-placeholder');
      this.scrollIndicator = document.querySelector('.hero__scroll-indicator');
      
      // YouTube関連
      this.youtubeVideoId = 'JGXQEsKRisM'; // TED Talk動画ID
      this.youtubePlayer = null;
      this.isVideoLoaded = false;
      
      this.init();
    }
    
    init() {
      this.setupYouTubeVideo();
      this.setupScrollIndicator();
      this.setupIntersectionObserver();
      this.preloadAssets();
    }
    
    /**
     * YouTube動画の設定
     */
    setupYouTubeVideo() {
      console.log('Setting up YouTube video with ID:', this.youtubeVideoId);
      
      // プレースホルダークリックイベント
      if (this.videoPlaceholder) {
        this.videoPlaceholder.addEventListener('click', () => {
          console.log('Video placeholder clicked');
          this.loadYouTubeVideo();
        });
      } else {
        console.log('Video placeholder not found');
      }
    }
    
    /**
     * YouTube動画iframe作成
     */
    createVideoIframe() {
      if (!this.videoContainer || this.isVideoLoaded) {
        console.log('Video container not found or video already loaded');
        return;
      }
      
      const wrapper = this.videoContainer.querySelector('.hero__video-wrapper');
      if (!wrapper) {
        console.log('Video wrapper not found');
        return;
      }
      
      console.log('Creating iframe for video ID:', this.youtubeVideoId);
      
      // プレースホルダーを非表示にしてiframeを作成
      const iframe = document.createElement('iframe');
      iframe.className = 'hero__video-iframe';
      iframe.src = `https://www.youtube.com/embed/${this.youtubeVideoId}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1`;
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      
      wrapper.appendChild(iframe);
      console.log('Iframe created and added to wrapper');
    }
    
    /**
     * YouTube動画の読み込み
     */
    loadYouTubeVideo() {
      if (this.isVideoLoaded) {
        console.log('Video already loaded');
        return;
      }
      
      const placeholder = this.videoPlaceholder;
      const wrapper = this.videoContainer.querySelector('.hero__video-wrapper');
      
      if (placeholder && wrapper) {
        console.log('Loading YouTube video...');
        
        // フェードアウトアニメーション
        placeholder.style.transition = 'opacity 0.3s ease-out';
        placeholder.style.opacity = '0';
        
        setTimeout(() => {
          placeholder.style.display = 'none';
          this.createVideoIframe();
          this.isVideoLoaded = true;
          
          // 動画読み込み完了の追跡
          this.trackVideoLoad();
        }, 300);
      } else {
        console.log('Placeholder or wrapper not found');
      }
    }
    
    /**
     * 動画読み込み追跡
     */
    trackVideoLoad() {
      const iframe = this.videoContainer.querySelector('.hero__video-iframe');
      if (iframe) {
        iframe.addEventListener('load', () => {
          console.log('YouTube video loaded successfully');
          this.animateVideoContainer();
        });
        
        iframe.addEventListener('error', () => {
          console.log('YouTube video failed to load');
        });
      }
    }
    
    /**
     * 動画コンテナのアニメーション
     */
    animateVideoContainer() {
      if (this.videoContainer) {
        this.videoContainer.style.transform = 'scale(1.02)';
        this.videoContainer.style.transition = 'transform 0.3s ease-out';
        
        setTimeout(() => {
          this.videoContainer.style.transform = 'scale(1)';
        }, 200);
      }
    }
    
    /**
     * スクロールインジケーターの設定
     */
    setupScrollIndicator() {
      if (this.scrollIndicator) {
        this.scrollIndicator.addEventListener('click', () => {
          const nextSection = document.querySelector('#product');
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
     * Intersection Observerの設定
     */
    setupIntersectionObserver() {
      const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target === this.hero) {
            console.log('Hero section is visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      if (this.hero) {
        observer.observe(this.hero);
      }
    }
    
    /**
     * アセットの事前読み込み
     */
    preloadAssets() {
      // YouTube サムネイルの事前読み込み
      if (this.youtubeVideoId) {
        const thumbnailImg = new Image();
        thumbnailImg.src = `https://img.youtube.com/vi/${this.youtubeVideoId}/maxresdefault.jpg`;
        
        thumbnailImg.onload = () => {
          console.log('YouTube thumbnail preloaded');
        };
        
        thumbnailImg.onerror = () => {
          console.log('Failed to preload YouTube thumbnail');
        };
      }
    }
    
    /**
     * レスポンシブ対応
     */
    handleResize() {
      const isMobile = window.innerWidth < 768;
      console.log('Window resized, isMobile:', isMobile);
    }
    
    /**
     * YouTube動画IDを更新
     */
    updateVideoId(newVideoId) {
      console.log('Updating video ID to:', newVideoId);
      this.youtubeVideoId = newVideoId;
      this.isVideoLoaded = false;
      
      // 既存のiframeを削除
      const existingIframe = this.videoContainer?.querySelector('.hero__video-iframe');
      if (existingIframe) {
        existingIframe.remove();
        console.log('Existing iframe removed');
      }
      
      // プレースホルダーを再表示
      if (this.videoPlaceholder) {
        this.videoPlaceholder.style.display = 'flex';
        this.videoPlaceholder.style.opacity = '1';
        console.log('Placeholder restored');
      }
    }
    
    /**
     * デバッグ用：現在の状態を取得
     */
    getState() {
      return {
        isVideoLoaded: this.isVideoLoaded,
        youtubeVideoId: this.youtubeVideoId,
        hasVideoContainer: !!this.videoContainer,
        hasVideoPlaceholder: !!this.videoPlaceholder
      };
    }
    
    /**
     * クリーンアップ
     */
    destroy() {
      console.log('Destroying HeroController');
      
      // イベントリスナーの削除
      window.removeEventListener('resize', this.handleResize);
      
      // YouTube Player の削除
      if (this.youtubePlayer && typeof this.youtubePlayer.destroy === 'function') {
        this.youtubePlayer.destroy();
      }
    }
  }
  
  /**
   * YouTube URL から動画IDを抽出
   */
  function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  /**
   * 初期化とイベント設定
   */
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing HeroController');
    
    // Hero Controller を初期化
    const heroController = new HeroController();
    
    // グローバルに参照可能にする（デバッグ用）
    window.heroController = heroController;
    
    // 初期状態をログ出力
    console.log('Hero Controller State:', heroController.getState());
    
    // リサイズイベント
    window.addEventListener('resize', () => {
      heroController.handleResize();
    }, { passive: true });
    
    // YouTube動画ID設定のグローバル関数
    window.setHeroVideoId = (videoId) => {
      heroController.updateVideoId(videoId);
    };
  });
  
  /**
   * エクスポート（モジュール対応）
   */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
      HeroController, 
      extractYouTubeId
    };
  }