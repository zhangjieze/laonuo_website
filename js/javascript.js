let startTime;
let score = 0;

window.onload = function()
{
    startTime = Date.now();
    setEqualHeight();
    initializeAnswerCard();
    updateTimeAndCountdown();
    setGreeting();
};

function updateTimeAndCountdown()
{
    const startTime = Date.now();
    const examDuration = 30 * 60 * 1000; // 30分钟的毫秒数
    const endTime = new Date(startTime + examDuration);

    const intervalId = setInterval(function()
    {
        const currentTime = new Date();
        document.getElementById('current-time').textContent = currentTime.toLocaleDateString() + ' ' + currentTime.toLocaleTimeString();

        const timeLeft = endTime - currentTime;
        if (timeLeft <= 0)
        {
            clearInterval(intervalId); // 停止计时器
            document.getElementById('countdown-timer').textContent = "Time's up!";
            document.getElementById('countdown-timer').style.color = 'red';
            submitAllForms(); // 在时间到了之后提交所有表单
        }
        else
        {
            let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            document.getElementById('countdown-timer').textContent = "剩余 " + minutes + "m " + seconds + "s";
            if (minutes < 10)
            {
                document.getElementById('countdown-timer').style.color = 'red';
            }
            else
            {
                document.getElementById('countdown-timer').style.color = 'black';
            }
        }
    }, 1000);
}

function setGreeting()
{
    const hour = new Date().getHours();
    let greeting;
    if (hour >= 5 && hour < 12)
    {
        greeting = "早上好!";
    }
    else if (hour >= 12 && hour < 18)
    {
        greeting = "下午好!";
    }
    else
    {
        greeting = "晚上好!";
    }
    document.getElementById('greeting').textContent = greeting;
}


function setEqualHeight()
{
    var side = document.querySelector('.side');
    var middle = document.querySelector('.middle');
    var maxHeight = Math.max(side.offsetHeight, middle.offsetHeight);
    side.style.height = maxHeight + 'px';
    middle.style.height = maxHeight + 'px';
}

function initializeAnswerCard()
{
    // 绑定事件监听器
    var inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"], input[type="text"]');
    inputs.forEach(function(input)
    {
        input.addEventListener('change', function()
        {
            var questionNumber = this.name.replace(/[^0-9]/g, '');
            updateAnswerCard(questionNumber);
        });
    });
}

function updateAnswerCard(questionNumber)
{
    var answered = false;
    // 判断问题是否被回答
    var inputs = document.querySelectorAll('input[name="question' + questionNumber + '"]');
    inputs.forEach(function(input)
    {
        if (input.type === 'radio' || input.type === 'checkbox')
        {
            if (input.checked)
            {
                answered = true;
            }
        }
        else if (input.type === 'text')
        {
            if (input.value.trim() !== '')
            {
                answered = true;
            }
        }
    });

    // 根据问题是否被回答更新答题卡颜色
    var answerLink = document.getElementById('q' + questionNumber);
    if (answered)
    {
        answerLink.classList.add('answered');
    }
    else
    {
        answerLink.classList.remove('answered');
    }
}

function resetAllAnswers()
{
    var inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"], input[type="text"]');
    inputs.forEach(function(input)
    {
        if (input.type === 'radio' || input.type === 'checkbox')
        {
            input.checked = false;
        }
        else if (input.type === 'text')
        {
            input.value = '';
        }
    });
    var answerLinks = document.querySelectorAll('.answer-card a');
    answerLinks.forEach(function(link)
    {
        link.classList.remove('answered');
    });
}

function scoreAnswers()
{
    if (document.getElementById('1-c').checked) score += 5;
    if (document.getElementById('2-a').checked) score += 5;
    if (document.getElementById('3-d').checked) score += 5;
    if (document.getElementById('4-d').checked) score += 5;
    score += checkMultiChoice('question5', ['A', 'B', 'C']);
    score += checkMultiChoice('question6', ['A', 'B', 'D']);
    score += checkFillInTheBlank('question7', '64');
    score += checkFillInTheBlank('question8', '[2,3)');
}

function checkMultiChoice(questionName, correctAnswers)
{
    const checkboxes = document.querySelectorAll(`input[name="${questionName}"]`);
    let selectedAnswers = [];
    let hasIncorrect = false;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked)
        {
            selectedAnswers.push(checkbox.value);
            if (!correctAnswers.includes(checkbox.value))
            {
                hasIncorrect = true;
            }
        }
    });

    if (hasIncorrect || selectedAnswers.length === 0)
    {
        return 0; // 有选错或不选
    }
    else if (selectedAnswers.length === correctAnswers.length && correctAnswers.every(val => selectedAnswers.includes(val)))
    {
        return 5; // 全部选对
    }
    else if (!hasIncorrect && selectedAnswers.length < correctAnswers.length)
    {
        return 3; // 漏选
    }
    return 0; // 其他情况也算选错
}

function checkFillInTheBlank(questionId, correctAnswer)
{
    const userAnswer = document.getElementById(questionId).value.trim();
    return userAnswer === correctAnswer ? 5 : 0; // 严格相等则得5分，否则得0分
}

function submitAllForms()
{
    const endTime = Date.now();
    const duration = endTime - startTime;
    const totalMinutes = Math.floor(duration / 60000);
    const totalSeconds = ((duration % 60000) / 1000).toFixed(0);
    scoreAnswers();
    alert(`您的总成绩是：${score} 分。您的总作答时间为：${totalMinutes} 分钟 ${totalSeconds} 秒`);
    document.getElementById('form1').submit();
    document.getElementById('form2').submit();
    document.getElementById('form3').submit();
}
