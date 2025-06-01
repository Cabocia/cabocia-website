// ===== Form Handling =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== フォーム要素の取得 =====
    
    const contactForm = document.querySelector('.contact-form');
    const inquiryTypeSelect = document.getElementById('inquiry-type');
    const companyNameInput = document.getElementById('company-name');
    const contactNameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dataUsageTextarea = document.getElementById('data-usage');
    const messageTextarea = document.getElementById('message');
    const privacyCheckbox = document.querySelector('input[name="privacy-agreement"]');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    
    
    // ===== バリデーション関数 =====
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePhone(phone) {
        // 日本の電話番号形式（ハイフンあり・なし両対応）
        const phoneRegex = /^[\d\-\(\)\+\s]{10,15}$/;
        return phone === '' || phoneRegex.test(phone);
    }
    
    function validateRequired(value) {
        return value.trim() !== '';
    }
    
    
    // ===== リアルタイムバリデーション =====
    
    function showFieldError(field, message) {
        removeFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--spacing-xs);
            animation: fadeInUp 0.3s ease;
        `;
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'var(--color-error)';
    }
    
    function removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }
    
    function showFieldSuccess(field) {
        removeFieldError(field);
        field.style.borderColor = 'var(--color-success)';
    }
    
    
    // ===== 各フィールドのバリデーション設定 =====
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !validateEmail(email)) {
                showFieldError(this, '有効なメールアドレスを入力してください');
            } else if (email && validateEmail(email)) {
                showFieldSuccess(this);
            } else {
                removeFieldError(this);
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (this.value.trim() && validateEmail(this.value.trim())) {
                showFieldSuccess(this);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.trim();
            if (phone && !validatePhone(phone)) {
                showFieldError(this, '有効な電話番号を入力してください');
            } else if (phone && validatePhone(phone)) {
                showFieldSuccess(this);
            } else {
                removeFieldError(this);
            }
        });
    }
    
    if (companyNameInput) {
        companyNameInput.addEventListener('blur', function() {
            if (!validateRequired(this.value)) {
                showFieldError(this, '会社名を入力してください');
            } else {
                showFieldSuccess(this);
            }
        });
    }
    
    if (contactNameInput) {
        contactNameInput.addEventListener('blur', function() {
            if (!validateRequired(this.value)) {
                showFieldError(this, 'ご担当者名を入力してください');
            } else {
                showFieldSuccess(this);
            }
        });
    }
    
    if (inquiryTypeSelect) {
        inquiryTypeSelect.addEventListener('change', function() {
            if (!validateRequired(this.value)) {
                showFieldError(this, 'お問い合わせ種別を選択してください');
            } else {
                showFieldSuccess(this);
                
                // 選択内容に応じてメッセージのプレースホルダーを変更
                if (messageTextarea) {
                    const placeholders = {
                        'tester': 'テスター参加にあたり、現在のデータ活用状況や課題について教えてください。',
                        'demo': 'デモをご希望の日時や、特に確認したい機能があれば教えてください。',
                        'document': '特に知りたい情報や、検討中の課題があれば教えてください。',
                        'consultation': '現在の課題や導入を検討している背景について教えてください。',
                        'other': 'お問い合わせの内容を詳しく教えてください。'
                    };
                    
                    messageTextarea.placeholder = placeholders[this.value] || messageTextarea.placeholder;
                }
            }
        });
    }
    
    
    // ===== フォーム送信処理 =====
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 全フィールドのバリデーション
            let isValid = true;
            const errors = [];
            
            // 必須フィールドのチェック
            if (!validateRequired(companyNameInput?.value || '')) {
                showFieldError(companyNameInput, '会社名を入力してください');
                isValid = false;
                errors.push('会社名');
            }
            
            if (!validateRequired(contactNameInput?.value || '')) {
                showFieldError(contactNameInput, 'ご担当者名を入力してください');
                isValid = false;
                errors.push('ご担当者名');
            }
            
            if (!validateRequired(emailInput?.value || '')) {
                showFieldError(emailInput, 'メールアドレスを入力してください');
                isValid = false;
                errors.push('メールアドレス');
            } else if (!validateEmail(emailInput.value.trim())) {
                showFieldError(emailInput, '有効なメールアドレスを入力してください');
                isValid = false;
                errors.push('メールアドレス（形式）');
            }
            
            if (!validateRequired(inquiryTypeSelect?.value || '')) {
                showFieldError(inquiryTypeSelect, 'お問い合わせ種別を選択してください');
                isValid = false;
                errors.push('お問い合わせ種別');
            }
            
            if (phoneInput?.value && !validatePhone(phoneInput.value.trim())) {
                showFieldError(phoneInput, '有効な電話番号を入力してください');
                isValid = false;
                errors.push('電話番号');
            }
            
            if (!privacyCheckbox?.checked) {
                showFieldError(privacyCheckbox.parentNode, 'プライバシーポリシーに同意してください');
                isValid = false;
                errors.push('プライバシーポリシー同意');
            }
            
            if (!isValid) {
                showMessage(`入力に不備があります: ${errors.join(', ')}`, 'error');
                
                // 最初のエラーフィールドにフォーカス
                const firstErrorField = contactForm.querySelector('.field-error');
                if (firstErrorField) {
                    const field = firstErrorField.parentNode.querySelector('input, select, textarea');
                    if (field) {
                        field.focus();
                        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
                return;
            }
            
            // フォームデータの収集
            const formData = {
                inquiryType: inquiryTypeSelect.value,
                companyName: companyNameInput.value.trim(),
                contactName: contactNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput?.value.trim() || '',
                dataUsage: dataUsageTextarea?.value.trim() || '',
                message: messageTextarea?.value.trim() || '',
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            };
            
            // 送信処理
            submitForm(formData);
        });
    }
    
    
    // ===== フォーム送信関数 =====
    
    async function submitForm(formData) {
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        
        try {
            // ローディング状態に変更
            submitButton.textContent = '送信中...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            
            // 実際の送信処理（ここではシミュレーション）
            // 本番環境では適切なAPIエンドポイントに送信
            const response = await simulateFormSubmission(formData);
            
            if (response.success) {
                // 成功時の処理
                showMessage('お問い合わせを受け付けました。ご連絡をお待ちください。', 'success');
                
                // フォームをリセット
                contactForm.reset();
                
                // エラー表示をクリア
                const errorElements = contactForm.querySelectorAll('.field-error');
                errorElements.forEach(el => el.remove());
                
                // 境界線の色をリセット
                const fields = contactForm.querySelectorAll('input, select, textarea');
                fields.forEach(field => {
                    field.style.borderColor = '';
                });
                
                // サンクスページへの誘導（オプション）
                setTimeout(() => {
                    const thanksSection = document.createElement('div');
                    thanksSection.innerHTML = `
                        <div style="
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.8);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            z-index: 10000;
                        ">
                            <div style="
                                background: white;
                                padding: 2rem;
                                border-radius: 1rem;
                                text-align: center;
                                max-width: 500px;
                                margin: 1rem;
                            ">
                                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">
                                    お問い合わせありがとうございます
                                </h3>
                                <p style="margin-bottom: 1.5rem; line-height: 1.6;">
                                    担当者より3営業日以内にご連絡いたします。<br>
                                    ご不明な点がございましたら、お気軽にお問い合わせください。
                                </p>
                                <button onclick="this.parentElement.parentElement.remove()" style="
                                    background: var(--color-primary);
                                    color: white;
                                    border: none;
                                    padding: 0.75rem 1.5rem;
                                    border-radius: 0.5rem;
                                    cursor: pointer;
                                ">
                                    閉じる
                                </button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(thanksSection);
                }, 1000);
                
            } else {
                throw new Error(response.message || '送信に失敗しました');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('送信に失敗しました。しばらく時間をおいて再度お試しください。', 'error');
            
        } finally {
            // ボタンを元の状態に戻す
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        }
    }
    
    
    // ===== フォーム送信のシミュレーション =====
    
    async function simulateFormSubmission(formData) {
        // 実際の実装では、ここでAPIに送信
        return new Promise((resolve) => {
            setTimeout(() => {
                // ログに出力（開発用）
                console.log('Form submitted:', formData);
                
                // 90%の確率で成功をシミュレート
                const success = Math.random() > 0.1;
                
                resolve({
                    success: success,
                    message: success ? 'Form submitted successfully' : 'Submission failed'
                });
            }, 2000); // 2秒の遅延をシミュレート
        });
    }
    
    
    // ===== オートセーブ機能 =====
    
    function saveFormData() {
        if (!contactForm) return;
        
        const formData = {
            inquiryType: inquiryTypeSelect?.value || '',
            companyName: companyNameInput?.value || '',
            contactName: contactNameInput?.value || '',
            email: emailInput?.value || '',
            phone: phoneInput?.value || '',
            dataUsage: dataUsageTextarea?.value || '',
            message: messageTextarea?.value || ''
        };
        
        try {
            localStorage.setItem('cabocia_form_draft', JSON.stringify(formData));
        } catch (e) {
            console.warn('Could not save form data to localStorage:', e);
        }
    }
    
    function loadFormData() {
        try {
            const savedData = localStorage.getItem('cabocia_form_draft');
            if (savedData) {
                const formData = JSON.parse(savedData);
                
                if (inquiryTypeSelect && formData.inquiryType) inquiryTypeSelect.value = formData.inquiryType;
                if (companyNameInput && formData.companyName) companyNameInput.value = formData.companyName;
                if (contactNameInput && formData.contactName) contactNameInput.value = formData.contactName;
                if (emailInput && formData.email) emailInput.value = formData.email;
                if (phoneInput && formData.phone) phoneInput.value = formData.phone;
                if (dataUsageTextarea && formData.dataUsage) dataUsageTextarea.value = formData.dataUsage;
                if (messageTextarea && formData.message) messageTextarea.value = formData.message;
            }
        } catch (e) {
            console.warn('Could not load form data from localStorage:', e);
        }
    }
    
    function clearFormData() {
        try {
            localStorage.removeItem('cabocia_form_draft');
        } catch (e) {
            console.warn('Could not clear form data from localStorage:', e);
        }
    }
    
    // フォーム入力時にオートセーブ
    const formFields = [
        inquiryTypeSelect,
        companyNameInput,
        contactNameInput,
        emailInput,
        phoneInput,
        dataUsageTextarea,
        messageTextarea
    ].filter(Boolean);
    
    formFields.forEach(field => {
        field.addEventListener('input', debounce(saveFormData, 1000));
        field.addEventListener('change', saveFormData);
    });
    
    // ページロード時に保存されたデータを復元
    loadFormData();
    
    // フォーム送信成功時に保存データをクリア
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            setTimeout(clearFormData, 3000); // 3秒後にクリア
        });
    }
    
    
    // ===== ユーティリティ関数 =====
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function showMessage(message, type = 'success') {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            ${type === 'success' 
                ? 'background-color: var(--color-success);' 
                : 'background-color: var(--color-error);'
            }
        `;
        
        document.body.appendChild(messageEl);
        
        // アニメーション
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // 自動削除
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 5000);
        
        // クリックで手動削除
        messageEl.addEventListener('click', () => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        });
    }
    
    
    // ===== フォーカス管理 =====
    
    // タブキーでのフォーカス順序を最適化
    const focusableElements = formFields.concat([submitButton]).filter(Boolean);
    
    focusableElements.forEach((element, index) => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && element.tagName !== 'TEXTAREA') {
                e.preventDefault();
                const nextIndex = index + 1;
                if (nextIndex < focusableElements.length) {
                    focusableElements[nextIndex].focus();
                } else {
                    // 最後の要素の場合、フォームを送信
                    if (submitButton) {
                        submitButton.click();
                    }
                }
            }
        });
    });
    
    console.log('Form handling initialized successfully');
});