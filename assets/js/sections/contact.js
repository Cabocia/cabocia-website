/**
 * Contact Section Controller
 * フォームのインタラクションと送信後の処理を管理
 */
class ContactFormController {
  constructor() {
    this.form = document.getElementById('cabocia-contact-form');
    // form要素が見つからない場合は、何もしない
    if (!this.form) {
      console.warn('Contact form not found. Controller will not initialize.');
      return;
    }

    // クラスのプロパティとしてフォーム関連の要素を保持
    this.otherToolCheckbox = document.getElementById('checkbox_other_tool_trigger');
    this.otherToolInput = this.form.querySelector('input[name="entry.1829487839.other_option_response"]');
    this.submitButton = document.getElementById('submitButton');
    this.responseMessageElement = document.getElementById('form-response-message');
    this.iframe = document.getElementById('hidden_iframe');
    this.submitted = false; // 送信状態を管理するフラグ

    this.init(); // 初期化メソッドを呼び出し
  }

  /**
   * イベントリスナーなどを設定する初期化メソッド
   */
  init() {
    this.setupOtherToolInteraction();
    this.setupFormSubmissionState();
    this.setupIframeListener(); // iframeのloadイベントリスナーを設定するメソッドを呼び出し
  }

  /**
   * 「連携を希望するツール」の「その他」チェックボックスとテキスト入力の連動
   */
  setupOtherToolInteraction() {
    if (this.otherToolCheckbox && this.otherToolInput) {
      this.otherToolCheckbox.addEventListener('change', () => {
        this.otherToolInput.disabled = !this.otherToolCheckbox.checked;
        if (!this.otherToolCheckbox.checked) {
          this.otherToolInput.value = '';
        } else {
          this.otherToolInput.focus();
        }
      });
      // 初期状態を設定
      this.otherToolInput.disabled = !this.otherToolCheckbox.checked;
    }
  }

  /**
   * フォーム送信時のボタン状態変更とフラグ設定
   */
  setupFormSubmissionState() {
      if (this.form && this.submitButton) {
          this.form.addEventListener('submit', () => {
              this.submitButton.disabled = true;
              this.submitButton.textContent = '送信中...';
              this.submitted = true; // クラスプロパティのフラグをtrueに
          });
      }
  }

  /**
   * iframeのloadイベントリスナーをJavaScriptで設定
   */
  setupIframeListener() {
      if (this.iframe) {
          // 'load'イベントが発生したら、handleFormSubmitResponseメソッドを実行
          this.iframe.addEventListener('load', () => {
              this.handleFormSubmitResponse();
          });
      }
  }

  /**
   * フォーム送信後の処理（サンキューメッセージ表示、フォームリセットなど）
   */
  handleFormSubmitResponse() {
    if (this.submitted) { // 送信フラグがtrueの場合のみ実行
      if (this.responseMessageElement && this.form && this.submitButton) {
        this.responseMessageElement.textContent = 'お申込みありがとうございます。担当者よりご連絡いたします。';
        this.responseMessageElement.style.display = 'block';
        this.responseMessageElement.style.backgroundColor = 'var(--color-success-lighter, #e6fffa)';
        this.responseMessageElement.style.color = 'var(--color-success-dark, #00704e)';
        this.responseMessageElement.style.border = '1px solid var(--color-success, #38a169)';

        this.form.reset(); // フォームの内容をリセット
        
        // 送信ボタンの状態を元に戻す
        this.submitButton.disabled = false;
        this.submitButton.textContent = '上記内容で送信する';

        // 「その他」のテキスト入力欄の状態もリセット後の状態に合わせる
        if (this.otherToolInput) {
            this.otherToolInput.disabled = true;
        }
        
        // ユーザーにメッセージが見えるようにスクロール
        this.responseMessageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      this.submitted = false; // 次の送信のためにフラグをリセット
    }
  }
}

// DOMが完全に読み込まれた後に関数を実行
document.addEventListener('DOMContentLoaded', () => {
  // お問い合わせフォームが存在すれば、コントローラーを初期化
  if (document.getElementById('cabocia-contact-form')) {
    new ContactFormController();
    console.log('ContactFormController initialized with JS-based iframe listener.');
  }
});