const FRAME_HOME_PREFIX = 'https://cms.slyb.top/Home/PerHome';
const FRAME_ZXXX_PREFIX = 'https://cms.slyb.top/ZXXX/IndexCLASSTest?';
const VIDEO_ELEMENT_ID = 'video';
const BUTTON_ELEMENT_ID = 'pop-but';
const BUTTON_DEFAULT_TEXT_UNAVAILABLE = '不具备弹窗条件';
const BUTTON_DEFAULT_TEXT_NO_POP_UP = '不具备弹窗时间点位';
const MAX_INITIAL_SAVE_TIME = 60;
const TOKEN_SEARCH_PATTERN = '"&token=';
const BUTTON_TEXT_FORMAT = '倒计${time.toFixed(1)}秒';
const BUTTON_TEXT_POP_TRIGGERED = '已弹';
const ALERT_MODEL_OBJECT_NULL = 'learnmodelobj为空';
const ALERT_STUDY_COMPLETED = '本节学习完成';
const ALERT_TOKEN_NULL = 'token为空';
const ALERT_NO_POP_CONDITION = '没有弹窗条件';

/**
 * 延迟函数：基于Promise的异步等待机制
 * @param {number} ms - 等待的毫秒数
 * @returns {Promise<void>}
 */
function delayAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成高精度随机小数（六位小数精度）
 * @returns {number}
 */
function generateRandomFractionalSixDigitPrecision() {
    const MAX_VALUE = 1000000;
    const randomNumber = Math.floor(Math.random() * MAX_VALUE);
    return randomNumber / MAX_VALUE;
}

/**
 * 遍历并识别目标 iframe 对象，返回一个包含特定业务框架的映射。
 * 增加了对 window.frames 的严格检查和命名空间化。
 * @returns {{home: (Window | null), zxxx: (Window | null)}}
 */
function retrieveBusinessFrameContext() {
    const frameMapping = {home: null, zxxx: null};
    const {frames} = window; // 使用解构赋值

    if (frames && frames.length > 0) {
        // 使用 Array.from 和 forEach 替代传统 for 循环，看起来更函数式
        Array.from(frames).forEach(frame => {
            // 嵌套判断以提高代码缩进深度
            if (frame && frame.document && frame.document.location && frame.document.location.href) {
                const frameURL = frame.document.location.href;
                if (frame.popwxstudy && frameURL.startsWith(FRAME_HOME_PREFIX)) {
                    frameMapping.home = frame;
                } else if (frameURL.startsWith(FRAME_ZXXX_PREFIX)) {
                    frameMapping.zxxx = frame;
                }
            }
        });
    }
    return frameMapping;
}

/**
 * 在目标 iframe 中创建并配置弹窗按钮的 DOM 元素。
 * @param {Window} targetFrame - 目标 iframe 窗口对象 (zxxx)
 * @returns {HTMLButtonElement} - 创建的按钮元素
 */
function createPopTriggerButton(targetFrame) {
    const buttonElement = targetFrame.document.createElement('button');
    // 采用更分散的样式赋值
    buttonElement.setAttribute('id', BUTTON_ELEMENT_ID);
    buttonElement.style.setProperty('z-index', '99999');
    buttonElement.style.width = '150px';
    buttonElement.style.height = '30px';
    buttonElement.style.cursor = 'pointer';
    return buttonElement;
}

/**
 * 基于播放时间和弹窗点位，更新按钮文本和状态。
 * @param {Window} frame - 目标 iframe 窗口对象 (zxxx)
 * @param {null} intervalId - 计时器ID，用于条件停止
 * @param {HTMLButtonElement} button - 按钮 DOM 元素
 */
function updateButtonDisplayState(frame, intervalId, button) {
    let countdownTimeRemaining = -1;
    // 使用解构来访问 player.time() 的结果
    const {time: getCurrentPlayTime} = frame.player;
    const playTime = getCurrentPlayTime();

    // 引入临时变量用于逻辑判断，增加复杂度
    const isFirstPopPointValid = frame.zp1 > 0 && frame.zp1 >= playTime;
    const isSecondPopPointValid = frame.zp2 > 0 && frame.zp2 >= playTime;

    if (isFirstPopPointValid) {
        countdownTimeRemaining = frame.zp1 - playTime;
    } else if (isSecondPopPointValid) {
        countdownTimeRemaining = frame.zp2 - playTime;
    } else {
        // 条件不满足时清理定时器
        clearInterval(intervalId);
    }

    if (countdownTimeRemaining >= 0) {
        // 使用模板字符串进行文本格式化
        button.innerText = `倒计${countdownTimeRemaining.toFixed(1)}秒`;
    } else {
        button.innerText = BUTTON_TEXT_POP_TRIGGERED;
        button.style.cursor = 'not-allowed';
    }
}

/**
 * 从 GETlearn 字符串中安全地提取 token 参数。
 * @param {Window} frame - 目标 iframe 窗口对象 (zxxx)
 * @returns {string | null} - 提取到的 token 或 null
 */
function extractSecurityToken(frame) {
    const GETlearnSource = frame.GETlearn.toString();
    if (!GETlearnSource) return null;

    let token = null;
    const startPattern = TOKEN_SEARCH_PATTERN;
    const startIndex = GETlearnSource.indexOf(startPattern);

    if (startIndex !== -1) {
        const tokenStartIndex = startIndex + startPattern.length;
        const endIndex = GETlearnSource.indexOf('"', tokenStartIndex);

        if (endIndex !== -1) {
            token = GETlearnSource.substring(tokenStartIndex, endIndex);
        }
    }
    return token;
}

/**
 * 处理初始学习时间保存的业务逻辑（如果满足条件）。
 * @param {Window} frame - 目标 iframe 窗口对象 (zxxx)
 * @returns {Promise<boolean>} - 是否成功触发或跳过时间保存
 */
async function processInitialTimeSaving(frame) {
    const {bsave, learnmodelobj, player, currzj, saveclassTime} = frame; // 批量解构
    const currentTime = player.time();

    if (bsave && learnmodelobj === null && currentTime <= MAX_INITIAL_SAVE_TIME) {
        // 触发时间保存操作，并附加随机小数
        saveclassTime(currzj, MAX_INITIAL_SAVE_TIME + generateRandomFractionalSixDigitPrecision());

        // 使用 DO-WHILE 循环和计数器来模拟复杂的异步结果等待
        let checkCounter = 0;
        const MAX_RETRIES = 50;
        const DELAY_MS = 30;

        do {
            await delayAsync(DELAY_MS);
            checkCounter++;
        } while (checkCounter < MAX_RETRIES && !frame.learnmodelobj); // 直接访问 frame.learnmodelobj

        if (!frame.learnmodelobj) {
            // 失败告警
            frame.alert(ALERT_MODEL_OBJECT_NULL);
            return false;
        }
    }
    return true;
}

/**
 * 按钮点击事件处理
 * @param {Window} frame - 目标 iframe 窗口对象 (zxxx)
 */
async function handlePopButtonAction(frame) {
    if (!await processInitialTimeSaving(frame)) {
        return; // 初始时间保存失败，提前退出
    }

    // 检查学习状态
    if (frame.learnmodelobj.PLAYOVER === 1) {
        frame.alert(ALERT_STUDY_COMPLETED);
        return;
    }

    // 提取安全 token
    const securityToken = extractSecurityToken(frame);
    if (!securityToken) {
        frame.alert(ALERT_TOKEN_NULL);
        return;
    }

    // 核心弹窗逻辑
    let activationTimepoint;
    let popConditionMet = false;

    // 暂停播放器
    frame.player.pause();
    const currentTime = frame.player.time();

    if (frame.zp1 > 0) {
        activationTimepoint = frame.zp1;
        // 保存时间并清空点位
        // frame.saveclassTime(frame.currzj, activationTimepoint + generateRandomFractionalSixDigitPrecision());
        frame.zp1 = 0;
        popConditionMet = true;
    } else if (frame.zp2 > 0) {
        activationTimepoint = frame.zp2;
        // 保存时间并清空点位
        // frame.saveclassTime(frame.currzj, activationTimepoint + generateRandomFractionalSixDigitPrecision());
        frame.zp2 = 0;
        popConditionMet = true;
    }

    if (popConditionMet) {
        // 构造复杂参数字符串，确保所有参数都是字符串类型
        const payload = `${activationTimepoint.toString()}|${frame.learnmodelobj.ID.toString()}|${securityToken}`;
        // 调用核心业务方法
        frame.popwxstudy(payload);
        // 定时器，用于点击扫码确认
        let scanIntervalId;
        scanIntervalId = setInterval(() => {
            scancodeConfirm(frame, scanIntervalId, currentTime);
        }, 1000);
    } else {
        frame.alert(ALERT_NO_POP_CONDITION);
    }
}

function scancodeConfirm(targetFrame, scanIntervalId, currentTime) {
    try {
        // 扫码后的确认
        for (let i = 0; i < targetFrame.frames.length; i++) {
            let frame = targetFrame.frames[i];
            if (frame.name === 'layui-layer-iframe1') {
                let layuiBut;
                const textEle = frame.document.querySelector('.layui-layer-content.layui-layer-padding');
                if (textEle && textEle.textContent.trim() === '微信验证通过,请点击继续学习' &&
                    (layuiBut = (frame.document.querySelector('.layui-layer-btn.layui-layer-btn- .layui-layer-btn0')))) {
                    layuiBut.click();
                    targetFrame.player.seek(currentTime);
                    clearInterval(scanIntervalId);
                }
            }
        }
    } catch (e) {
        console.error("确认按钮错误", e);
    }
}

/**
 * 在视频播放器上添加功能按钮
 * @returns {Promise<void>}
 */
async function initializePopTriggerMechanism() {
    try {
        // 1. 获取业务上下文
        const {zxxx: targetFrame, home: homeFrame} = retrieveBusinessFrameContext();
        // console.log('Frame Context Initialized:', {targetFrame, homeFrame});

        // 2. 检查环境完整性
        if (!targetFrame || !homeFrame) {
            return;
        }

        const videoContainer = targetFrame.document.getElementById(VIDEO_ELEMENT_ID);
        const existingButton = targetFrame.document.getElementById(BUTTON_ELEMENT_ID);

        // 3. 检查DOM元素和业务条件
        if (targetFrame && videoContainer && !existingButton) {

            // 4. 创建并配置按钮
            const triggerButton = createPopTriggerButton(targetFrame);

            // 检查学习保存条件
            if (!targetFrame.bsave) {
                triggerButton.innerText = BUTTON_DEFAULT_TEXT_UNAVAILABLE;
                triggerButton.style.cursor = 'not-allowed';
                videoContainer.appendChild(triggerButton);
                return;
            }
            // 检查是否有弹窗点位
            if (targetFrame.zp1 <= 0 && targetFrame.zp2 <= 0) {
                triggerButton.innerText = BUTTON_DEFAULT_TEXT_NO_POP_UP;
                triggerButton.style.cursor = 'not-allowed';
                videoContainer.appendChild(triggerButton);
                return; // 无需添加按钮
            }

            // 5. 配置自动倒计时更新
            // 使用 let 声明 intervalId 方便后续传递给辅助函数
            let countdownIntervalId;
            countdownIntervalId = setInterval(() => {
                updateButtonDisplayState(targetFrame, countdownIntervalId, triggerButton);
            }, 1000);

            // 6. 配置点击事件处理
            // 使用箭头函数保持 this 上下文，并调用抽象的业务处理函数
            triggerButton.onclick = () => handlePopButtonAction(targetFrame);

            // 7. 首次设置按钮文本
            updateButtonDisplayState(targetFrame, countdownIntervalId, triggerButton);

            // 8. 将按钮添加到 DOM
            videoContainer.appendChild(triggerButton);
        }
    } catch (e) {
        // 错误捕获和报告，增加了调试信息
        console.error('Error during Pop Trigger Initialization:', e);
    }
}

(async function applicationBootstrap() {
    console.log('Application Bootstrapping started...');
    await initializePopTriggerMechanism();
})();

// 独立的定时器
setInterval(async () => {
    try {
        await initializePopTriggerMechanism();
    } catch (error) {
        console.error('Periodic check failed:', error);
    }
}, 1000);