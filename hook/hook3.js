async function getIframe() {
    const iframes = window.frames;
    for (let i = 0; i < iframes.length; i++) {
        const main = iframes[i];
        if (main.name === 'mainContent') {
            let len = main.window.length;
            for (let k = 0; k < len; k++) {
                const video = main.window[k];
                if (video.name === 'mainFrame') {
                    console.log(main.name)
                    console.log(video.name)
                    return {main: main, video}
                }
            }
        }
    }
    return {main: null, video: null}
}

async function taskFunc(mainView, videoView) {
    let but = document.querySelector('.layui-layer.layui-layer-dialog .layui-layer-btn0');
    if (but) {
        but.click();
    }
    let player = videoView.document.querySelector('#player_pause');
    let playerTime1 = videoView.document.querySelector('#screen_player_time_1');
    let playerTime2 = videoView.document.querySelector('#screen_player_time_2');
    let stop = player.style.display === 'block' || player.style.display === ''
    if (player && stop && playerTime1 && playerTime2) {
        let time1 = minutesSecondsToSeconds(playerTime1.textContent);
        let time2 = minutesSecondsToSeconds(playerTime2.textContent);
        if (time1 !== null && time2 !== null && !(time1 === 0 && time2 === 0)) {
            if (time1 < time2) {
                player.click();
            } else {
                const element = mainView.document.querySelector('.s_point.hasappend.s_pointerct');
                const nextSibling = element.nextElementSibling;
                if (nextSibling) {
                    nextSibling.click();
                } else {
                    let nextSibling = element.parentElement.nextElementSibling
                    if (nextSibling) {
                        nextSibling.click();
                        nextSibling = nextSibling.nextElementSibling;
                        if (nextSibling) {
                            const first = nextSibling.firstElementChild;
                            if (first) {
                                console.log(first);
                                first.click();
                            }
                        }
                    }
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
    } catch (error) {
        return null;
    }
}

if (location.hostname === 'px1027-kfkc.webtrn.cn' || location.hostname === 'localhost') {
    let mainView;
    let videoView;
    setInterval(async () => {
        try {
            if (!mainView || !videoView) {
                const {main, video} = await getIframe();
                mainView = main;
                videoView = video;
            }
            if (mainView && videoView) { // AliPlayerComponentCtrl
                await taskFunc(mainView, videoView);
            }
        } catch (error) {
            console.error('hook3 taskFunc:', error);
        }
    }, 1000);
}