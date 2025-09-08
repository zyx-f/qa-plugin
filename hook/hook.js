async function getImgs(frame, name) {
    let imgs;
    let pause = false;
    let fail = 0;
    do {
        try {
            imgs = await getStorageData(name);
            if (!(imgs && imgs.length > 0)) {
                frame.player && frame.player.pause();
                confirm(`请增加学员“${name}”的照片后点击确认`);
                pause = true;
            }
        }catch (e) {
            fail++;
            console.error(`${name} 获取照片失败 ${fail}次，失败原因：${e}`)
            if(fail >= 3){
                confirm(`${name} 获取照片失败 ${fail}次，如继续尝试请点击确认，若后续再失败每3次再提醒`);
                frame.player && frame.player.pause();
                pause = true;
            }
        }
    } while (!(imgs && imgs.length > 0));
    pause && frame.player && frame.player.play();
    return imgs;
}

async function setSnap(frame, name) {
    let snap = frame.snap;
    if (!snap) {
        return;
    }
    let snapKey = CryptoJS.SHA1(snap.toString()).toString()
    console.log(window.frames.document.location.href + '有 snap ' + snapKey);
    if ('5db5e4c56631f4ae9e0beccb5af8c838d0f2cf5d' === snapKey) {
        return;
    } else if ('901f518fb691dbf752d3ebbc71c20e08c21cca84' !== snapKey) {
        console.log(snap.toString());
        alert('snap 存在更新，请关闭网页！');
        return;
    }
    /*
    ctx.drawImage(video, 0, 0, width, height);
    Imagedata = canvas.toDataURL().substring(22);
    let imgBase = 'data:image/gif;base64,' + Imagedata
    let blob = dataURLtoFile(imgBase, 'image/jpeg');
    submitPic(blob);
    */

    // 设置函数
    frame.snap = async function () {
        console.log('execute snap！！！')

        // 显示canvas
        frame.canvas.style.border = '2px solid red';
        document.body.appendChild(frame.canvas);

        // 获取学员照片
        let imgs = await getImgs(frame, name);

        // 渲染图片
        const img = new Image();
        img.src = imgs[0]
        img.onload = function () {
            frame.ctx.drawImage(img, 0, 0, frame.width, frame.height);
        }
        let Imagedata = imgs[0].substring(22);
        let imgBase = 'data:image/gif;base64,' + Imagedata
        let blob = frame.dataURLtoFile(imgBase, 'image/jpeg');
        frame.submitPic(blob);
        frame.canvas.style.border = '2px solid #00ff00';
    };
    console.log(window.frames.document.location.href + ' 注入 snap ！！！')

}

async function setSnap1(frame, name) {
    let snap1 = frame.snap1;
    if (!snap1) {
        return;
    }
    let snap1Key = CryptoJS.SHA1(snap1.toString()).toString()
    console.log(window.frames.document.location.href + '有 snap1 ' + snap1Key);
    if ('baaa60f004021f10e32afd7fb3dc104e49f48f76' === snap1Key) {
        return;
    } else if ('fe69c8d9cff3ff279c61bc1f4fae6c273b55a8c7' !== snap1Key) {
        console.log(snap1.toString());
        frame.player && frame.player.pause();
        alert('snap1 存在更新，请关闭网页！');
        return;
    }
    /*
    let canvas1 = document.getElementById('canvas1');
    canvas1.setAttribute('width', width);
    canvas1.setAttribute('height', height);
    let ctx1 = canvas1.getContext('2d');
    ctx1.clearRect(0, 0, width, height);

    let video1 = document.getElementById('webcam');

    ctx1.drawImage(video1, 0, 0, width, height);
    let Imagedata1 = canvas1.toDataURL().substring(22);
    let imgBase1 = 'data:image/gif;base64,' + Imagedata1
    let blob1 = dataURLtoFile(imgBase1, 'image/jpeg');
    submitPic(blob1);
    zp1 = 0;
    */

    // 设置函数
    frame.snap1 = async function () {
        console.log('execute snap1！！！')

        let canvas1 = frame.document.getElementById('canvas1');
        canvas1.setAttribute('width', frame.width);
        canvas1.setAttribute('height', frame.height);
        let ctx1 = canvas1.getContext('2d');
        ctx1.clearRect(0, 0, frame.width, frame.height);

        // 显示canvas
        canvas1.style.border = '2px solid red';
        canvas1.style.position = '';
        canvas1.style.left = '';

        // 获取学员照片
        let imgs1 = await getImgs(frame, name);

        // 渲染图片
        const img1 = new Image();
        img1.src = imgs1[0]
        img1.onload = function () {
            ctx1.drawImage(img1, 0, 0, frame.width, frame.height);
        }

        let Imagedata1 = imgs1[0].substring(22);
        let imgBase1 = 'data:image/gif;base64,' + Imagedata1
        let blob1 = frame.dataURLtoFile(imgBase1, 'image/jpeg');
        frame.submitPic(blob1);
        frame.zp1 = 0;
        canvas1.style.border = '2px solid #00ff00';
    }
    console.log(window.frames.document.location.href + ' 注入 snap1 ！！！')

}

async function setSnap2(frame, name) {
    let snap2 = frame.snap2;
    if (!snap2) {
        return;
    }
    let snap2Key = CryptoJS.SHA1(snap2.toString()).toString()
    console.log(window.frames.document.location.href + '有 snap2 ' + snap2Key);
    if ('d701c9296046c965c2753db6c536b694a9413520' === snap2Key) {
        return;
    } else if ('ea3527a5ad126ad09ed7c08f523fd14c465a97aa' !== snap2Key) {
        console.log(snap2.toString());
        frame.player && frame.player.pause();
        alert('snap2 存在更新，请关闭网页！');
        return;
    }
    /*
    let canvas2 = document.getElementById('canvas2');
    canvas2.setAttribute('width', width);
    canvas2.setAttribute('height', height);
    let ctx2 = canvas2.getContext('2d');
    ctx2.clearRect(0, 0, width, height);

    let video2 = document.getElementById('webcam');

    ctx2.drawImage(video2, 0, 0, width, height);
    let Imagedata2 = canvas2.toDataURL().substring(22);
    let imgBase2 = 'data:image/gif;base64,' + Imagedata2
    let blob2 = dataURLtoFile(imgBase2, 'image/jpeg');
    submitPic(blob2);
    zp2 = 0;
    */

    // 设置函数
    frame.snap2 = async function () {
        console.log('execute snap2！！！')

        let canvas2 = frame.document.getElementById('canvas2');
        canvas2.setAttribute('width', frame.width);
        canvas2.setAttribute('height', frame.height);
        let ctx2 = canvas2.getContext('2d');
        ctx2.clearRect(0, 0, frame.width, frame.height);

        // 显示canvas
        canvas2.style.border = '2px solid red';
        canvas2.style.position = '';
        canvas2.style.left = '';

        // 获取学员照片
        let imgs2 = await getImgs(frame, name);

        // 渲染图片
        const img2 = new Image();
        img2.src = imgs2[0]
        img2.onload = function () {
            ctx2.drawImage(img2, 0, 0, frame.width, frame.height);
        }

        let Imagedata2 = imgs2[0].substring(22);
        let imgBase2 = 'data:image/gif;base64,' + Imagedata2
        let blob2 = frame.dataURLtoFile(imgBase2, 'image/jpeg');
        frame.submitPic(blob2);
        frame.zp2 = 0;
        canvas2.style.border = '2px solid #00ff00';
    }
    console.log(window.frames.document.location.href + ' 注入 snap2 ！！！')


}

async function takePictures() {
    try {
        const frames = window.frames;
        if (frames && frames.length > 0) {
            var cite = document.querySelector('ul.layui-nav.top_menu li a cite');
            if (!cite) {
                return;
            }
            var nodes = cite.childNodes;
            if (!nodes || nodes.length <= 0) {
                return;
            }
            let name = nodes[0].nodeValue;
            name = name ? name : '';
            name = name.replaceAll('\n', '').trim()
            if (!name) {
                return;
            }
            console.log(`name=${name}`)

            for (let i = 0; i < frames.length; i++) {
                let frame = frames[i];
                // /ZXXX/RZPage
                await setSnap(frame, name);

                // /ZXXX/IndexCLASS
                await setSnap1(frame, name);

                // /ZXXX/IndexCLASS
                await setSnap2(frame, name);
            }
        }
    } catch (e) {
        console.error(e)
    }
}

// 获取存储数据
function getStorageData(key, imgNum = 1) {
    return new Promise((resolve) => {
        // 1. 监听来自 content.js 的响应
        const listener = (event) => {
            if (event.source === window && event.data.type && event.data.type === 'RESP_IMG_FROM_STORAGE') {
                // 收到响应后，移除监听器并解析 Promise
                window.removeEventListener('message', listener);
                resolve(event.data.payload);
            }
        };
        window.addEventListener('message', listener);

        // 2. 向 content.js 发送获取数据的请求
        window.postMessage({type: 'REQ_IMG_FROM_STORAGE', key: key, imgNum: imgNum}, '*');
    });
}

(async function runTask() {
    await takePictures();
    setTimeout(runTask, 1000); // 等待1秒后再次执行
})();