(function () {
    console.log('WxLoginBut.js 加载成功！')

    function wxLoginBut(intervalId) {
        const nameDiv = document.querySelector('.js_quick_login_nickname.qlogin_user_nickname');
        const but = document.querySelector('.js_quick_login.web_qrcode_panel_quick_login button');
        if (but && nameDiv && nameDiv.textContent !== "('微信用户')") {
            but.click();
            clearInterval(intervalId);
        }
    }

    function getUrlParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const regex = /([^&=]+)=([^&]*)/g;
        let match;
        while (match = regex.exec(queryString)) {
            params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
        }
        return params;
    }

    const params = getUrlParams();
    if (params.redirect_uri && (params.redirect_uri === "https://cms.slyb.top/WeChat/CallbackStudy" || params.redirect_uri === "https://music.163.com/back/weichat")) {
        wxLoginBut();
        let intervalId;
        intervalId = setInterval(() => {
            wxLoginBut(intervalId)
        }, 1);
    }
})();