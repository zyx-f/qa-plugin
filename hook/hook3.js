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
                // player.click();
                // simulateRealisticClick(player);
                simulateRealisticSpacebar(player);
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

// 辅助函数：模拟自然的延迟时间
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function simulateRealisticClick(element) {
    if (!element) {
        console.error("未找到目标元素");
        return;
    }

    // 1. 获取元素的屏幕位置和尺寸
    const rect = element.getBoundingClientRect();

    // 2. 坐标随机化：避免总是点击元素正中心，在元素范围内生成随机偏移
    // 留出 10% 的边距，防止点击到元素最边缘之外
    const padX = rect.width * 0.1;
    const padY = rect.height * 0.1;
    const randomX = rect.left + padX + Math.random() * (rect.width - 2 * padX);
    const randomY = rect.top + padY + Math.random() * (rect.height - 2 * padY);

    // 通用的鼠标事件配置参数
    const eventOptions = {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: randomX,
        clientY: randomY,
        screenX: randomX + window.screenX,
        screenY: randomY + window.screenY,
        pointerType: 'mouse' // 模拟鼠标而非触摸
    };

    // 3. 模拟鼠标移入序列
    element.dispatchEvent(new MouseEvent('pointerover', eventOptions));
    element.dispatchEvent(new MouseEvent('mouseover', eventOptions));
    element.dispatchEvent(new MouseEvent('mouseenter', eventOptions));

    // 模拟鼠标在目标上短暂停留或微调
    element.dispatchEvent(new MouseEvent('mousemove', eventOptions));
    await sleep(Math.random() * 50 + 30); // 随机延迟 30~80ms

    // 4. 模拟鼠标按下
    element.dispatchEvent(new MouseEvent('pointerdown', eventOptions));
    element.dispatchEvent(new MouseEvent('mousedown', eventOptions));

    // 5. 模拟人类按压鼠标的时长（通常在 50ms 到 150ms 之间）
    await sleep(Math.random() * 100 + 50);

    // 6. 模拟鼠标抬起
    element.dispatchEvent(new MouseEvent('pointerup', eventOptions));
    element.dispatchEvent(new MouseEvent('mouseup', eventOptions));

    // 7. 触发最终的 click 事件
    element.dispatchEvent(new MouseEvent('click', eventOptions));
}

async function simulateRealisticSpacebar(element = document.activeElement) {
    // 如果没有传入指定元素，默认使用当前获得焦点的元素，或者兜底到 body
    const target = element || document.body;

    // 1. 关键步骤：强制让元素获得焦点
    if (typeof target.focus === 'function') {
        target.focus();
    }

    // 完整的标准键盘事件参数
    const eventOptions = {
        key: " ",         // 标准键名
        code: "Space",    // 物理按键代码
        keyCode: 32,      // 传统键码（虽然废弃但很多旧脚本仍在检测）
        which: 32,        // 传统键码
        bubbles: true,    // 允许事件冒泡
        cancelable: true, // 允许取消
        view: window
    };

    // 2. 模拟触发 keydown 事件（按键按下）
    const keydownEvent = new KeyboardEvent('keydown', eventOptions);
    target.dispatchEvent(keydownEvent);

    // 3. 模拟人类手指按住按键的自然延迟
    // 人类敲击键盘时，按键按下的持续时间一般在 60ms 到 130ms 之间
    await sleep(Math.random() * 70 + 60);

    // 4. 模拟触发 keyup 事件（按键抬起）
    const keyupEvent = new KeyboardEvent('keyup', eventOptions);
    target.dispatchEvent(keyupEvent);
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