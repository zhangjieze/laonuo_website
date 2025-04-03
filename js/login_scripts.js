// 登录逻辑
function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username === '' || password === '') {
        displayError('请输入用户名和密码');
        return;
    }

    // 发送AJAX请求验证用户名和密码
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'login.asp', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                window.location.href = 'requirement.html?UserID=' + response.userID + '&Username=' + encodeURIComponent(response.username);
            } else {
                displayError(response.message);
            }
        }
    };

    xhr.send('username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password));
}

// 显示错误信息
function displayError(message) {
    var errorMessage = document.getElementById('error-message');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

// 找回密码功能
function showForgotPasswordOptions() {
    var options = confirm("是否选择回答密保问题找回密码？");

    if (options) {
        window.location.href = 'answer-security.html';
    } else {
        alert("请联系工作人员");
    }
}

// 注册功能跳转
function goToRegister() {
    window.location.href = 'register.html';
}

// 注册用户逻辑
function registerUser() {
    var username = document.getElementById('reg-username').value;
    var email = document.getElementById('reg-email').value;
    var password = document.getElementById('reg-password').value;
    var confirmPassword = document.getElementById('reg-confirm-password').value;

    if (username === '' || email === '' || password === '' || confirmPassword === '') {
        displayError("请填写所有字段");
        return;
    }

    if (password !== confirmPassword) {
        displayError("两次输入的密码不一致");
        return;
    }

    if (!validateEmail(email)) {
        displayError("请输入有效的电子邮件地址");
        return;
    }

    if (password.length < 8 || password.length > 25 || /^\d+$/.test(password)) {
        displayError("密码必须为8~25个字符，且不能全是数字");
        return;
    }

    // AJAX请求发送注册信息到ASP处理页面
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "register.asp", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert('注册成功！');
                if (confirm("是否需要设置密保问题？")) {
                    window.location.href = 'set-security.html?UserID=' + response.userID;
                } else {
                    window.location.href = 'login.html';
                }
            } else {
                displayError(response.message);
            }
        }
    };

    xhr.send("username=" + encodeURIComponent(username) + 
             "&email=" + encodeURIComponent(email) + 
             "&password=" + encodeURIComponent(password));
}

// 电子邮件验证函数
function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 解析URL参数
function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 设置密保问题
function setSecurityQuestion() {
    var question = document.getElementById('security-question').value;
    var answer = document.getElementById('security-answer').value;

    if (question === '' || answer === '') {
        displayError("请填写密保问题和答案");
        return;
    }

    if (answer.length > 20) {
        displayError("答案不能超过20字");
        return;
    }
    // AJAX请求发送密保问题到ASP处理页面
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "set-security.asp", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert("密保问题设置成功！");
                window.location.href = 'login.html';
            } else {
                displayError(response.message);
            }
        }
    };

    xhr.send("userID=" + encodeURIComponent(userID) + 
             "&question=" + encodeURIComponent(question) + 
             "&answer=" + encodeURIComponent(answer));
}

// 返回登录页面
function goToLogin() {
    window.location.href = 'login.html';
}

// 获取密保问题逻辑
function getSecurityQuestion() {
    var email = document.getElementById('user-email').value;

    if (email === '') {
        displayError("请输入用户名或电子邮件");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "get-security-question.asp", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                document.getElementById('security-question').innerText = response.securityQuestion;
                document.getElementById('security-question-container').style.display = 'block';
                window.userID = response.userID; // 保存 userID 用于后续操作
                // alert(userID);
            } else {
                displayError(response.message);
            }
        }
    };

    xhr.send("email=" + encodeURIComponent(email));
}

// 验证密保问题答案逻辑
function verifySecurityAnswer() {
    var answer = document.getElementById('security-answer').value;

    if (answer === '') {
        displayError("请输入答案");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "verify-security-answer.asp", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert("验证成功，请重置您的密码！");
                // alert(window.userID);
                window.location.href = 'reset-password.html?UserID=' + window.userID;
            } else {
                displayError(response.message);
            }
        }
    };

    xhr.send("userID=" + encodeURIComponent(window.userID) + "&answer=" + encodeURIComponent(answer));
}

// 重置密码逻辑
function resetPassword() {
    var newPassword = document.getElementById('new-password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword === '' || confirmPassword === '') {
        displayError("请填写所有字段");
        return;
    }

    if (newPassword !== confirmPassword) {
        displayError("两次输入的密码不一致");
        return;
    }

    var userID = getQueryParam('UserID');
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "reset-password.asp", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert("密码重置成功！");
                window.location.href = 'login.html';
            } else {
                displayError(response.message);
            }
        }
    };

    xhr.send("userID=" + encodeURIComponent(userID) + "&newPassword=" + encodeURIComponent(newPassword));
}
