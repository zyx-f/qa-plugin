function getFrameObj() {
    const frameObj = {};
    const frames = window.frames;
    if (frames && frames.length > 0) {
        for (let i = 0; i < frames.length; i++) {
            let frame = frames[i];
            if (frame.popwxstudy && frame.document.location.href.startsWith('https://cms.slyb.top/Home/PerHome')) {
                frameObj.home = frame;
            }
            if (frame.document.location.href.startsWith('https://cms.slyb.top/ZXXX/IndexCLASSTest?')) {
                frameObj.zxxx = frame;
            }
        }
    }
    return frameObj;
}

function setButText(frame, intervalId, but) {
    let time = -1;
    const playTime = frame.player.time();
    if (frame.zp1 > 0 && frame.zp1 >= playTime) {
        time = frame.zp1 - playTime;
    } else if (frame.zp2 > 0 && frame.zp2 >= playTime) {
        time = frame.zp2 - playTime;
    } else {
        clearInterval(intervalId);
    }
    if (time >= 0) {
        but.innerText = `倒计${time.toFixed(1)}秒`;
    } else {
        but.innerText = '已弹';
        but.style.cursor = 'not-allowed';
    }
}

function generateRandomSixDecimal() {
    const randomNumber = Math.floor(Math.random() * 1000000);
    return randomNumber / 1000000;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function addBut() {
    try {
        let box = null;
        const frameObj = getFrameObj();
        const frame = frameObj.zxxx;
        const home = frameObj.home;
        console.log(frameObj);
        if (!frame || !home) {
            return;
        }
        if (frame
            && (box = frame.document.getElementById('video'))
            && !frame.document.getElementById('pop-but')) {

            if (frame.zp1 > 0 || frame.zp2 > 0) {
                // 添加按钮
                const but = frame.document.createElement('button');
                but.id = 'pop-but'
                but.style.zIndex = '99999';
                but.style.width = '120px';
                but.style.height = '30px';
                but.style.cursor = 'pointer';
                if (!frame.bsave) {
                    but.innerText = '不具备弹窗条件';
                    but.style.cursor = 'not-allowed';
                    box.appendChild(but);
                    return;
                }
                // 自动弹倒计时
                const intervalId = setInterval(() => {
                    setButText(frame, intervalId, but);
                }, 1000);

                // 点击事件
                but.onclick = async function () {
                    if (frame.bsave && frame.learnmodelobj == null && frame.player.time() <= 60) {
                        frame.saveclassTime(frame.currzj, 60 + generateRandomSixDecimal());

                        // 等待结果
                        let num = 0;
                        do {
                            await delay(30);
                            num++;
                        } while (num < 50 && !frame.learnmodelobj);

                    }
                    if (!frame.learnmodelobj) {
                        alert('learnmodelobj为空');
                        return;
                    }
                    if (frame.learnmodelobj.PLAYOVER === 1) {
                        alert('本节学习完成');
                        return;
                    }
                    let idx;
                    let idx_;
                    let token
                    const GETlearn = frame.GETlearn.toString();
                    if (GETlearn && (idx = GETlearn.indexOf('"&token=')) !== -1 && (idx_ = GETlearn.indexOf('"', idx + '"&token='.length)) !== -1) {
                        token = GETlearn.substring(idx + '"&token='.length, idx_);
                    }
                    if (!token) {
                        alert('token为空');
                        return;
                    }
                    let atim;
                    frame.player.pause();
                    if (frame.zp1 > 0) {
                        atim = frame.zp1;
                        frame.saveclassTime(frame.currzj, frame.zp1 + generateRandomSixDecimal());
                        frame.zp1 = 0;
                        // layer.open 弹窗是在调用的frame
                        frame.popwxstudy(atim.toString() + "|" + frame.learnmodelobj.ID.toString() + "|" + token);
                    } else if (frame.zp2 > 0) {
                        atim = frame.zp2;
                        frame.saveclassTime(frame.currzj, frame.zp2 + generateRandomSixDecimal());
                        frame.zp2 = 0;
                        // layer.open 弹窗是在调用的frame
                        frame.popwxstudy(atim.toString() + "|" + frame.learnmodelobj.ID.toString() + "|" + token);
                    } else {
                        alert('没有弹窗条件');
                    }
                }
                // 设置按钮文本
                setButText(frame, intervalId, but);
                // 添加按钮
                box.appendChild(but);
            }
        }
    } catch (e) {
        console.error(e);
    }
}


(async function runTask() {
    await addBut();
    setTimeout(runTask, 1000); // 等待1秒后再次执行
})();