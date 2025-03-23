(function () {
    console.log("QA Content已运行");

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
            var isLearn = bodyDoc.dataset.isLearn;
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
                    var saveSingle = false, saveJudged = false, saveMulti = false;

                    // 题
                    var singleDoc = document.querySelector('.xuanzheti.jQueslevel1[data-type="0"]');
                    if (singleDoc && singleDoc.querySelector('.xuanzheti_title')
                        && singleDoc.querySelector('.xuanzheti_title').textContent.trim() === '单选题') {
                        console.log('单选题');
                        listsd = singleDoc.querySelectorAll('li.listsd');
                        for (k = 0; k < listsd.length; k++) {
                            li = listsd[k];
                            q = li.querySelector('div.dadis div.dime p').textContent.trim();
                            a = li.querySelector('div.ok_daan span').textContent.trim();
                            if (addQa(singleYsArr, k, 'single', q, a)) {
                                saveSingle = true;
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
                            q = li.querySelector('div.dadis div.dime p').textContent.trim();
                            a = li.querySelector('div.ok_daan span').textContent.trim();
                            if (addQa(judgedYsArr, k, 'judged', q, a)) {
                                saveJudged = true;
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
                            q = li.querySelector('div.dadis div.dime p').textContent.trim();
                            a = li.querySelector('div.ok_daan span').textContent.trim();
                            if (addQa(multiYsArr, k, 'multi', q, a)) {
                                saveMulti = true;
                            }
                        }
                    }
                } finally {
                    if (saveSingle) {
                        chrome.storage.local.set({'dataSingleQa': window.dataSingleQa}, function () {
                            console.log("save dataSingleQa succeed");
                        });
                    }
                    if (saveJudged) {
                        chrome.storage.local.set({'dataJudgedQa': window.dataJudgedQa}, function () {
                            console.log("save dataJudgedQa succeed");
                        });
                    }
                    if (saveMulti) {
                        chrome.storage.local.set({'dataMultiQa': window.dataMultiQa}, function () {
                            console.log("save dataMultiQa succeed");
                        });
                    }
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
                        if (!window.dataSingleQa.hasOwnProperty(q)) {
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
                        } else {
                            ys[i].setAttribute('style', 'background-color: #FFA500 !important');
                            return false;
                        }
                    case 'multi':
                        if (!window.dataMultiQa.hasOwnProperty(q)) {
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