// action
var autoQaAction = "AutoQa";
var learnQaAction = "LearnQa";

function getReqMsg(action, data) {
    return {
        msgId: generateRandomString(10),
        msgType: 'req',
        action: action,
        data: data
    }
}

function getRespMsg(msgId, action, data) {
    return {
        msgId: msgId,
        msgType: 'resp',
        action: action,
        data: data
    }
}

function generateRandomString(length) {
    const characters = '0123456789abcdef';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
}