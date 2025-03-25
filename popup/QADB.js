document.addEventListener('DOMContentLoaded', function () {
    var totalDoc = document.getElementById('total-count');

    chrome.storage.local.get('dataSingleQa', ({dataSingleQa}) => {
        const entries = Object.entries(dataSingleQa);
        totalDoc.textContent = parseInt(totalDoc.textContent) + entries.length;
        document.getElementById('single-total').textContent = '单选题（' + entries.length + '）';
        document.getElementById('single-title').textContent = '单选题（' + entries.length + '）';

        const fragment = document.createDocumentFragment();
        entries.forEach(([q, a], i) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${++i}</td><td>${q}</td><td>${a}</td>`;
            fragment.appendChild(row);
        });
        document.getElementById('single-body').appendChild(fragment);
    });

    chrome.storage.local.get('dataJudgedQa', ({dataJudgedQa}) => {
        const entries = Object.entries(dataJudgedQa);
        totalDoc.textContent = parseInt(totalDoc.textContent) + entries.length;
        document.getElementById('judged-total').textContent = '是非题（' + entries.length + '）';
        document.getElementById('judged-title').textContent = '是非题（' + entries.length + '）';

        const fragment = document.createDocumentFragment();
        entries.forEach(([q, a], i) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${++i}</td><td>${q}</td><td>${a}</td>`;
            fragment.appendChild(row);
        });
        document.getElementById('judged-body').appendChild(fragment);
    });

    chrome.storage.local.get('dataMultiQa', ({dataMultiQa}) => {
        const entries = Object.entries(dataMultiQa);
        totalDoc.textContent = parseInt(totalDoc.textContent) + entries.length;
        document.getElementById('multi-total').textContent = '多选题（' + entries.length + '）';
        document.getElementById('multi-title').textContent = '多选题（' + entries.length + '）';

        const fragment = document.createDocumentFragment();
        entries.forEach(([q, a], i) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${++i}</td><td>${q}</td><td>${a}</td>`;
            fragment.appendChild(row);
        });
        document.getElementById('multi-body').appendChild(fragment);
    });

    window.onscroll = function() {
        var btn = document.getElementById("back-to-top");
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    };

    // 点击按钮回到顶部
    document.getElementById("back-to-top").onclick = function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    };
});