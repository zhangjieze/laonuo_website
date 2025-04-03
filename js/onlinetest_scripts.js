let startTime;
let score = 0;
const userAnswers = {};
const correctAnswers = {
    0: "C. {-2}", // 单选题
    1: "A. -i",      // 单选题
    2: "D. λμ=-1",   // 单选题
    3: "D. [2,+∞)",   // 单选题
    4: ["A. f(0)=0", "B. f(1)=0", "C. f(x) 是偶函数"], // 多选题
    5: ["A. 直径为 0.99m 的球体", "B. 所有棱长均为 1.4m 的四面体", "D. 底面直径为 1.2m, 高为 0.01m 的圆柱体"], // 多选题
    6: "64",         // 填空题
    7: "[2,3)"   // 填空题
};

function startCountdown() {
    let countdown = 5;
    const button = document.getElementById("startButton");
    
    const interval = setInterval(() => {
        countdown--;
        button.textContent = countdown > 0 ? `请稍候... (${countdown}s)` : "开始考试";
        
        if (countdown === 0) {
            clearInterval(interval);
            button.disabled = false;
            button.classList.add("enabled");
            button.textContent = "开始考试";
            button.addEventListener("click", function() {
                window.location.href = 'onlinetest.html?UserID=' + userID + '&Username=' + encodeURIComponent(userName);  // 跳转到正式考试页面
            });
        }
    }, 1000);
}

// 倒计时函数，略作调整使其与提交逻辑结合
function updateTimeAndCountdown() {
    const examDuration = 30 * 60 * 1000; // 30分钟
    const endTime = new Date(startTime + examDuration);

    const intervalId = setInterval(function() {
        const currentTime = new Date();
        document.getElementById('current-time').textContent = currentTime.toLocaleDateString() + ' ' + currentTime.toLocaleTimeString();

        const timeLeft = endTime - currentTime;
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            document.getElementById('countdown-timer').textContent = "时间到！";
            document.getElementById('countdown-timer').style.color = 'red';
            submitAllForms(); // 自动提交
        } else {
            let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            document.getElementById('countdown-timer').textContent = `剩余 ${minutes} 分钟 ${seconds} 秒`;

            if (minutes < 10) {
                document.getElementById('countdown-timer').style.color = 'red';
            }
        }
    }, 1000);
}

// 开始计数
window.onload = function() {
    startTime = Date.now();
    updateTimeAndCountdown();
};

// 设置用户信息
function setupUserInfo() {
    const userName = getQueryParam('Username');
    const userID = getQueryParam('UserID');
    document.getElementById('profile_name').textContent = `用户名: ${userName}`;
    document.getElementById('profile_id').textContent = `编号: ${userID}`;
}

// 获取URL中的查询参数
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 问候语设置
function setGreeting() {
    const hour = new Date().getHours();
    let greeting;
    if (hour >= 5 && hour < 12) greeting = "早上好!";
    else if (hour >= 12 && hour < 18) greeting = "下午好!";
    else greeting = "晚上好!";
    document.getElementById('greeting').textContent = greeting;
}

// 初始化答题卡
function initializeAnswerCard() {
    const totalQuestions = questions.length;
    for (let i = 1; i <= totalQuestions; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.id = 'q' + i;
        button.className = 'unanswered';
        button.onclick = function() {
            goToQuestion(i - 1);
        };
        document.getElementById('answer-buttons').appendChild(button);
    }
}

// 题目与选项数据
const questions = [
    { text: "1. 已知 M={-2,-1,0,1,2}, N={x|x² - x - 6≥0}, 则 M∩N =", type: "single", options: ["A. {-2,-1,0,1}", "B. {0,1,2}", "C. {-2}", "D. 2"] },
    { text: "2. 已知 z=(1-i)/(2+2i), 则 z - z̅ =", type: "single", options: ["A. -i", "B. i", "C. 0", "D. 1"] },
    { text: "3. 已知向量 a=(1,1), b=(1,-1), 若 (a+λb)⊥(a+μb), 则", type: "single", options: ["A. λ+μ=1", "B. λ+μ=-1", "C. λμ=1", "D. λμ=-1"] },
    { text: "4. 设函数 f(x)=2^(x(x-a)) 在区间 (0,1) 上单调递减, 则 a 的取值范围是", type: "single", options: ["A. (-∞,-2]", "B. [-2,0)", "C. (0,2]", "D. [2,+∞)"] },
    { text: "5. 已知函数 f(x) 的定义域为 R, f(xy)=y²f(x)+x²f(y), 则", type: "multiple", options: ["A. f(0)=0", "B. f(1)=0", "C. f(x) 是偶函数", "D. x=0 为 f(x) 的极小值点"] },
    { text: "6. 下列物体中能够被整体放入棱长为 1m 的正方体容器(忽略容器壁厚度)内的有", type: "multiple", options: ["A. 直径为 0.99m 的球体", "B. 所有棱长均为 1.4m 的四面体", "C. 底面直径为 0.01m, 高为 1.8m 的圆柱体", "D. 底面直径为 1.2m, 高为 0.01m 的圆柱体"] },
    { text: "7. 某学校开设了4门体育类选修课和4门艺术类选修课, 学生需从这8门课中选修2门或3门课, 并且每类选修课至少选修1门, 则不同的选课方案共有____种(用数字作答).", type: "fill-in-the-blank" },
    { text: "8. 已知函数 f(x)=cos(ωx)-l(ω>0) 在区间 [0,2π] 有且仅有3个零点, 则 ω 的取值范围是", type: "fill-in-the-blank" }
];

let currentQuestionIndex = 0;
function loadQuestion(index) {
    const question = questions[index];
    document.getElementById('current-question-text').textContent = question.text;

    const optionsTable = document.getElementById('options-table');
    optionsTable.innerHTML = ''; // 清除现有选项

    if (question.type === "single") {
        // 单选题
        question.options.forEach((option, i) => {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            const isChecked = userAnswers[index] === option; // 检查是否已被选中

            td.innerHTML = `
                <label>
                    <input type="radio" name="question${index + 1}" value="${option}" ${isChecked ? 'checked' : ''}> ${option}
                </label>
            `;
            row.appendChild(td);
            optionsTable.appendChild(row);

            const radioButton = td.querySelector('input[type="radio"]');
            radioButton.addEventListener('change', function() {
                userAnswers[index] = option; // 保存单选题答案
                updateAnswerCard(index); // 更新答题卡状态
            });
        });

    } else if (question.type === "multiple") {
        // 多选题
        question.options.forEach((option, i) => {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            const isChecked = userAnswers[index] && userAnswers[index].includes(option); // 检查是否已被选中

            td.innerHTML = `
                <label>
                    <input type="checkbox" name="question${index + 1}" value="${option}" ${isChecked ? 'checked' : ''}> ${option}
                </label>
            `;
            row.appendChild(td);
            optionsTable.appendChild(row);

            const checkBox = td.querySelector('input[type="checkbox"]');
            checkBox.addEventListener('change', function() {
                if (!userAnswers[index]) {
                    userAnswers[index] = [];
                }

                if (checkBox.checked) {
                    userAnswers[index].push(option); // 添加选项到数组
                } else {
                    userAnswers[index] = userAnswers[index].filter(o => o !== option); // 移除选项
                }
                updateAnswerCard(index); // 更新答题卡状态
            });
        });

    } else if (question.type === "fill-in-the-blank") {
        // 填空题
        const row = document.createElement('tr');
        const td = document.createElement('td');
        const savedAnswer = userAnswers[index] || ''; // 获取之前保存的答案

        td.innerHTML = `<input type="text" name="question${index + 1}" value="${savedAnswer}" placeholder="请输入答案">`;
        row.appendChild(td);
        optionsTable.appendChild(row);

        const textInput = td.querySelector('input[type="text"]');
        textInput.addEventListener('input', function() {
            userAnswers[index] = textInput.value; // 保存填空题答案
            updateAnswerCard(index); // 更新答题卡状态
        });
    }

    updateAnswerCard(index); // 每次加载题目时，更新答题卡状态
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        saveCurrentAnswer(); // 切换前保存当前题目的作答信息
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        saveCurrentAnswer();
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
    }
}

// 切换到指定题目
function goToQuestion(index) {
    saveCurrentAnswer();
    currentQuestionIndex = index; // 更新当前题目索引
    loadQuestion(index); // 加载新题目
}

// 保存当前题目的答案
function saveCurrentAnswer() {
    const question = questions[currentQuestionIndex];
    if (question.type === "single") {
        const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex + 1}"]:checked`);
        if (selectedOption) {
            userAnswers[currentQuestionIndex] = selectedOption.value; // 保存单选题答案
        }
    } else if (question.type === "multiple") {
        const selectedOptions = [...document.querySelectorAll(`input[name="question${currentQuestionIndex + 1}"]:checked`)];
        userAnswers[currentQuestionIndex] = selectedOptions.map(option => option.value); // 保存多选题答案
    } else if (question.type === "fill-in-the-blank") {
        const textInput = document.querySelector(`input[name="question${currentQuestionIndex + 1}"]`);
        if (textInput) {
            userAnswers[currentQuestionIndex] = textInput.value; // 保存填空题答案
        }
    }
}

function markQuestion() {
    document.getElementById('q' + (currentQuestionIndex + 1)).classList.add('marked');
}

function removeMarkQuestion() {
    document.getElementById('q' + (currentQuestionIndex + 1)).classList.remove('marked');
}

// 更新答题卡状态
function updateAnswerCard(index) {
    const button = document.getElementById('q' + (index + 1));
    if (userAnswers[index] && userAnswers[index].length > 0) {
        button.classList.remove('unanswered');
        button.classList.add('answered');
    } else {
        button.classList.remove('answered');
        button.classList.add('unanswered');
    }
}

// 交卷确认弹窗
function confirmSubmit() {
    const confirmSubmit = confirm("你确定要交卷吗？");
    if (confirmSubmit) {
        submitExam();
    }
}

// 自动交卷倒计时结束时调用
function submitAllForms() {
    alert("考试时间到，系统将自动交卷！");
    submitExam();
}

// 提交并批改
function submitExam() {
    saveCurrentAnswer(); // 保存当前作答
    calculateScore();    // 计算得分
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // 总作答时间（秒）
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    // 向用户展示分数和作答时长
    alert(`总分：${score} 分\n作答时长：${minutes} 分钟 ${seconds} 秒`);

    // 提交数据到数据库
    sendDataToServer(score, `${minutes} 分钟 ${seconds} 秒`);

    // 跳转到排行榜页面
    const userName = getQueryParam('Username');
    window.location.href = 'ranking.asp?Username=' + userName;
}

// 计算分数
function calculateScore() {
    score = 0;

    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = correctAnswers[index];

        if (question.type === "single") {
            // 单选题
            if (userAnswer === correctAnswer) {
                score += 5;
            }
        } else if (question.type === "multiple") {
            // 多选题
            if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                if (userAnswer.length === correctAnswer.length &&
                    userAnswer.every(val => correctAnswer.includes(val))) {
                    score += 5; // 全对
                } else if (userAnswer.every(val => correctAnswer.includes(val))) {
                    score += 2; // 部分正确
                }
            }
        } else if (question.type === "fill-in-the-blank") {
            // 填空题
            if (userAnswer === correctAnswer) {
                score += 5;
            }
        }
    });
}

// 使用 AJAX 提交数据到数据库
function sendDataToServer(finalScore, totalTime) {
    const userName = getQueryParam('Username');

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "onlinetest.asp", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // 编码请求数据
    const data = `s_name=${encodeURIComponent(userName)}&s_score=${encodeURIComponent(finalScore)}&s_time=${encodeURIComponent(totalTime)}`;
    xhr.send(data);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);

                    if (response.success) {
                        alert('成绩提交成功！' + response.message);
                    } else {
                        displayError(response.message); // 显示错误信息
                    }
                } catch (e) {
                    console.error("解析服务器响应时出错：", e);
                    displayError("提交失败，服务器响应错误。");
                }
            } else {
                displayError("提交失败，服务器未响应。");
            }
        }
    };
}

// 显示错误信息
function displayError(message) {
    alert("错误：" + message);
}
