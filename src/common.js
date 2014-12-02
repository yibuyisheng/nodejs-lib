function executeGeneratorFn(genFn, callback) {
    var iterator = genFn();

    function execute(nextValue) {
        if (!nextValue.done) {
            nextValue.value(next);
        } else {
            callback instanceof Function && callback(null, nextValue.value);
        }
    }

    function next() {
        try {
            execute(iterator.next(arguments));
        } catch (e) {
            callback instanceof Function && callback(e);
        }
    }

    next();
}

var toString = Object.prototype.toString;

function getClassName(obj) {
    return toString.call(obj).slice(8, -1);
}

function isObject(obj) {
    return getClassName(obj) === 'Object';
}

function isFunction(obj) {
    return getClassName(obj) === 'Function';
}

function isArray(obj) {
    return getClassName(obj) === 'Array';
}

/**
 * 深复制
 */
function extend() {
    var args = arguments;
    if (!args.length) return;
    if (!args.length === 1) return args[0];

    function isValueType(obj) {
        return typeof obj !== 'object' // 不是对象类型
            || typeof obj === 'undefined' || obj === null;
    }
    if (isValueType(args[0])) return args[0];

    function merge(obj1, obj2) {
        if (isValueType(obj2)) return obj1;

        for (var k in obj2) {
            if (isValueType(obj1[k])) {
                obj1[k] = obj2[k];
            }
            // 是对象类型
            else {
                obj1[k] = {};
                merge(obj1[k], obj2[k]);
            }
        }
        return obj1;
    }

    for (var i = 1, il = args.length; i < il; i += 1) {
        args[0] = merge(args[0], args[i]);
    }

    return args[0];
}

// 时间格式化
function dateGetter(fn, dt) {
    return fn.call(dt);
}
var strMap = {
    yyyy: bind(dateGetter, Date.prototype.getFullYear),
    MM: function(dt) {
        return dateGetter(Date.prototype.getMonth, dt) + 1;
    },
    dd: bind(dateGetter, Date.prototype.getDate),
    HH: bind(dateGetter, Date.prototype.getHours),
    mm: bind(dateGetter, Date.prototype.getMinutes),
    ss: bind(dateGetter, Date.prototype.getSeconds)
};

function dateFormat(dt, formatStr) {
    return formatStr.replace(/(y{4})|([M|d|H|m|s]{2})/g, function(match) {
        return strMap[match](dt);
    });
}

/**
 * 用指定的参数替换掉字符串'hello {0} {1}'中的{0}和{1}
 *
 * @param {string} str 待替换的字符串
 * @return {string} 返回一个转换后的字符串
 */
function format(str) {
    var args = arguments;
    return str.replace(/\{[0-9]+\}/g, function(match) {
        return args[parseInt(match.slice(1, -1)) + 1];
    });
}

exports.executeGeneratorFn = executeGeneratorFn;
exports.extend = extend;
