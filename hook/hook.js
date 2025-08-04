async function setSnap(frame, name) {
    let snap = frame.snap;
    if (snap) {
        console.log(window.frames.document.location.href);
        if ('901f518fb691dbf752d3ebbc71c20e08c21cca84' === CryptoJS.SHA1(snap.toString()).toString()) {
            /*
            ctx.drawImage(video, 0, 0, width, height);
            Imagedata = canvas.toDataURL().substring(22);
            let imgBase = 'data:image/gif;base64,' + Imagedata
            let blob = dataURLtoFile(imgBase, 'image/jpeg');
            submitPic(blob);
            */
            // 显示canvas
            frame.canvas.style.border = '2px solid red';
            document.body.appendChild(frame.canvas);

            let imgs = await getStorageData(name);
            if (imgs && imgs.length > 0) {
                // 渲染图片
                const img = new Image();
                img.src = imgs[0]
                img.onload = function () {
                    frame.ctx.drawImage(img, 0, 0, frame.width, frame.height);
                }

                // 设置函数
                frame.snap = function () {
                    console.log('execute snap！！！')
                    let Imagedata = imgs[0].substring(22);
                    let imgBase = 'data:image/gif;base64,' + Imagedata
                    let blob = frame.dataURLtoFile(imgBase, 'image/jpeg');
                    frame.submitPic(blob);
                };
            }
        } else {
            console.log(snap.toString());
            alert('snap 存在更新，请关闭网页！');
        }
    }
}

async function setSnap1(frame, name) {
    let snap1 = frame.snap1;
    if (snap1) {
        if ('fe69c8d9cff3ff279c61bc1f4fae6c273b55a8c7' === CryptoJS.SHA1(snap1.toString()).toString()) {
            // let canvas1 = document.getElementById('canvas1');
            // canvas1.setAttribute('width', width);
            // canvas1.setAttribute('height', height);
            // let ctx1 = canvas1.getContext('2d');
            // ctx1.clearRect(0, 0, width, height);

            // let video1 = document.getElementById('webcam');

            // ctx1.drawImage(video1, 0, 0, width, height);
            // let Imagedata1 = canvas1.toDataURL().substring(22);
            // let imgBase1 = 'data:image/gif;base64,' + Imagedata1
            // let blob1 = dataURLtoFile(imgBase1, 'image/jpeg');
            // submitPic(blob1);
            // zp1 = 0;


            let canvas1 = frame.document.getElementById('canvas1');
            canvas1.setAttribute('width', frame.width);
            canvas1.setAttribute('height', frame.height);
            let ctx1 = canvas1.getContext('2d');
            ctx1.clearRect(0, 0, frame.width, frame.height);

            // 显示canvas
            frame.canvas.style.border = '2px solid red';
            canvas1.style.position = '';
            canvas1.style.left = '';

            let imgs1 = await getStorageData(name);
            if (imgs1 && imgs1.length > 0) {
                // 渲染图片
                const img1 = new Image();
                img1.src = imgs1[0]
                img1.onload = function () {
                    ctx1.drawImage(img1, 0, 0, frame.width, frame.height);
                }

                // 设置函数
                frame.snap1 = function () {
                    console.log('execute snap1！！！')
                    let Imagedata1 = imgs1[0].substring(22);
                    let imgBase1 = 'data:image/gif;base64,' + Imagedata1
                    let blob1 = frame.dataURLtoFile(imgBase1, 'image/jpeg');
                    frame.submitPic(blob1);
                    frame.zp1 = 0;
                }
            }
        } else {
            console.log(snap1.toString());
            alert('snap1 存在更新，请关闭网页！');
        }
    }
}

async function setSnap2(frame, name) {
    let snap2 = frame.snap2;
    if (snap2) {
        if ('ea3527a5ad126ad09ed7c08f523fd14c465a97aa' === CryptoJS.SHA1(snap2.toString()).toString()) {

        } else {
            console.log(snap2.toString());
            alert('snap2 存在更新，请关闭网页！');
        }
    }
}

async function takePictures() {
    const name = '123';
    const frames = window.frames;
    console.log(frames && frames.length > 0)
    if (frames && frames.length > 0) {
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

(async () => {
    takePictures()
})();