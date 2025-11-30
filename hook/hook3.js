(function () {
    console.log('hook3.js 执行!')
    function wxLogin() {
        const scripts = document.querySelectorAll('script');
        for (let i = 0; i < scripts.length; i++) {
            let scriptCode = scripts[i].textContent;

            let start = scriptCode.indexOf('var obj = new WxLogin({');
            let end;
            if (start !== -1 && (end = scriptCode.indexOf('});', start)) !== -1) {
                return scriptCode.substring(start, end + 3);
            }
        }
        return null;
    }

    let jsCode = wxLogin();
    if (jsCode) {
        jsCode = jsCode.replaceAll('fast_login: 0', 'fast_login: 1').replaceAll('fast_login:0', 'fast_login: 1')
        const script = document.createElement('script');
        script.textContent = jsCode;
        document.body.appendChild(script);
        document.body.removeChild(script);
        console.log('wxLogin 已成功加载!')
    }
    // count = 9999999;
})();