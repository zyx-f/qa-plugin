(function () {
    console.log("QA Content已运行");

    chrome.storage.local.get(['dataSingleQa', 'dataJudgedQa', 'dataMultiQa', 'addSingleQa', 'addJudgedQa', 'addMultiQa'], function (result) {
        const dataSingleQa = result.dataSingleQa || {};
        const dataJudgedQa = result.dataJudgedQa || {};
        const dataMultiQa = result.dataMultiQa || {};
        const addSingleQa = result.addSingleQa || {};
        const addJudgedQa = result.addJudgedQa || {};
        const addMultiQa = result.addMultiQa || {};

        window.dataSingleQa = Object.assign({}, window.dataSingleQa, dataSingleQa, addSingleQa);
        console.log(window.dataSingleQa)

        window.dataJudgedQa = Object.assign({}, window.dataJudgedQa, dataJudgedQa, addJudgedQa);
        console.log(window.dataJudgedQa)

        window.dataMultiQa = Object.assign({}, window.dataMultiQa, dataMultiQa, addMultiQa);
        console.log(window.dataMultiQa)
    });


    function qa() {
        try{
            videoClickBtnFun();
        }catch (e){
            // console.error(e);
        }
        try{
            videoClickBtnFun2();
        }catch (e){
            // console.error(e);
        }
        if (hostArr.includes(location.hostname)) {
            if (document.querySelectorAll('.ok_daan').length > 0) {
                learnQq();
            } else if (document.querySelectorAll('#jConfireSubmit').length > 0) {
                autoQa();
            }
        }
    }

    function videoClickBtnFun(){
        chrome.storage.local.get('videoBtn', ({videoBtn}) => {
            if(videoBtn){
                let but = document.querySelector('td div.ui_buttons input.ui_state_highlight');
                but && but.click();
            }
        });
    }

    function videoClickBtnFun2(){
        chrome.storage.local.get('videoBtn', ({videoBtn}) => {
            if(videoBtn){
                let layerCont = document.querySelector('.layui-layer .layui-layer-content');
                if(layerCont && layerCont.textContent === '本节学习完成，请点击下一节课继续学习。'){
                    let but = document.querySelector('.layui-layer .layui-layer-btn0');
                    but && but.click();
                }
            }
        });
    }

    function autoQa() {
        chrome.storage.local.get('openAutoQq', ({openAutoQq}) => {
            console.log('openAutoQq=' + openAutoQq);
            if (openAutoQq) {
                var isOk;
                var currQ = document.querySelector('.xuanzheti_ul .listsd[style=""]');
                try {
                    if (!currQ) {
                        // alert('未提取到当前题');
                        return;
                    }
                    isOk = !!currQ.dataset.isOk;
                    if (isOk) {
                        return;
                    }
                    var q, t, a;
                    q = replacePunctuation(currQ.querySelector('div.dime p').textContent.trim().replace(/\s+/g, ""));
                    t = currQ.parentNode.parentNode.querySelector('.xuanzheti_title').textContent.trim();

                    var aNodeMap = {};
                    var ul = currQ.querySelector('ul.grsou_li.jQuesItem');
                    var inputs = ul.querySelectorAll('li input');
                    for (let i = 0; i < inputs.length; i++) {
                        inputs[i].checked && inputs[i].click();
                        aNodeMap[replacePunctuation(inputs[i].value.trim().replace(/\s+/g, ""))] = inputs[i];
                    }
                    switch (t) {
                        case '单选题':
                            a = window.dataSingleQa[q];
                            if (a && aNodeMap[a]) {
                                !aNodeMap[a].checked && aNodeMap[a].click();
                            } else {
                                alert('未找到答案：' + a);
                                return;
                            }
                            break;
                        case '是非题':
                            a = window.dataJudgedQa[q];
                            // 原来的aNodeMap key 为 1，2 增加汉字的
                            Object.values(aNodeMap).forEach(value => {
                                aNodeMap[replacePunctuation(value.parentElement.textContent.replace(/\s+/g, ""))] = value;
                            });

                            if (a && aNodeMap[a]) {
                                !aNodeMap[a].checked && aNodeMap[a].click();
                            } else {
                                alert('未找到答案：' + a);
                                return;
                            }
                            break;
                        case '多选题':
                            a = window.dataMultiQa[q];
                            if (!a) {
                                alert('未找到答案：' + a);
                                return;
                            }
                            if (a.indexOf('＆') !== -1) {
                                console.log('发现异常符号：' + a);
                                a = a.replaceAll('＆', '&');
                            }
                            var ass = a.split('&');
                            // for (var i in ass) {
                            //     a = ass[i];
                            //     if (a && aNodeMap[a]) {
                            //         !aNodeMap[a].checked && aNodeMap[a].click();
                            //     } else {
                            //         alert('未找到选项：' + a);
                            //     }
                            // }
                            var isClick = false;
                            for (var key in aNodeMap) {
                                // 检查当前aNodeMap的key是否存在于ass数组中
                                if (ass.includes(key)) {
                                    if (aNodeMap[key] && !aNodeMap[key].checked) {
                                        aNodeMap[key].click();
                                        isClick = true;
                                    }
                                }
                            }
                            if (!isClick) {
                                alert("未点击选项")
                                console.log("未点击选项")
                                console.log(aNodeMap)
                                console.log(ass)
                            }
                            break;
                        default:
                            alert('未知题型：' + t);
                            return;
                    }
                    var nqid = ul.dataset.nqid;
                    if (nqid !== '0') {
                        console.log('nqid=' + nqid);
                        document.getElementById('nbtn').click();
                    } else {
                        const submitBtn = document.getElementById('submit_btn');
                        if (submitBtn) {
                            if (!(submitBtn.style.visibility === 'hidden' || submitBtn.style.display === 'none')) {
                                submitBtn.click();
                            }
                        } else {
                            alert('未找到提交按钮');
                        }
                    }
                } catch (e) {
                    console.error(e);
                    alert('自动QA功能异常');
                } finally {
                    if (currQ && !isOk) {
                        currQ.dataset.isOk = 'true';
                    }
                }
            }
        });
    }

    function learnQq() {
        chrome.storage.local.get('learnAutoQq', ({learnAutoQq}) => {
            var bodyDoc = document.querySelector('body');
            var isLearn = !!bodyDoc.dataset.isLearn;
            console.log('learnAutoQq=' + learnAutoQq + ', isLearn=' + isLearn);
            if (learnAutoQq && !isLearn) {
                try {
                    // 选项卡
                    var singleYsArr = [];
                    var judgedYsArr = [];
                    var multiYsArr = [];
                    var xuansegs = document.querySelectorAll('#jPreview .xuanseg.__isView');
                    for (var i = 0; i < xuansegs.length; i++) {
                        var xuanseg = xuansegs[i];
                        switch (xuanseg.querySelector('h4').textContent.trim()) {
                            case '单选题：':
                                singleYsArr = xuanseg.querySelectorAll('li');
                                break;
                            case '是非题：':
                                judgedYsArr = xuanseg.querySelectorAll('li');
                                break;
                            case '多选题：':
                                multiYsArr = xuanseg.querySelectorAll('li');
                                break;
                        }
                    }

                    var listsd, k, li, q, a;
                    var addSingleQa = {}, addJudged = {}, addMulti = {};

                    // 题
                    var singleDoc = document.querySelector('.xuanzheti.jQueslevel1[data-type="0"]');
                    if (singleDoc && singleDoc.querySelector('.xuanzheti_title')
                        && singleDoc.querySelector('.xuanzheti_title').textContent.trim() === '单选题') {
                        console.log('单选题');
                        listsd = singleDoc.querySelectorAll('li.listsd');
                        for (k = 0; k < listsd.length; k++) {
                            li = listsd[k];
                            q = replacePunctuation(li.querySelector('div.dadis div.dime p').textContent.trim().replace(/\s+/g, ""));
                            a = replacePunctuation(li.querySelector('div.ok_daan span').textContent.trim().replace(/\s+/g, ""));
                            if (addQa(singleYsArr, k, 'single', q, a)) {
                                addSingleQa[q] = a;
                            }
                        }
                    }

                    var judgedDoc = document.querySelector('.xuanzheti.jQueslevel1[data-type="1"]');
                    if (judgedDoc && judgedDoc.querySelector('.xuanzheti_title')
                        && judgedDoc.querySelector('.xuanzheti_title').textContent.trim() === '是非题') {
                        console.log('是非题');
                        listsd = judgedDoc.querySelectorAll('li.listsd');
                        for (k = 0; k < listsd.length; k++) {
                            li = listsd[k];
                            q = replacePunctuation(li.querySelector('div.dadis div.dime p').textContent.trim().replace(/\s+/g, ""));
                            a = replacePunctuation(li.querySelector('div.ok_daan span').textContent.trim().replace(/\s+/g, ""));
                            if (addQa(judgedYsArr, k, 'judged', q, a)) {
                                addJudged[q] = a;
                            }
                        }
                    }

                    var multiDoc = document.querySelector('.xuanzheti.jQueslevel1[data-type="2"]');
                    if (multiDoc && multiDoc.querySelector('.xuanzheti_title')
                        && multiDoc.querySelector('.xuanzheti_title').textContent.trim() === '多选题') {
                        console.log('多选题');
                        listsd = multiDoc.querySelectorAll('li.listsd');
                        for (k = 0; k < listsd.length; k++) {
                            li = listsd[k];
                            q = replacePunctuation(li.querySelector('div.dadis div.dime p').textContent.trim().replace(/\s+/g, ""));
                            a = replacePunctuation(li.querySelector('div.ok_daan span').textContent.trim().replace(/\s+/g, ""));
                            if (addQa(multiYsArr, k, 'multi', q, a)) {
                                addMulti[q] = window.dataMultiQa[q];
                            }
                        }
                    }

                    bodyDoc.dataset.isLearn = 'true';
                } finally {
                    var addSingleQaCount = Object.keys(addSingleQa).length;
                    if (addSingleQaCount > 0) {
                        chrome.storage.local.get('dataSingleQa', ({dataSingleQa}) => {
                            chrome.storage.local.set({'dataSingleQa': Object.assign({}, dataSingleQa, addSingleQa)}, function () {
                                console.log("save dataSingleQa succeed " + addSingleQaCount);
                            });
                        });
                    }

                    var addJudgedCount = Object.keys(addJudged).length;
                    if (addJudgedCount > 0) {
                        chrome.storage.local.get('dataJudgedQa', ({dataJudgedQa}) => {
                            chrome.storage.local.set({'dataJudgedQa': Object.assign({}, dataJudgedQa, addJudged)}, function () {
                                console.log("save dataJudgedQa succeed " + addJudgedCount);
                            });
                        });
                    }

                    var addMultiCount = Object.keys(addMulti).length;
                    if (addMultiCount > 0) {
                        chrome.storage.local.get('dataMultiQa', ({dataMultiQa}) => {
                            chrome.storage.local.set({'dataMultiQa': Object.assign({}, dataMultiQa, addMulti)}, function () {
                                console.log("save dataMultiQa succeed " + addMultiCount);
                            });
                        });
                    }

                    // 创建新的span元素
                    const newSpan = document.createElement('span');
                    newSpan.textContent = "单选:" + addSingleQaCount + ", 是非:" + addJudgedCount + ", 多选:" + addMultiCount;

                    // 在id为feedbackBtn1的元素后插入新span
                    const elementA = document.getElementById('feedbackBtn1');
                    elementA.insertAdjacentElement('afterend', newSpan);

                }
            }
        });
    }

    function addQa(ys, i, t, q, a) {
        try {
            if (q && a) {
                switch (t) {
                    case 'single':
                        if (!window.dataSingleQa.hasOwnProperty(q)) {
                            window.dataSingleQa[q] = a;
                            ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                            return true;
                        } else if (window.dataSingleQa[q] !== a) {
                            console.log('单选题答案更新：q=' + q + '\noldA=' + window.dataJudgedQa[q] + '\nnewA=' + a);
                            window.dataSingleQa[q] = a;
                            ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                            return true;
                        } else {
                            ys[i].setAttribute('style', 'background-color: #FFA500 !important');
                            return false;
                        }
                    case 'judged':
                        if (!window.dataJudgedQa.hasOwnProperty(q)) {
                            window.dataJudgedQa[q] = a;
                            ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                            return true;
                        } else if (window.dataJudgedQa[q] !== a) {
                            console.log('是否题答案更新：q=' + q + '\noldA=' + window.dataJudgedQa[q] + '\nnewA=' + a);
                            window.dataJudgedQa[q] = a;
                            ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                            return true;
                        } else {
                            ys[i].setAttribute('style', 'background-color: #FFA500 !important');
                            return false;
                        }
                    case 'multi':
                        if (a.indexOf('＆') !== -1) {
                            console.log('发现异常符号：' + a);
                            a = a.replaceAll('＆', '&');
                        }
                        if (!window.dataMultiQa.hasOwnProperty(q)) {
                            window.dataMultiQa[q] = a;
                            ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                            return true;
                        } else if (window.dataMultiQa[q] !== a) {
                            var oldA = window.dataMultiQa[q];
                            a = [...new Set(oldA.split('&').concat(a.split('&')))].join('&');
                            // console.log('多选题答案更新：' + q + ' -> ' + oldA);
                            // console.log('多选题答案更新：' + q + ' -> ' + a);
                            if (oldA !== a) {
                                window.dataMultiQa[q] = a;
                                ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                                return true;
                            } else {
                                ys[i].setAttribute('style', 'background-color: #FFA500 !important');
                                return false;
                            }
                        } else {
                            ys[i].setAttribute('style', 'background-color: #FFA500 !important');
                            return false;
                        }
                    default:
                        return false;
                }
            } else {
                ys[i].setAttribute('style', 'background-color: #FF4500 !important');
                return false;
            }
        } catch (e) {
            console.error(e);
            ys[i].setAttribute('style', 'background-color: #FF4500 !important');
            return false;
        }
    }

    function replacePunctuation(text) {
        const punctuationMap = {
            ',': '，',
            '.': '。',
            '?': '？',
            '!': '！',
            ':': '：',
            ';': '；',
            '"': '“',
            "'": '‘',
            '(': '（',
            ')': '）',
            '[': '［',
            ']': '］',
            '{': '｛',
            '}': '｝',
            '<': '＜',
            '>': '＞',
            '/': '／',
            '\\': '＼',
            '＆': '&',
            '%': '％',
            '#': '＃',
            '@': '＠',
            '$': '＄',
            '~': '～',
        };

        return text.replace(/[,.?!:;"'(){}\[\]<>\/\\&%#@$]/g, (match) => {
            return punctuationMap[match] || match;
        });
    }

    function insertAfterBody(htmlString, contentToInsert) {
        // 使用正则匹配 <body...>（包括带属性的情况）
        const bodyRegex = /<body[^>]*>/i;
        const match = htmlString.match(bodyRegex);

        if (match) {
            const bodyTag = match[0];
            const insertPos = match.index + bodyTag.length;
            return (
                htmlString.substring(0, insertPos) +
                contentToInsert +
                htmlString.substring(insertPos)
            );
        }

        return htmlString; // 没找到 <body> 标签，返回原字符串
    }

    function downloadHTML() {
        // 获取完整的HTML
        var htmlContent = document.documentElement.outerHTML;

        var failedStr= '';
        var sccussNum = 0;
        var iframs = document.querySelectorAll('iframe');

        for(var i = 0; i < iframs.length; i++){

            var ifram = iframs[i];
            if (ifram.contentDocument || ifram.contentWindow.document) {

                var iframeDocument = ifram.contentDocument || ifram.contentWindow.document;
                var innerContent = `<!--ifram${i}-->` + iframeDocument.body.innerHTML;
                var iframeStr =  ifram.outerHTML;

                var parentStr = ifram.parentElement.outerHTML;

                var temp = '';
                temp += iframeStr + '\n\n\n\n';
                temp += parentStr + '\n\n';

                if(htmlContent.includes(iframeStr)){
                    htmlContent = htmlContent.replace(iframeStr, innerContent)
                    sccussNum++;
                    temp += 'success--------------------------------------------------------\n\n';

                }else{

                    var parentHead = parentStr.substring(parentStr.indexOf('<'), parentStr.indexOf('<iframe') + '<iframe'.length + 1);

                    temp += parentHead + '\n\n';
                    temp += htmlContent.includes(parentHead) + '\n\n';
                    temp += (htmlContent.split(parentHead).length === 1) + '\t' + htmlContent.split(parentHead).length + '\n\n';
                    temp += ((parentStr.split('<iframe').length - 1) === 1) + '\n\n';

                    if(htmlContent.includes(parentHead) && htmlContent.split(parentHead).length === 1
                        && (parentStr.split('<iframe').length - 1) === 1){
                            var start = 0;
                            var end = htmlContent.indexOf(parentHead) + parentHead.length + 1 - ('<iframe'.length + 1);
                            var j = htmlContent.substring(start, end);
                            var k = htmlContent.substring(end);

                            end = end + k.indexOf('<iframe');
                            j = htmlContent.substring(start, end);
                            k = htmlContent.substring(end);
                            k = k.substring(k.indexOf('</iframe>') + '</iframe>'.length);
                            htmlContent = j + innerContent + k;
                        temp += 'success else--------------------------------------------------------\n\n';
                    }else{
                        temp += 'failed--------------------------------------------------------\n\n';
                    }
                }
                failedStr += temp;
            }
        }
        if(iframs.length !== sccussNum){
            var scuessStr = `<h3>${iframs.length}个iframe 成功替换${sccussNum}个</h3><textarea>${failedStr}</textarea>`
            htmlContent = insertAfterBody(htmlContent, scuessStr);
        }


        // 获取页面标题，如果不存在则使用默认文件名
        const pageTitle = document.title.trim();
        const fileName = pageTitle ? `${pageTitle}.html` : 'page.html';

        // 创建Blob对象
        const blob = new Blob([htmlContent], { type: 'text/html' });

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;  // 使用动态生成的文件名

        // 触发点击下载
        document.body.appendChild(a);
        a.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    chrome.runtime.onMessage.addListener(function(reqMsg, sender, sendResponse) {
        switch (reqMsg.action) {
            case "DownCode":
                downloadHTML();
                break;
        }
    });

    setInterval(qa, 1000);
})();