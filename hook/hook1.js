async function videoClickBtnFun() {
    try {
        let hook1 = document.getElementById('script-hook1');
        if(hook1 && hook1.dataset.flag==='true'){
            let but = document.querySelector('td div.ui_buttons input.ui_state_highlight');
            if(but){
                but.click();
                let iframes = window.frames;
                for (let i = 0; i < iframes.length; i++) {
                    iframes[i].player &&  iframes[i].player.pause();
                }
            }
        }
    } catch (e) {
        // console.error(e);
    }
}

(async function runTask() {
    await videoClickBtnFun();
    setTimeout(runTask, 1000); // 等待1秒后再次执行
})();