// 简单的消息提示函数
function showMessage(message, type = 'info', duration = 3000) {
    // 尝试使用Element UI的消息组件
    if (window.ELEMENT && window.ELEMENT.Message) {
        window.ELEMENT.Message({
            message: message,
            type: type,
            duration: duration
        });
    } else {
        // 备用方案：使用浏览器原生提示
        if (type === 'error') {
            alert('错误：' + message);
        } else if (type === 'success') {
            alert('成功：' + message);
        } else if (type === 'warning') {
            alert('警告：' + message);
        } else {
            alert(message);
        }
    }
}

if (parent.callback) {
    //如果是在子框架内就把首页刷新
    parent.callback();
}

// 更新当前时间
function updateCurrentTime() {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeStr;
    }
}

// 每秒更新时间
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); // 立即更新一次

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Alt + Enter 快速登录
    if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        if (window.loginApp) {
            window.loginApp.login();
        }
    }
    
    // Escape 清空表单
    if (e.key === 'Escape') {
        if (window.loginApp) {
            window.loginApp.username = '';
            window.loginApp.password = '';
            window.loginApp.rememberMe = false;
        }
    }
});

// 登录尝试次数限制
let loginAttempts = 0;
const maxAttempts = 5;
const lockoutTime = 5 * 60 * 1000; // 5分钟

// 检查是否被锁定
function isLockedOut() {
    const lockoutEndTime = localStorage.getItem('loginLockoutEnd');
    if (lockoutEndTime && new Date().getTime() < parseInt(lockoutEndTime)) {
        return true;
    }
    return false;
}

// 设置锁定
function setLockout() {
    const lockoutEnd = new Date().getTime() + lockoutTime;
    localStorage.setItem('loginLockoutEnd', lockoutEnd.toString());
    localStorage.setItem('loginAttempts', '0');
}

// 等待DOM完全加载后立即创建Vue实例
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载，准备初始化Vue实例');
    
    // 检查.login-main元素是否存在
    const loginMainElement = document.querySelector('.login-main');
    console.log('login-main元素:', loginMainElement);
    
    if (!loginMainElement) {
        console.error('找不到 .login-main 元素，延迟重试...');
        // 如果找不到，稍等片刻再试
        setTimeout(function() {
            const retryElement = document.querySelector('.login-main');
            if (retryElement) {
                console.log('重试成功，找到 .login-main 元素');
                createVueApp();
            } else {
                console.error('重试失败，仍然找不到 .login-main 元素');
            }
        }, 500);
        return;
    }
    
    createVueApp();
    
    // 其他初始化代码
    initializeOtherFeatures();
});

function createVueApp() {
    // 检查是否已经存在Vue实例
    if (window.loginApp) {
        console.log('Vue实例已存在，扩展功能...');
        // 扩展已有实例的功能
        extendExistingVueApp();
        return;
    }
    
    try {
        console.log('开始创建新的Vue实例...');
        
        window.loginApp = new Vue({
            el: '.login-main',
            data: function() {
                return {
                    username: '',
                    password: '',
                    loading: false,
                    rememberMe: false,
                    showPasswordStrength: false,
                    passwordStrength: 0
                };
            },
    watch: {
        // 监听器将在extendExistingVueApp中添加
    },
    mounted: function() {
        // 挂载功能将在extendExistingVueApp中处理
    },
    methods: {
        // 方法将在extendExistingVueApp中添加
    }
    });
        
        console.log('Vue实例创建成功');
        
        // 检查Vue实例的数据
        console.log('Vue实例数据:', window.loginApp.$data);
        
    } catch (error) {
        console.error('Vue实例创建失败:', error);
    }
}

// 扩展已有Vue实例的功能
function extendExistingVueApp() {
    if (!window.loginApp) return;
    
    console.log('扩展现有Vue实例功能...');
    
    // 添加watch属性
    if (!window.loginApp.$options.watch) {
        window.loginApp.$options.watch = {};
    }
    
    // 添加监听器
    window.loginApp.$options.watch.username = function(newVal) {
        if (newVal.length > 0) {
            this.validateUsername();
        }
    };
    
    window.loginApp.$options.watch.password = function(newVal) {
        this.passwordStrength = this.calculatePasswordStrength(newVal);
        this.showPasswordStrength = newVal.length > 0;
    };
    
    // 添加方法
    Object.assign(window.loginApp, {
        login: function () {
            // 检查是否被锁定
            if (isLockedOut()) {
                const lockoutEndTime = localStorage.getItem('loginLockoutEnd');
                const remainingTime = Math.ceil((parseInt(lockoutEndTime) - new Date().getTime()) / 60000);
                showMessage(`登录被锁定，请 ${remainingTime} 分钟后再试`, 'error');
                return;
            }
            
            this.loading = true;
            
            // 表单验证
            if (this.username === "" || this.password === "") {
                showMessage("请输入用户名和密码！", 'error');
                this.loading = false;
                return;
            }
            
            if (this.username.length < 2) {
                showMessage("用户名至少需要2个字符！", 'error');
                this.loading = false;
                return;
            }
            
            if (this.password.length < 4) {
                showMessage("密码至少需要4个字符！", 'error');
                this.loading = false;
                return;
            }
            
            // 记录登录尝试
            loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
            localStorage.setItem('loginAttempts', loginAttempts.toString());
            
            // 检查尝试次数
            if (loginAttempts >= maxAttempts) {
                setLockout();
                showMessage("登录尝试次数过多，账户已被锁定5分钟！", 'error');
                this.loading = false;
                return;
            }
            
            // 处理记住登录状态
            if (this.rememberMe) {
                localStorage.setItem('rememberedUsername', this.username);
                localStorage.setItem('rememberLogin', 'true');
            } else {
                localStorage.removeItem('rememberedUsername');
                localStorage.removeItem('rememberLogin');
            }
            
            // 显示登录中状态
            showMessage("正在验证登录信息...", 'info', 0);
            
            // 使用AJAX提交登录请求
            this.submitLoginForm();
        },
        
        // 新增：提交登录表单的方法
        submitLoginForm: function() {
            const self = this;
            const form = document.getElementById('login-form');
            const formData = new FormData(form);
            
            // 添加Vue数据到表单
            formData.set('username', this.username);
            formData.set('password', this.password);
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            })
            .then(response => {
                if (response.ok) {
                    // 登录成功，直接跳转到管理后台主页
                    showMessage('登录成功，正在跳转...', 'success', 1000);
                    
                    // 清除登录尝试记录
                    localStorage.setItem('loginAttempts', '0');
                    localStorage.removeItem('loginLockoutEnd');
                    
                    // 延迟一秒后跳转，让用户看到成功提示
                    setTimeout(() => {
                        // 强制跳转到管理后台主页
                        window.location.href = '/admin/';
                    }, 1000);
                } else {
                    // 登录失败，显示错误信息
                    return response.text().then(text => {
                        self.loading = false;
                        // 尝试解析错误信息
                        if (text.includes('用户名') || text.includes('密码') || text.includes('username') || text.includes('password')) {
                            showMessage('用户名或密码错误！', 'error');
                        } else if (text.includes('请输入') || text.includes('required')) {
                            showMessage('请输入用户名和密码！', 'error');
                        } else {
                            showMessage('登录失败，请检查用户名和密码！', 'error');
                        }
                    });
                }
            })
            .catch(error => {
                console.error('登录请求失败:', error);
                self.loading = false;
                showMessage('网络连接错误，请检查网络后重试！', 'error');
            });
        },
        
        // 验证用户名
        validateUsername: function() {
            const username = this.username.trim();
            if (username.length < 2) {
                return false;
            }
            // 检查特殊字符
            const invalidChars = /[<>'"&]/;
            if (invalidChars.test(username)) {
                showMessage("用户名包含无效字符", 'warning');
                return false;
            }
            return true;
        },
        
        // 计算密码强度
        calculatePasswordStrength: function(password) {
            let strength = 0;
            if (password.length >= 8) strength += 25;
            if (/[a-z]/.test(password)) strength += 25;
            if (/[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 25;
            if (/[^A-Za-z0-9]/.test(password)) strength += 25;
            return Math.min(100, strength);
        },
        
        // 检查记住的登录状态
        checkRememberedLogin: function() {
            const remembered = localStorage.getItem('rememberLogin');
            const rememberedUsername = localStorage.getItem('rememberedUsername');
            
            if (remembered === 'true' && rememberedUsername) {
                this.username = rememberedUsername;
                this.rememberMe = true;
            }
        },
        
        // 添加输入框焦点效果
        addInputFocusEffects: function() {
            const inputs = document.querySelectorAll('.el-input__inner');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('focused');
                    }
                });
            });
        },
        
        // 清空表单
        clearForm: function() {
            this.username = '';
            this.password = '';
            this.rememberMe = false;
            this.showPasswordStrength = false;
        }
    });
    
    // 初始化功能
    setTimeout(() => {
        if (window.loginApp.checkRememberedLogin) {
            window.loginApp.checkRememberedLogin();
        }
        if (window.loginApp.addInputFocusEffects) {
            window.loginApp.addInputFocusEffects();
        }
        
        // 检查锁定状态
        if (isLockedOut()) {
            const lockoutEndTime = localStorage.getItem('loginLockoutEnd');
            const remainingTime = Math.ceil((parseInt(lockoutEndTime) - new Date().getTime()) / 60000);
            showMessage(`登录被锁定，请 ${remainingTime} 分钟后再试`, 'error');
        }
    }, 100);
}

// 初始化其他功能
function initializeOtherFeatures() {
    // 检查用户布局偏好
    const isSimpleMode = localStorage.getItem('simpleLoginMode') === 'true';
    const decorator = document.getElementById('loginDecorator');
    
    if (isSimpleMode && decorator) {
        decorator.classList.add('simple-mode');
        const toggleButton = document.querySelector('.layout-toggle button i');
        if (toggleButton) {
            toggleButton.className = 'fas fa-compress-arrows-alt';
        }
    }
    
    // 添加粒子效果优化
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        // 鼠标移动视差效果
        document.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            particlesContainer.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        });
    }
    
    // 添加登录表单动画
    const loginMain = document.querySelector('.login-main');
    if (loginMain) {
        setTimeout(() => {
            loginMain.style.opacity = '1';
            loginMain.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // 自动检测屏幕尺寸，小屏幕自动启用简化模式
    if (window.innerWidth <= 768 && !isSimpleMode) {
        toggleLayout();
    }
}

// 成功登录后清除尝试次数
window.addEventListener('beforeunload', function() {
    // 如果正在加载（登录中），说明可能成功了
    if (window.loginApp && window.loginApp.loading) {
        localStorage.setItem('loginAttempts', '0');
        localStorage.removeItem('loginLockoutEnd');
    }
});

// 布局切换功能
function toggleLayout() {
    const decorator = document.getElementById('loginDecorator');
    if (decorator) {
        decorator.classList.toggle('simple-mode');
        
        // 保存用户偏好
        const isSimple = decorator.classList.contains('simple-mode');
        localStorage.setItem('simpleLoginMode', isSimple);
        
        // 更新按钮图标
        const toggleButton = document.querySelector('.layout-toggle button i');
        if (toggleButton) {
            if (isSimple) {
                toggleButton.className = 'fas fa-compress-arrows-alt';
            } else {
                toggleButton.className = 'fas fa-expand-arrows-alt';
            }
        }
    }
}
