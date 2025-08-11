// 打开模态框
function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = img.src;
}

// 关闭模态框
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

// 点击模态框外部也关闭
window.onclick = function (event) {
    const modal = document.getElementById("imageModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// 删除照片
function deletePhoto(name, sha1, photoItem) {
    chrome.storage.local.get(name, (result) => {
        const student = result[name];
        if (student) {
            const idleImg = student['idleImg'] || [];
            let idx;
            if ((idx = idleImg.indexOf(sha1)) >= 0) {
                idleImg.splice(idx, 1);
                delete student[sha1];

                const saveStudent = {};
                saveStudent[name] = student
                chrome.storage.local.set(saveStudent, function () {
                    console.log(`删除照片成功：${name} ${sha1}`)
                });
            }
            photoItem.remove();
        }
    });
}

// --- 拖动逻辑封装 ---
function initializeDragAndDrop(sortableContainers) {
    if (!sortableContainers && sortableContainers.length === 0) {
        sortableContainers = document.querySelectorAll('.photos-container');
    }

    sortableContainers.forEach(sortableContainer => {
        if (sortableContainer.dataset.listenersAttached) {
            return;
        }

        let draggedItem = null;
        let xp = null;
        let yp = null;
        let w1 = null;
        let h1 = null;

        // 拖动开始
        sortableContainer.addEventListener('dragstart', (e) => {
            console.log("拖动开始");
            if (e.target.draggable && e.target.classList.contains('photo-item') && !e.target.classList.contains('add-photo-item')) {
                draggedItem = e.target;

                // 保存元素宽高，和鼠标距左定点的坐标偏移
                const rect = draggedItem.getBoundingClientRect();
                w1 = rect.width;
                h1 = rect.height;
                xp = e.clientX - rect.left;
                yp = e.clientY - rect.top;

                setTimeout(() => {
                    draggedItem.classList.add('dragging');
                }, 0);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.outerHTML); // 实际应用中可能只需要传ID或索引
            } else {
                e.preventDefault();
            }
        });

        // 拖动经过
        sortableContainer.addEventListener('dragover', (e) => {
            console.log('拖动经过');
            e.preventDefault();

            if (!draggedItem || !sortableContainer.contains(draggedItem)) {
                return;
            }

            // 获取所有可见的、非拖动中的、非“增加照片”的子元素
            const children = Array.from(sortableContainer.children).filter(child =>
                child.classList.contains('photo-item') &&
                !child.classList.contains('dragging') &&
                !child.classList.contains('add-photo-item')
            );

            let insertBeforeElement = null;
            let overlapSide = null;

            // 如果容器内没有其他可放置的元素，则将其放置在“增加照片”项之前（如果存在）
            const addPhotoItem = sortableContainer.querySelector('.add-photo-item');

            if (children.length === 0) {
                insertBeforeElement = addPhotoItem || null; // 如果没有其他元素，就放在addPhotoItem前面或容器末尾
            } else {
                console.log(`子元素数量：${children.length}`);

                let maxArea = 0;

                // 遍历所有子元素，找到最佳的插入点
                children.forEach(child => {
                    const rect = child.getBoundingClientRect();
                    // 计算目前拖动元素坐标
                    let x1 = e.clientX - xp;
                    let y1 = e.clientY - yp;

                    // 当前子元素坐标，长宽
                    let x2 = rect.left;
                    let y2 = rect.top;
                    let w2 = rect.width;
                    let h2 = rect.height;

                    let result = calculateOverlapArea(x1, y1, w1, h1, x2, y2, w2, h2)

                    if (result.overlapArea > 0 && result.overlapArea > maxArea && (result.overlapArea / (w1 * h1)) > 0.45) {
                        maxArea = result.overlapArea;
                        insertBeforeElement = child;
                        overlapSide = result.overlapSide;
                        console.log(`最大面积比：${(maxArea / (w1 * h1))}  ${overlapSide}`);
                    }
                });
            }

            // 执行 DOM 操作：只有当计算出的插入位置与当前拖动项的位置不同时才移动
            // if (draggedItem !== insertBeforeElement && draggedItem !== insertBeforeElement?.previousSibling) {
            if (draggedItem !== insertBeforeElement) {
                if (insertBeforeElement) {
                    if (overlapSide && overlapSide === 'left') {
                        console.log("向左")
                        sortableContainer.insertBefore(draggedItem, insertBeforeElement);
                    } else {
                        console.log("向右")
                        sortableContainer.insertBefore(draggedItem, insertBeforeElement.nextSibling);
                    }
                }
            }
        });

        // 拖动离开：此实现中不需特殊处理，因为实时DOM移动已完成预览
        sortableContainer.addEventListener('dragleave', (e) => {

        });

        // 放置
        sortableContainer.addEventListener('drop', (e) => {
            e.preventDefault(); // 阻止默认的放置行为

            // 确保拖动的元素存在且属于当前容器
            if (draggedItem && sortableContainer.contains(draggedItem)) {
                draggedItem.classList.remove('dragging'); // 移除透明样式，使元素可见
            }
            draggedItem = null; // 重置拖动项
        });

        // 拖动结束（无论成功放置还是取消）
        sortableContainer.addEventListener('dragend', (e) => {
            if (draggedItem && sortableContainer.contains(draggedItem)) {
                draggedItem.classList.remove('dragging');
            }
            draggedItem = null;
            xp = null;
            yp = null;
            w1 = null;
            h1 = null;
            console.log('拖动结束');

            // 跟新顺序
            let idleImg = [];
            const photoArr = sortableContainer.querySelectorAll('.photo-item[data-sha1]');

            for (let i = 0; i < photoArr.length; i++) {
                let photoItem = photoArr[i];
                idleImg.push(photoItem.dataset.sha1);
            }

            let name = sortableContainer.parentElement.parentElement.dataset.name;

            chrome.storage.local.get(name, (result) => {
                const student = result[name];
                if (!student) {
                    alert("该学员已删除！");
                    return;
                }
                student.idleImg = idleImg;

                const saveStudent = {};
                saveStudent[name] = student;
                chrome.storage.local.set(saveStudent, function () {
                    console.log(`更新顺序成功:${name}`);
                });
            });
        });

        // 确保当前容器内的“增加照片”项不可拖动
        const addPhotoItem = sortableContainer.querySelector('.add-photo-item');
        if (addPhotoItem) {
            addPhotoItem.draggable = false;
        }

        // 标记该容器已附加监听器，避免重复绑定
        sortableContainer.dataset.listenersAttached = 'true';
    });
}

/**
 * 计算两个矩形重叠的面积，并判断重叠区域在矩形B的哪一侧更多。
 *
 * 矩形A: (x1, y1) 为左上角坐标, w1 为宽度, h1 为高度。
 * 矩形B: (x2, y2) 为左上角坐标, w2 为宽度, h2 为高度。
 *
 * @returns {object} 包含以下属性的对象：
 * - overlapArea: number, 两个矩形重叠的总面积。如果没有重叠，则为0。
 * - overlapSide: string | null, 'left' 表示重叠主要在矩形B的左侧，
 * 'right' 表示重叠主要在矩形B的右侧，
 * 'equal' 表示左右重叠面积大致相等，
 * null 表示没有重叠。
 */
function calculateOverlapArea(x1, y1, w1, h1, x2, y2, w2, h2) {
    // 1. 计算重叠区域的水平范围
    const overlapX1 = Math.max(x1, x2);
    const overlapX2 = Math.min(x1 + w1, x2 + w2);
    const overlapWidth = overlapX2 - overlapX1;

    // 如果水平方向没有重叠，则面积为0
    if (overlapWidth <= 0) {
        return {overlapArea: 0, overlapSide: null};
    }

    // 2. 计算重叠区域的垂直范围
    const overlapY1 = Math.max(y1, y2);
    const overlapY2 = Math.min(y1 + h1, y2 + h2);
    const overlapHeight = overlapY2 - overlapY1;

    // 如果垂直方向没有重叠，则面积为0
    if (overlapHeight <= 0) {
        return {overlapArea: 0, overlapSide: null};
    }

    // 3. 重叠总面积
    const totalOverlapArea = overlapWidth * overlapHeight;

    // 4. 判断重叠区域在矩形B的哪一侧更多
    let overlapSide = 'equal'; // 默认相等

    // 计算矩形B的水平中点
    const midX_B = x2 + w2 / 2;

    // 计算重叠区域与矩形B左半部分的水平交集宽度
    const overlapWidthLeftHalfB = Math.max(0, Math.min(overlapX2, midX_B) - overlapX1);
    // 计算重叠区域与矩形B右半部分的水平交集宽度
    const overlapWidthRightHalfB = Math.max(0, overlapX2 - Math.max(overlapX1, midX_B));

    // 计算重叠区域与矩形B左右两半部分的面积
    const areaLeftHalfB = overlapWidthLeftHalfB * overlapHeight;
    const areaRightHalfB = overlapWidthRightHalfB * overlapHeight;

    // 比较左右两半部分的重叠面积
    // 使用一个小的 epsilon 值进行浮点数比较，以避免精度问题
    const EPSILON = 0.001; // 例如，1e-3

    if (areaLeftHalfB > areaRightHalfB + EPSILON) {
        overlapSide = 'left';
    } else if (areaRightHalfB > areaLeftHalfB + EPSILON) {
        overlapSide = 'right';
    } else {
        overlapSide = 'equal';
    }

    return {
        overlapArea: totalOverlapArea,
        overlapSide: overlapSide
    };
}

// --- 动态添加学员和照片的函数 ---

// 该函数用于向现有容器添加新的照片项
function addNewPhotoToContainer(name, addPhotoItemElement, sha1, imgBase64, alt = "") {
    const photosContainer = addPhotoItemElement.parentNode;
    const newPhotoItem = document.createElement('div');
    newPhotoItem.classList.add('photo-item');
    newPhotoItem.setAttribute('draggable', 'true'); // 确保新照片项是可拖动的
    newPhotoItem.dataset.sha1 = sha1;
    newPhotoItem.innerHTML = `
            <img src="${imgBase64}" alt="${alt}" style="font-size: 80px;">
            <div class="photo-caption delete-btn">删除</div>
        `;
    photosContainer.insertBefore(newPhotoItem, addPhotoItemElement);

    // 图片绑定点击事件
    newPhotoItem.querySelector('img').addEventListener('click', function () {
        openModal(this);
    });

    // 绑定删除事件
    newPhotoItem.querySelector('.delete-btn').addEventListener('click', function () {
        deletePhoto(name, sha1, this.parentNode);
    });
}

// 该函数用于动态添加一个新学员行
function addStudent(name) {
    const tableBody = document.querySelector('table tbody');
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-name', name);

    // 确保 '增加照片' 按钮也存在
    let photosHtml = `
            <div class="photo-item add-photo-item">
                <img src="img/jia.png">
                <div class="photo-caption">增加照片</div>
            </div>
        `;

    newRow.innerHTML = `
            <td class="name-cell">${name}<br/><button class="delete-student-btn"">删除</button></td>
            <td>
                <div class="photos-container">
                    ${photosHtml}
                </div>
            </td>
        `;

    tableBody.appendChild(newRow); // 将新行添加到 DOM

    // 绑定删除事件
    newRow.querySelector('.delete-student-btn').addEventListener('click', function () {
        deleteStudent(newRow, name);
    });

    // 绑定拖拽事件
    initializeDragAndDrop(newRow.querySelectorAll('.photos-container'));

    // 为新增学员行的 '增加照片' 按钮添加事件监听器
    const newAddButton = newRow.querySelector('.add-photo-item');
    if (newAddButton) {
        newAddButton.addEventListener('click', () => {
            // 为学员内部的“增加照片”按钮绑定文件选择功能
            addPhoto(newAddButton);
        });
    }
}

// 添加照片
function addPhoto(newAddButton) {
    const fileInput = document.getElementById('fileInput');

    // onchange 事件处理器现在是 async 函数，这是使用 await 的前提
    fileInput.onchange = async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        // 使用 for...of 循环配合 await 来实现串行处理
        for (const file of files) {
            try {
                console.log(`开始处理文件: ${file.name}`);
                // await 会暂停循环，直到当前文件所有操作完成
                await processSingleFile(file, newAddButton);
                console.log(`文件处理成功: ${file.name}`);
            } catch (error) {
                // 如果处理单个文件时出错（比如图片已存在），则捕获错误并提示
                console.error(`处理文件 ${file.name} 时失败:`, error.message);
                alert(error.message); // 将错误信息弹窗提示用户
            }
        }
        fileInput.value = ''; // 所有文件处理完后，清空输入
    };

    fileInput.click();
}

/**
 * 串行处理单个文件的核心逻辑
 * @param {File} file - 要处理的单个文件
 * @param {HTMLElement} newAddButton - 按钮元素，用于获取上下文信息
 * @returns {Promise<void>}
 */
async function processSingleFile(file, newAddButton) {
    // 1. 将图片裁剪、缩放并转换为Base64
    // 这个函数内部处理了 FileReader 和 Canvas 的所有异步操作
    const imgBase64 = await resizeImage(file, 400, 300);

    // 2. 计算 SHA1
    const sha1 = CryptoJS.SHA1(imgBase64).toString();

    // 3. 从 storage 中获取、修改和保存数据
    const name = newAddButton.parentElement.parentElement.parentElement.dataset.name;

    // 使用 Promise 包装 chrome.storage.get 来使用 await
    const result = await new Promise(resolve => chrome.storage.local.get(name, resolve));

    let student = result[name];
    if (!student) {
        // 使用 Promise.reject 或抛出错误，让调用方可以捕获
        throw new Error("学员已经被删除！");
    }

    const idleImg = student['idleImg'] || [];
    const useImg = student['useImg'] || [];

    if (idleImg.includes(sha1)) {
        throw new Error(`照片 ${file.name} 已存在！`);
    }
    if (useImg.includes(sha1)) {
        throw new Error(`照片 ${file.name} 已使用过！`);
    }

    idleImg.push(sha1);
    student[sha1] = imgBase64;

    const saveStudent = {[name]: student};

    // 使用 Promise 包装 chrome.storage.set 来使用 await
    await new Promise(resolve => chrome.storage.local.set(saveStudent, resolve));

    // 4. 更新UI
    addNewPhotoToContainer(name, newAddButton, sha1, imgBase64);
}

/**
 * 帮手函数：读取文件，使用Canvas裁剪并返回Base64编码的Promise
 * @param {File} file - 文件对象
 * @param {number} width - 目标宽度
 * @param {number} height - 目标高度
 * @returns {Promise<string>} - 解析为Base64字符串的Promise
 */
function resizeImage(file, width, height) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onerror = reject;
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onerror = reject;
            img.onload = () => {
                // 在内存中创建Canvas，而不是操作DOM中的元素，更高效，且不会在界面上造成闪烁
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const targetRatio = width / height;
                const imgRatio = img.width / img.height;
                let sx, sy, sWidth, sHeight;

                if (imgRatio > targetRatio) {
                    sHeight = img.height;
                    sWidth = img.height * targetRatio;
                    sx = (img.width - sWidth) / 2;
                    sy = 0;
                } else {
                    sWidth = img.width;
                    sHeight = img.width / targetRatio;
                    sx = 0;
                    sy = (img.height - sHeight) / 2;
                }

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);

                // 将结果 resolve 出去
                resolve(canvas.toDataURL());
            };
        };
    });
}

// 删除学员
function deleteStudent(row, name) {
    if (confirm(`确定删除学员“${name}”？`))
        chrome.storage.local.get('names', ({names}) => {
            let idx;
            if (!names || (idx = names.indexOf(name)) < 0) {
                row.remove();
                return;
            }
            names.splice(idx, 1);
            const obj = {};
            obj['names'] = names;
            chrome.storage.local.set(obj, function () {
                chrome.storage.local.remove(name, function () {
                    row.remove();
                    console.log(`删除学员成功！`);
                });
            });
        });
}

function addLocalPhoto(name) {
    chrome.storage.local.get(name, (result) => {
        const student = result[name];
        if (!student) {
            return;
        }
        const idleImg = student['idleImg'] || [];
        for (let i = 0; i < idleImg.length; i++) {
            const sha1 = idleImg[i];
            const imgBase64 = student[sha1];
            addNewPhotoToContainer(name, document.querySelector(`tr[data-name="${name}"] .add-photo-item`), sha1, imgBase64, i);
        }
    })
}

function initializeLocalData() {
    chrome.storage.local.get('names', ({names}) => {
        if (!names) {
            return;
        }
        for (let i = 0; i < names.length; i++) {
            // 增加学员
            addStudent(names[i]);
            // 增加学员照片
            addLocalPhoto(names[i]);
        }
    });
}

// --- 页面加载和事件绑定 ---
// 页面加载完成后初始化所有现有的拖放容器和名字编辑功能
document.addEventListener('DOMContentLoaded', () => {
    initializeLocalData(); // 初始本地数据

    // 为所有初始存在的“增加照片”按钮添加事件监听器
    document.querySelectorAll('.add-photo-item').forEach(addBtn => {
        addBtn.addEventListener('click', () => {
            // 为学员内部的“增加照片”按钮绑定文件选择功能
            addPhoto(addBtn);
        });
    });

    // 为“增加新学员”按钮添加点击事件
    const addStudentButton = document.getElementById('add-student-btn');
    if (addStudentButton) {
        addStudentButton.addEventListener('click', () => {
            let name = prompt("请输入新学员的名字：", "")
            name = name.trim();
            if (name) {
                chrome.storage.local.get('names', ({names}) => {
                    if (!names) {
                        names = [];
                    } else if (names.includes(name)) {
                        alert("该学员已存在！");
                        return;
                    }
                    names.push(name);
                    const student = {};
                    student[name] = {"idleImg": [], "useImg": []}; // 动态设置键名
                    student['names'] = names;
                    chrome.storage.local.set(student, function () {
                        addStudent(`${name}`);
                    });
                });
            }
        });
    }

    // 绑定模态框关闭事件
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function () {
            closeModal(); // 点击 modal-content 内部时关闭模态框
        });
    }

    // 确保图片上的停止冒泡仍然有效，阻止点击图片关闭模态框
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止点击图片时事件冒泡到 modal-content 或 window
        });
    }
});