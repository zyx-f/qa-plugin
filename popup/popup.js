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
        changeLearnQaBtn();
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
        changeAutoQaBtn();
        changeLearnQaBtn();
    }

    // QA学习事件绑定
    learnQaBtn.addEventListener('click', function () {
        console.log(learnQaBtn.dataset.open === 'false');
        reqMsgToBg(learnQaAction, learnQaBtn.dataset.open === 'false', learnQaHandleRespMsg)
    });


    // 开启视频按钮
    var videoClickBtn = document.getElementById('video-click-btn');
    // 修改开启视频按钮
    changeVideoClickBtn();

    function changeVideoClickBtn() {
        chrome.storage.local.get('videoBtn', ({videoBtn}) => {
            console.log('videoBtn=' + videoBtn)
            if (videoBtn) {
                videoClickBtn.textContent = '停止视频按钮'
                videoClickBtn.style.backgroundColor = '#3aa757';
                videoClickBtn.dataset.open = 'true';
            } else {
                videoClickBtn.textContent = '开启视频按钮'
                videoClickBtn.style.backgroundColor = '#FFA500';
                videoClickBtn.dataset.open = 'false';
            }
        });
    }

    // 开启视频按钮处理响应消息的函数
    function videoClickBtnHandleRespMsg(resp) {
        console.log(resp);
        changeVideoClickBtn();
    }

    // QA学习事件绑定
    videoClickBtn.addEventListener('click', function () {
        console.log(videoClickBtn.dataset.open === 'false');
        reqMsgToBg(videoClickBtnAction, videoClickBtn.dataset.open === 'false', videoClickBtnHandleRespMsg)
    });


    // 开启视频按钮
    var downCodeBtn = document.getElementById('down-code-btn');
    // QA学习事件绑定
    downCodeBtn.addEventListener('click', function () {
        console.log('down-code-btn');
        reqMsgToCont(downCodeAction, true)
    });


    // 查看QA数据
    var showQaBtn = document.getElementById('show-qa-btn');

    // 查看QA数据事件绑定
    showQaBtn.addEventListener('click', function () {
        const url = chrome.runtime.getURL('popup/QADB.html');
        window.open(url, '_blank');
    });

    // 发送消息到Bg
    function reqMsgToBg(action, data, callback) {
        chrome.runtime.sendMessage(getReqMsg(action, data), callback);
    }

    // 发送消息到content
    function reqMsgToCont(action, data){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, getReqMsg(action, data));
        });
    }

    // 查看QA数据
    var studentPhotoBtn = document.getElementById('student-photo-btn');

    // 查看QA数据事件绑定
    studentPhotoBtn.addEventListener('click', function () {
        const url = chrome.runtime.getURL('photo/photo.html');
        window.open(url, '_blank');
    });
});