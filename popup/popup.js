document.addEventListener('DOMContentLoaded', function () {

    // 自动QA
    var autoQaBtn = document.getElementById('auto-qa-btn');
    // 修改自动QA按钮
    changeAutoQaBtn();

    function changeAutoQaBtn() {
        chrome.storage.local.get('openAutoQq', ({openAutoQq}) => {
            console.log('openAutoQq=' + openAutoQq)
            if (openAutoQq) {
                autoQaBtn.textContent = '停止自动QA'
                autoQaBtn.style.backgroundColor = '#3aa757';
                autoQaBtn.dataset.open = 'true';
            } else {
                autoQaBtn.textContent = '开启自动QA'
                autoQaBtn.style.backgroundColor = '#FFA500';
                autoQaBtn.dataset.open = 'false';
            }
        });
    }

    // 自动QA处理响应消息的函数
    function autoQaHandleRespMsg(resp) {
        console.log(resp);
        changeAutoQaBtn();
    }

    // 自动QA事件绑定
    autoQaBtn.addEventListener('click', function () {
        reqMsgToBg(autoQaAction, autoQaBtn.dataset.open === 'false', autoQaHandleRespMsg)
    });



    // QA学习
    var learnQaBtn = document.getElementById('learn-qa-btn');
    // 修改QA学习按钮
    changeLearnQaBtn();

    function changeLearnQaBtn() {
        chrome.storage.local.get('learnAutoQq', ({learnAutoQq}) => {
            console.log('learnAutoQq=' + learnAutoQq)
            if (learnAutoQq) {
                learnQaBtn.textContent = '停止QA学习'
                learnQaBtn.style.backgroundColor = '#3aa757';
                learnQaBtn.dataset.open = 'true';
            } else {
                learnQaBtn.textContent = '开启QA学习'
                learnQaBtn.style.backgroundColor = '#FFA500';
                learnQaBtn.dataset.open = 'false';
            }
        });
    }

    // QA学习处理响应消息的函数
    function learnQaHandleRespMsg(resp) {
        console.log(resp);
        changeLearnQaBtn();
    }

    // QA学习事件绑定
    learnQaBtn.addEventListener('click', function () {
        console.log(learnQaBtn.dataset.open === 'false');
        reqMsgToBg(learnQaAction, learnQaBtn.dataset.open === 'false', learnQaHandleRespMsg)
    });

    // 发送消息到Bg
    function reqMsgToBg(action, data, callback) {
        chrome.runtime.sendMessage(getReqMsg(action, data), callback);
    }
});