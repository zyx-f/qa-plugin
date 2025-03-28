(function () {
    console.log("QA Content已运行");

    var codeSingleQaCount = Object.keys(window.dataSingleQa).length;
    var codeJudgedQaCount = Object.keys(window.dataJudgedQa).length;
    var codeMultiQaCount = Object.keys(window.dataMultiQa).length;

    chrome.storage.local.get('dataSingleQa', ({dataSingleQa}) => {
        window.dataSingleQa = Object.assign({}, window.dataSingleQa, dataSingleQa);
        console.log(window.dataSingleQa)
    });
    chrome.storage.local.get('dataJudgedQa', ({dataJudgedQa}) => {
        window.dataJudgedQa = Object.assign({}, window.dataJudgedQa, dataJudgedQa);
        console.log(window.dataJudgedQa)
    });
    chrome.storage.local.get('dataMultiQa', ({dataMultiQa}) => {
        window.dataMultiQa = Object.assign({}, window.dataMultiQa, dataMultiQa);
        console.log(window.dataMultiQa)
    });


    function qa() {
        if (location.hostname === 'gzak.gzsjzyxh.cn') {
            autoQa();
            learnQq();
        }
    }

    function autoQa() {
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
                            q = li.querySelector('div.dadis div.dime p').textContent.trim().replaceAll(' ', '');
                            a = li.querySelector('div.ok_daan span').textContent.trim().replaceAll(' ', '');
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
                            q = li.querySelector('div.dadis div.dime p').textContent.trim().replaceAll(' ', '');
                            a = li.querySelector('div.ok_daan span').textContent.trim().replaceAll(' ', '');
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
                            q = li.querySelector('div.dadis div.dime p').textContent.trim().replaceAll(' ', '');
                            a = li.querySelector('div.ok_daan span').textContent.trim().replaceAll(' ', '');
                            if (addQa(multiYsArr, k, 'multi', q, a)) {
                                addMulti[q] = a;
                            }
                        }
                    }
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

                    bodyDoc.dataset.isLearn = 'true';
                }
            }
        });
    }

    function addQa(ys, i, t, q, a) {
        try {
            if (q && a) {
                switch (t) {
                    case 'single':
                        if (!window.dataSingleQa.hasOwnProperty(q) || window.dataSingleQa[q] !== a) {
                            window.dataSingleQa[q] = a;
                            ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                            return true;
                        } else {
                            ys[i].setAttribute('style', 'background-color: #FFA500 !important');
                            return false;
                        }
                    case 'judged':
                        if (!window.dataJudgedQa.hasOwnProperty(q) || window.dataJudgedQa[q] !== a) {
                            window.dataJudgedQa[q] = a;
                            ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                            return true;
                        } else {
                            ys[i].setAttribute('style', 'background-color: #FFA500 !important');
                            return false;
                        }
                    case 'multi':
                        if (!window.dataMultiQa.hasOwnProperty(q) || window.dataMultiQa[q] !== a) {
                            window.dataMultiQa[q] = a;
                            ys[i].setAttribute('style', 'background-color: #3aa757 !important');
                            return true;
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

    setInterval(qa, 3000);
})();