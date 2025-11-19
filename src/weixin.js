function popwxbind() {
    layer.open({
        type: 2,
        area: ['340px', '320px'],
        title: false,
        shade: 0.8,
        moveType: 1,
        anim: 5,
        shift: 1,
        resize: false,
        scrollbar: false,
        fixed: true,
        closeBtn: 1,
        content: '/WeChat/wxqrcodebind'
    });
}

function popwxstudy(token) {
    $.get("/WeChat/bpopwxwindow?token=" + token+"&jtype=1", function (res) {
        if (res.code == 1) {
            layer.open({
                type: 2,
                area: ['340px', '320px'],
                title: false,
                shade: 0.8,
                moveType: 1,
                anim: 5,
                shift: 1,
                resize: false,
                scrollbar: false,
                fixed: true,
                closeBtn: 0,
                content: '/WeChat/wxqrcodestudy?token=' + token
            });
        }
    });
}

function popwxkaoshi(token) {
    $.get("/WeChat/bpopwxwindow?token=" + token + "&jtype=2", function (res) {
        if (res.code == 1) {
            layer.open({
                type: 2,
                area: ['340px', '320px'],
                title: false,
                shade: 0.8,
                moveType: 1,
                anim: 5,
                shift: 1,
                resize: false,
                scrollbar: false,
                fixed: true,
                closeBtn: 0,
                content: '/WeChat/wxqrcodekaoshi?token=' + token
            });
        }
    });
}


function popwxkaoshiend(token) {
    layer.open({
        type: 2,
        area: ['340px', '320px'],
        title: false,
        shade: 0.8,
        moveType: 1,
        anim: 5,
        shift: 1,
        resize: false,
        scrollbar: false,
        fixed: true,
        closeBtn: 0,
        content: '/WeChat/wxqrcodekaoshiend?token=' + token
    });
}

 