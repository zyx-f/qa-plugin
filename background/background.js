chrome.runtime.onInstalled.addListener(() => {
    console.log("插件已被安装");

    initVariable('openAutoQq', false)
    initVariable('learnAutoQq', false)
    console.log("初始变量成功");
});

// 监听消息
chrome.runtime.onMessage.addListener((reqMsg, sender, sendResponse) => {
    console.log(reqMsg);
    switch (reqMsg.action) {
        case "AutoQa":
            var openAutoQq = reqMsg.data;
            if (openAutoQq) {
                chrome.storage.local.set({'openAutoQq': openAutoQq, 'learnAutoQq': false}, function () {
                    sendResponse(respMsg(reqMsg, reqMsg.data));
                });
            } else {
                chrome.storage.local.set({openAutoQq}, function () {
                    sendResponse(respMsg(reqMsg, reqMsg.data));
                });
            }
            break
        case "LearnQa":
            var learnAutoQq = reqMsg.data;
            if (learnAutoQq) {
                chrome.storage.local.set({'learnAutoQq': learnAutoQq, 'openAutoQq': false}, function () {
                    sendResponse(respMsg(reqMsg, reqMsg.data));
                });
            } else {
                chrome.storage.local.set({learnAutoQq}, function () {
                    sendResponse(respMsg(reqMsg, reqMsg.data));
                });
            }
            break
        case "VideoClickBtn":
            var videoBtn = reqMsg.data;
            chrome.storage.local.set({videoBtn}, function () {
                sendResponse(respMsg(reqMsg, reqMsg.data));
            });
            break
    }
    return true; // true异步发送响应
});

// 初始变量
function initVariable(key, defValue) {
    chrome.storage.local.get(key, (variable) => {
        if (variable[key] === undefined) {
            variable[key] = defValue;
            // chrome.storage.local.set(variable);
            chrome.storage.local.set(variable, function () {
                console.log(variable);
            });
        } else {
            console.log(variable);
        }
    });
}

function respMsg(reqMsg, data = '') {
    reqMsg.data = data;
    reqMsg.msgType = 'resp';
    return reqMsg;
}

chrome.runtime.onInstalled.addListener(() => {
    console.log('MV3 Extension installed. Rules are active.');
});

// 监听所有请求发起的事件
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log("onBeforeRequest:", details.url, details.method, details.type);
        if(details.url === "https://cms.slyb.top/AliPeopleIMG/AliPeopleIMGSTUDY" ){
            console.log('------------已上传拍照-----------------');
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        alert('已上传拍照！'); // 或自定义DOM弹窗
                    },
                });
            });
        }
    },
    { urls: ["<all_urls>"] } // 监听所有 URL 的请求
);