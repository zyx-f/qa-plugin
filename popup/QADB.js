document.addEventListener('DOMContentLoaded', function () {
    var totalDoc = document.getElementById('total-count');

    chrome.storage.local.get(['dataSingleQa', 'addSingleQa'], (result) => {
        const dataSingleQa = Object.assign({}, window.dataSingleQa, result.dataSingleQa || {});
        const addSingleQa = result.addSingleQa || {};
        let total = 0;

        const fragment = document.createDocumentFragment();
        Object.entries(dataSingleQa).forEach(([q, a]) => {
            if (!(q in addSingleQa)) {
                total++;
                const row = document.createElement("tr");
                row.innerHTML = `<td>${total}</td><td>${q}</td><td>${a}</td><td>-</td>`;
                fragment.appendChild(row);
            }
        });
        Object.entries(addSingleQa).forEach(([q, a]) => {
            total++;
            const row = document.createElement("tr");
            row.innerHTML = `<td>${total}</td><td>${q}</td><td>${a}</td><td><button class="del-row" data-type="single" data-q="${q}">删除</button></td>`;
            fragment.appendChild(row);
        });

        totalDoc.textContent = parseInt(totalDoc.textContent) + total;
        document.getElementById('single-total').textContent = '单选题（' + total + '）';
        document.getElementById('single-title').textContent = '单选题（' + total + '）';
        document.getElementById('single-body').appendChild(fragment);
    });

    chrome.storage.local.get(['dataJudgedQa', 'addJudgedQa'], (result) => {
        const dataJudgedQa = Object.assign({}, window.dataJudgedQa, result.dataJudgedQa || {});
        const addJudgedQa = result.addJudgedQa || {};
        let total = 0;

        const fragment = document.createDocumentFragment();
        Object.entries(dataJudgedQa).forEach(([q, a]) => {
            if (!(q in addJudgedQa)) {
                total++;
                const row = document.createElement("tr");
                row.innerHTML = `<td>${total}</td><td>${q}</td><td>${a}</td><td>-</td>`;
                fragment.appendChild(row);
            }
        });
        Object.entries(addJudgedQa).forEach(([q, a]) => {
            total++;
            const row = document.createElement("tr");
            row.innerHTML = `<td>${total}</td><td>${q}</td><td>${a}</td><td><button class="del-row" data-type="judged" data-q="${q}">删除</button></td>`;
            fragment.appendChild(row);
        });

        totalDoc.textContent = parseInt(totalDoc.textContent) + total;
        document.getElementById('judged-total').textContent = '是非题（' + total + '）';
        document.getElementById('judged-title').textContent = '是非题（' + total + '）';
        document.getElementById('judged-body').appendChild(fragment);
    });

    chrome.storage.local.get(['dataMultiQa', 'addMultiQa'], (result) => {
        const dataMultiQa = Object.assign({}, window.dataMultiQa, result.dataMultiQa || {});
        const addMultiQa = result.addMultiQa || {};
        let total = 0;

        const fragment = document.createDocumentFragment();
        Object.entries(dataMultiQa).forEach(([q, a]) => {
            if (!(q in addMultiQa)) {
                total++;
                const row = document.createElement("tr");
                row.innerHTML = `<td>${total}</td><td>${q}</td><td>${a}</td><td>-</td>`;
                fragment.appendChild(row);
            }
        });
        Object.entries(addMultiQa).forEach(([q, a]) => {
            total++;
            const row = document.createElement("tr");
            row.innerHTML = `<td>${total}</td><td>${q}</td><td>${a}</td><td><button class="del-row" data-type="multi" data-q="${q}">删除</button></td>`;
            fragment.appendChild(row);
        });

        totalDoc.textContent = parseInt(totalDoc.textContent) + total;
        document.getElementById('multi-total').textContent = '多选题（' + total + '）';
        document.getElementById('multi-title').textContent = '多选题（' + total + '）';
        document.getElementById('multi-body').appendChild(fragment);
    });

    window.onscroll = function () {
        var btn = document.getElementById("back-to-top");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    };

    // 导出按钮
    document.getElementById("export-btn").onclick = function () {
        chrome.storage.local.get(['dataSingleQa', 'dataJudgedQa', 'dataMultiQa', 'addSingleQa', 'addJudgedQa', 'addMultiQa'], function (result) {
            var data = {
                dataSingleQa: result.dataSingleQa || {},
                dataJudgedQa: result.dataJudgedQa || {},
                dataMultiQa: result.dataMultiQa || {},
                addSingleQa: result.addSingleQa || {},
                addJudgedQa: result.addJudgedQa || {},
                addMultiQa: result.addMultiQa || {},
            };
            const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "qa.json";
            link.click();
            URL.revokeObjectURL(url);
        });
    };

    // 导入按钮
    document.getElementById("import-btn").onclick = function () {
        document.getElementById("file-input").click();
    };

    // 文件选择后导入
    document.getElementById("file-input").onchange = function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    chrome.storage.local.get(['dataSingleQa', 'dataJudgedQa', 'dataMultiQa', 'addSingleQa', 'addJudgedQa', 'addMultiQa'], function (result) {
                        var dataSingleQa, dataJudgedQa, dataMultiQa, addSingleQa, addJudgedQa, addMultiQa;
                        dataSingleQa = Object.assign({}, result.dataSingleQa || {}, data.dataSingleQa || {});
                        dataJudgedQa = Object.assign({}, result.dataJudgedQa || {}, data.dataJudgedQa || {});
                        dataMultiQa = Object.assign({}, result.dataMultiQa || {}, data.dataMultiQa || {});
                        addSingleQa = Object.assign({}, result.addSingleQa || {}, data.addSingleQa || {});
                        addJudgedQa = Object.assign({}, result.addJudgedQa || {}, data.addJudgedQa || {});
                        addMultiQa = Object.assign({}, result.addMultiQa || {}, data.addMultiQa || {});
                        chrome.storage.local.set({
                            dataSingleQa: dataSingleQa,
                            dataJudgedQa: dataJudgedQa,
                            dataMultiQa: dataMultiQa,
                            addSingleQa: addSingleQa,
                            addJudgedQa: addJudgedQa,
                            addMultiQa: addMultiQa,
                        }, function () {
                            showToast("导入成功")
                            window.location.reload();
                        });
                    });
                } catch (error) {
                    alert("导入失败！请检查文件格式。");
                }
            };
            reader.readAsText(file);
            document.getElementById("file-input").value = "";
        }
    };

    // 获取DOM元素
    const addQaBtn = document.getElementById('add-qa-btn');
    const modal = document.getElementById('qa-modal');
    const closeBtn = document.querySelector('.close');
    const saveQaBtn = document.getElementById('save-qa-btn');
    const toast = document.getElementById('toast');

    // 点击新增QA按钮显示模态框
    addQaBtn.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    // 点击关闭按钮隐藏模态框
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // 点击模态框外部隐藏模态框
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 去除空格函数
    function removeSpaces(event) {
        const inputElement = event.target;
        const originalValue = inputElement.value;
        const newValue = replacePunctuation(originalValue.replace(/\s+/g, ""));

        // 如果值有变化，则更新输入框的值
        if (originalValue !== newValue) {
            inputElement.value = newValue;
        }
    }

    // 添加输入事件监听器
    document.getElementById('qa-question').addEventListener('input', removeSpaces);
    document.getElementById('qa-answer').addEventListener('input', removeSpaces);

    // 保存QA数据
    saveQaBtn.addEventListener('click', function () {
        const qaType = document.getElementById('qa-type').value;
        const question = replacePunctuation(document.getElementById('qa-question').value.trim().replace(/\s+/g, ""));
        const answer = replacePunctuation(document.getElementById('qa-answer').value.trim().replace(/\s+/g, ""));

        if (!question || !answer) {
            showToast('题目和答案不能为空！');
            return;
        }

        // 检查题目是否已存在
        chrome.storage.local.get(['dataSingleQa', 'dataJudgedQa', 'dataMultiQa', 'addSingleQa', 'addJudgedQa', 'addMultiQa'], function (result) {
            const dataSingleQa = result.dataSingleQa || {};
            const dataJudgedQa = result.dataJudgedQa || {};
            const dataMultiQa = result.dataMultiQa || {};
            const addSingleQa = result.addSingleQa || {};
            const addJudgedQa = result.addJudgedQa || {};
            const addMultiQa = result.addMultiQa || {};
            let oldAnswer = undefined;
            switch (qaType) {
                case 'single':
                    oldAnswer = addSingleQa[question]
                    oldAnswer = oldAnswer ? oldAnswer : dataSingleQa[question];
                    oldAnswer = oldAnswer ? oldAnswer : window.dataSingleQa[question]
                    break;
                case 'judged':
                    oldAnswer = addJudgedQa[question]
                    oldAnswer = oldAnswer ? oldAnswer : dataJudgedQa[question];
                    oldAnswer = oldAnswer ? oldAnswer : window.dataJudgedQa[question]
                    break;
                case 'multi':
                    oldAnswer = addMultiQa[question]
                    oldAnswer = oldAnswer ? oldAnswer : dataMultiQa[question];
                    oldAnswer = oldAnswer ? oldAnswer : window.dataJudgedQa[question]
                    break;
            }

            if (!oldAnswer || (oldAnswer && confirm('该题目已存在，是否覆盖原有答案？'))) {
                switch (qaType) {
                    case 'single':
                        addSingleQa[question] = answer;
                        break;
                    case 'judged':
                        addJudgedQa[question] = answer;
                        break;
                    case 'multi':
                        addMultiQa[question] = answer;
                        break;
                }
                // 题目不存在，新增QA
                chrome.storage.local.set({
                    'addSingleQa': addSingleQa,
                    'addJudgedQa': addJudgedQa,
                    'addMultiQa': addMultiQa
                }, function () {
                    showToast('QA保存成功！');

                    // 清空表单
                    document.getElementById('qa-question').value = '';
                    document.getElementById('qa-answer').value = '';

                    // 关闭模态框
                    modal.style.display = 'none';
                    window.location.reload();
                });
            }
        });
    });

    // 删除
    document.querySelectorAll('.table-body').forEach((tableBody) => {
        tableBody.addEventListener('click', (event) => {
            const target = event.target;

            // 检查点击的是否是 del-row 按钮
            if (target.classList.contains('del-row')) {
                const row = target.closest('tr'); // 找到最近的 tr（行）
                const question = target.getAttribute('data-q'); // 获取 data-q 属性
                const type = target.getAttribute('data-type'); // 获取 data-type 属性
                switch (type) {
                    case 'single':
                        chrome.storage.local.get('addSingleQa', ({addSingleQa}) => {
                            delete addSingleQa[question];
                            chrome.storage.local.set({addSingleQa}, () => {
                                row.remove();
                                showToast(`删除成功`);
                                window.location.reload();
                            });
                        });
                        break;
                    case 'judged':
                        chrome.storage.local.get('addJudgedQa', ({addJudgedQa}) => {
                            delete addJudgedQa[question];
                            chrome.storage.local.set({addJudgedQa}, () => {
                                row.remove();
                                showToast(`删除成功`);
                                window.location.reload();
                            });
                        });
                        break;
                    case 'multi':
                        chrome.storage.local.get('addMultiQa', ({addMultiQa}) => {
                            delete addMultiQa[question];
                            chrome.storage.local.set({addMultiQa}, () => {
                                row.remove();
                                showToast(`删除成功`);
                                window.location.reload();
                            });
                        });
                        break;
                }
            }
        });
    })


    // 显示提示信息
    function showToast(message) {
        toast.textContent = message;
        toast.className = 'toast show';

        setTimeout(function () {
            toast.className = toast.className.replace('show', '');
        }, 3000);
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

    // 点击按钮回到顶部
    document.getElementById("back-to-top").onclick = function () {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    };
});