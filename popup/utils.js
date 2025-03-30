class Utils {

    // 获取元素
    static $(selector) {
        return document.querySelector(selector);
    }

    static $$(selector) {
        return document.querySelectorAll(selector);
    }

    // 创建元素
    static createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'className') {
                el.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(el.style, value);
            } else {
                el.setAttribute(key, value);
            }
        }
        children.forEach(child => {
            if (typeof child === 'string') {
                el.appendChild(document.createTextNode(child));
            } else {
                el.appendChild(child);
            }
        });
        return el;
    }

    // 添加类名
    static addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    // 移除类名
    static removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    // 判断是否有类名
    static hasClass(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    }

    // 切换类名
    static toggleClass(el, className) {
        if (this.hasClass(el, className)) {
            this.removeClass(el, className);
        } else {
            this.addClass(el, className);
        }
    }

    // 获取/设置元素样式
    static css(el, prop, value) {
        if (arguments.length === 2) {
            return window.getComputedStyle(el, null).getPropertyValue(prop);
        } else {
            el.style[prop] = value;
        }
    }

    // 显示元素
    static show(el) {
        el.style.display = '';
    }

    // 隐藏元素
    static hide(el) {
        el.style.display = 'none';
    }

    // 获取元素在文档中的位置
    static offset(el) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    }

    // 判断是否为数组
    static isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
    }

    // 判断是否为对象
    static isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }

    // 判断是否为纯对象
    static isPlainObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    // 判断是否为函数
    static isFunction(obj) {
        return typeof obj === 'function';
    }

    // 判断是否为字符串
    static isString(obj) {
        return typeof obj === 'string';
    }

    // 判断是否为数字
    static isNumber(obj) {
        return typeof obj === 'number' && !isNaN(obj);
    }

    // 判断是否为布尔值
    static isBoolean(obj) {
        return typeof obj === 'boolean';
    }

    // 判断是否为日期对象
    static isDate(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    // 判断是否为正则表达式
    static isRegExp(obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
    }

    // 判断是否为null
    static isNull(obj) {
        return obj === null;
    }

    // 判断是否为undefined
    static isUndefined(obj) {
        return obj === undefined;
    }

    // 判断是否为null或undefined
    static isNullOrUndefined(obj) {
        return obj === null || obj === undefined;
    }

    // 深度克隆对象
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        const clone = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clone[key] = this.deepClone(obj[key]);
            }
        }
        return clone;
    }

    // 对象合并（深合并）
    static deepMerge(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isPlainObject(target) && this.isPlainObject(source)) {
            for (const key in source) {
                if (this.isPlainObject(source[key])) {
                    if (!target[key]) Object.assign(target, {[key]: {}});
                    this.deepMerge(target[key], source[key]);
                } else if (this.isArray(source[key])) {
                    target[key] = this.deepClone(source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }

        return this.deepMerge(target, ...sources);
    }

    // 格式化日期
    static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        const padZero = num => (num < 10 ? `0${num}` : num);

        const map = {
            YYYY: date.getFullYear(),
            MM: padZero(date.getMonth() + 1),
            DD: padZero(date.getDate()),
            HH: padZero(date.getHours()),
            mm: padZero(date.getMinutes()),
            ss: padZero(date.getSeconds()),
            SSS: padZero(date.getMilliseconds()),
        };

        return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, matched => map[matched]);
    }

    // 获取当前时间戳
    static getTimestamp() {
        return Date.now();
    }

    // 日期加减
    static dateAdd(date, interval, units) {
        if (!(date instanceof Date)) {
            date = new Date(date);
        }

        const ret = new Date(date);
        switch (interval.toLowerCase()) {
            case 'year':
                ret.setFullYear(ret.getFullYear() + units);
                break;
            case 'quarter':
                ret.setMonth(ret.getMonth() + 3 * units);
                break;
            case 'month':
                ret.setMonth(ret.getMonth() + units);
                break;
            case 'week':
                ret.setDate(ret.getDate() + 7 * units);
                break;
            case 'day':
                ret.setDate(ret.getDate() + units);
                break;
            case 'hour':
                ret.setTime(ret.getTime() + units * 3600000);
                break;
            case 'minute':
                ret.setTime(ret.getTime() + units * 60000);
                break;
            case 'second':
                ret.setTime(ret.getTime() + units * 1000);
                break;
            default:
                ret.setTime(ret.getTime() + units);
                break;
        }
        return ret;
    }

    // 计算两个日期之间的天数差
    static dateDiff(date1, date2) {
        if (!(date1 instanceof Date)) date1 = new Date(date1);
        if (!(date2 instanceof Date)) date2 = new Date(date2);

        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    // 判断是否为闰年
    static isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // 去除字符串两端空格
    static trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    // 去除字符串左端空格
    static ltrim(str) {
        return str.replace(/^\s+/g, '');
    }

    // 去除字符串右端空格
    static rtrim(str) {
        return str.replace(/\s+$/g, '');
    }

    // 字符串首字母大写
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 字符串每个单词首字母大写
    static capitalizeWords(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    // 生成随机字符串
    static randomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // 字符串截取
    static truncate(str, length, ending = '...') {
        if (str.length > length) {
            return str.substring(0, length) + ending;
        }
        return str;
    }

    // HTML转义
    static escapeHtml(str) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return str.replace(/[&<>"']/g, m => map[m]);
    }

    // HTML反转义
    static unescapeHtml(str) {
        const map = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'"
        };
        return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => map[m]);
    }

    // URL参数转对象
    static parseQueryString(url) {
        const query = {};
        const queryString = url.split('?')[1];
        if (!queryString) return query;

        queryString.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
        return query;
    }

    // 对象转URL参数
    static toQueryString(obj) {
        return Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&');
    }


    // 生成随机数
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 数字千分位格式化
    static thousands(num, decimals = 2) {
        num = parseFloat(num);
        if (isNaN(num)) return '0';

        const parts = num.toFixed(decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    // 数字补零
    static padZero(num, length = 2) {
        return (Array(length).join('0') + num).slice(-length);
    }

    // 限制数字范围
    static clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    // 数字转中文
    static numberToChinese(num) {
        if (isNaN(num)) return '';
        const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿'];

        const numStr = num.toString();
        let result = '';

        for (let i = 0; i < numStr.length; i++) {
            const digit = parseInt(numStr[i]);
            const unit = units[numStr.length - 1 - i];

            if (digit === 0) {
                if (i === numStr.length - 1 || numStr[i + 1] !== '0') {
                    result += digits[digit];
                }
            } else {
                result += digits[digit] + unit;
            }
        }

        return result;
    }

    // 设置localStorage
    static setLocal(key, value) {
        if (this.isObject(value)) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    // 获取localStorage
    static getLocal(key) {
        let value = localStorage.getItem(key);
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    // 移除localStorage
    static removeLocal(key) {
        localStorage.removeItem(key);
    }

    // 清空localStorage
    static clearLocal() {
        localStorage.clear();
    }

    // 设置sessionStorage
    static setSession(key, value) {
        if (this.isObject(value)) {
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    }

    // 获取sessionStorage
    static getSession(key) {
        let value = sessionStorage.getItem(key);
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }

    // 移除sessionStorage
    static removeSession(key) {
        sessionStorage.removeItem(key);
    }

    // 清空sessionStorage
    static clearSession() {
        sessionStorage.clear();
    }

    // 设置cookie
    static setCookie(name, value, days = 7, path = '/') {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path}`;
    }

    // 获取cookie
    static getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = this.trim(cookies[i]);
            if (cookie.startsWith(`${name}=`)) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
        return null;
    }


    static removeCookie(name, path = '/') {
        this.setCookie(name, '', -1, path);
    }


    // 获取浏览器类型
    static getBrowser() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Firefox') > -1) return 'Firefox';
        if (ua.indexOf('Chrome') > -1) return 'Chrome';
        if (ua.indexOf('Safari') > -1) return 'Safari';
        if (ua.indexOf('Opera') > -1) return 'Opera';
        if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) return 'IE';
        return 'Unknown';
    }

    // 获取操作系统
    static getOS() {
        const ua = navigator.userAgent;
        if (ua.indexOf('Windows') > -1) return 'Windows';
        if (ua.indexOf('Mac') > -1) return 'MacOS';
        if (ua.indexOf('Linux') > -1) return 'Linux';
        if (ua.indexOf('Android') > -1) return 'Android';
        if (ua.indexOf('iOS') > -1 || /iPhone|iPad|iPod/i.test(ua)) return 'iOS';
        return 'Unknown';
    }


    // 防抖函数
    static debounce(fn, delay = 300) {
        let timer = null;
        return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        };
    }

    // 异步加载脚本
    static loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }

    // 异步加载CSS
    static loadCSS(url, callback) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = callback;
        document.head.appendChild(link);
    }

    // 复制文本到剪贴板
    static copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            return true;
        } catch (err) {
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // 获取URL参数
    static getUrlParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    // 获取文件扩展名
    static getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    // 生成UUID
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 判断是否是邮箱
    static isEmail(str) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
    }

    // 判断是否是手机号
    static isPhone(str) {
        return /^1[3-9]\d{9}$/.test(str);
    }

    // 判断是否是身份证号
    static isIDCard(str) {
        return /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(str);
    }

    // 判断是否是URL
    static isURL(str) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(str);
    }

    // 获取元素滚动位置
    static getScrollPosition(el = window) {
        return {
            x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
            y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
        };
    }

    // 平滑滚动到指定位置
    static smoothScrollTo(position, duration = 500) {
        const start = window.pageYOffset;
        const distance = position - start;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, start, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // 判断元素是否在视口中
    static isInViewport(el, partiallyVisible = false) {
        const rect = el.getBoundingClientRect();
        const {top, left, bottom, right} = rect;
        const {innerHeight, innerWidth} = window;

        return partiallyVisible
            ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) &&
            ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
            : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    }

    // 获取元素相对于视口的位置
    static getViewportPosition(el) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
    }

    // 获取元素的最终样式
    static getFinalStyle(el, prop) {
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    }

    // 判断是否是暗色模式
    static isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 获取图片的Base64编码
    static getImageBase64(url, callback) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL);
        };
        img.src = url;
    }

    // 格式化文件大小
    static formatFileSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // 获取两个数组的交集
    static intersection(arr1, arr2) {
        return arr1.filter(value => arr2.includes(value));
    }

    // 获取两个数组的并集
    static union(arr1, arr2) {
        return [...new Set([...arr1, ...arr2])];
    }

    // 获取两个数组的差集
    static difference(arr1, arr2) {
        return arr1.filter(value => !arr2.includes(value));
    }

    // 数组去重
    static unique(arr) {
        return [...new Set(arr)];
    }

    // 数组扁平化
    static flatten(arr) {
        return arr.reduce((acc, val) =>
            acc.concat(Array.isArray(val) ? this.flatten(val) : val), []);
    }

    // 数组分组
    static groupBy(arr, key) {
        return arr.reduce((acc, obj) => {
            const groupKey = obj[key];
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(obj);
            return acc;
        }, {});
    }

    // 数组排序
    static sortBy(arr, key, order = 'asc') {
        return arr.slice().sort((a, b) => {
            const valA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
            const valB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];

            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // 生成范围数组
    static range(start, end, step = 1) {
        const result = [];
        for (let i = start; i <= end; i += step) {
            result.push(i);
        }
        return result;
    }

}