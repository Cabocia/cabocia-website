/**
 * Contact Section Controller
 * フォームの基本的なインタラクションを管理
 */
class ContactFormController {
  constructor() {
    this.form = document.getElementById('cabocia-contact-form');
    if (!this.form) {
      console.warn('Contact form not found. Controller will not initialize.');
      return;
    }

    this.otherToolCheckbox = document.getElementById('checkbox_other_tool_trigger');
    this.otherToolInput = this.form.querySelector('input[name="entry.1829487839.other_option_response"]');
    this.submitButton = document.getElementById('submitButton');
    this.responseMessageElement = document.getElementById('form-response-message');

    // グローバル変数 submitted を参照するため、windowオブジェクトにアクセス
    // (HTMLのiframe onloadから直接呼び出すため、クラスメソッドではなくグローバル関数として定義)
    window.handleFormSubmitResponse = this.handleFormSubmitResponse.bind(this);


    this.init();
  }

  init() {
    this.setupOtherToolInteraction();
    this.setupFormSubmissionState();
  }

  /**
   * 「連携を希望するツール」の「その他」チェックボックスとテキスト入力の連動
   */
  setupOtherToolInteraction() {
    if (this.otherToolCheckbox && this.otherToolInput) {
      this.otherToolCheckbox.addEventListener('change', () => {
        this.otherToolInput.disabled = !this.otherToolCheckbox.checked;
        if (!this.otherToolCheckbox.checked) {
          this.otherToolInput.value = ''; // チェックが外れたら入力内容をクリア
        } else {
          this.otherToolInput.focus();
        }
      });
      // 初期状態を設定
      this.otherToolInput.disabled = !this.otherToolCheckbox.checked;
    }
  }

  /**
   * フォーム送信時のボタン状態変更 (HTMLのonsubmitで基本的な処理はされているため、ここでは補足的)
   */
  setupFormSubmissionState() {
      if (this.form && this.submitButton) {
          this.form.addEventListener('submit', () => {
              // onsubmit属性で既に実行されているが、念のため
              this.submitButton.disabled = true;
              this.submitButton.textContent = '送信中...';
              window.submitted = true; // グローバル変数を設定
          });
      }
  }


  /**
   * iframeのonloadイベントから呼び出される関数
   * フォーム送信後の処理（サンキューメッセージ表示、フォームリセットなど）
   */
  handleFormSubmitResponse() {
    if (window.submitted) { // HTMLのonsubmitで設定されたグローバル変数を確認
      if (this.responseMessageElement && this.form && this.submitButton) {
        this.responseMessageElement.textContent = 'お申込みありがとうございます。担当者よりご連絡いたします。';
        this.responseMessageElement.style.display = 'block';
        this.responseMessageElement.style.backgroundColor = 'var(--color-success-lighter, #e6fffa)';
        this.responseMessageElement.style.color = 'var(--color-success-dark, #00704e)';
        this.responseMessageElement.style.border = '1px solid var(--color-success, #38a169)';

        this.form.reset();
        this.submitButton.disabled = false;
        this.submitButton.textContent = '上記内容で送信する';
        
        // 「その他」入力欄もリセット後の状態に合わせる
        if (this.otherToolInput && this.otherToolCheckbox) {
            this.otherToolInput.disabled = !this.otherToolCheckbox.checked; // チェックボックスの状態に依存
        }


        this.responseMessageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      window.submitted = false; // 次の送信のためにリセット
    }
  }
}

// DOMContentLoaded後に関数を実行
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cabocia-contact-form')) {
    new ContactFormController();
    console.log('ContactFormController initialized.');
  }
});