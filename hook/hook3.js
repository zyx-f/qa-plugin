async function taskFunc() {
    const iframes = window.frames;
    for (let i = 0; i < iframes.length; i++) {
        if (iframes[i].name === 'mainContent') {
            const iframe = iframes[i];
            console.log('mainContent iframe found');
            let but = iframe.window[0].document.querySelector('.layui-layer.layui-layer-dialog .layui-layer-btn0');
            if (but) {
                but.click();
            }

            let player = iframe.window[0].document.querySelector('#player_pause');
            let playerTime1 = iframe.window[0].document.querySelector('#screen_player_time_1');
            let playerTime2 = iframe.window[0].document.querySelector('#screen_player_time_2');

            if (player && playerTime1 && playerTime2) {
                let time1 = minutesSecondsToSeconds(playerTime1.textContent);
                let time2 = minutesSecondsToSeconds(playerTime2.textContent);
                if (time1 && time2 && time1 < time2) {
                    player.click();
                } else {

                }
            }
        }
    }
}

function minutesSecondsToSeconds(timeStr) {
    try {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        if (isNaN(minutes) || isNaN(seconds)) return NaN;
        return minutes * 60 + seconds;
    }catch (error) {
        return null;
    }
}

if (location.hostname === 'px1027-kfkc.webtrn.cn' || location.hostname === 'localhost') {
// 独立的定时器
    setInterval(async () => {
        try {
            await taskFunc();
        } catch (error) {
            console.error('hook3 taskFunc:', error);
        }
    }, 1000);
}