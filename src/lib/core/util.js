/**
 * @ignore  =====================================================================================
 * @fileoverview 常用的工具函数
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-00-00
 * @ignore  depend Library jQuery
 * @ignore  =====================================================================================
 */
var _ = {};
var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;
// 创建对原生API的快速引用
var push = ArrayProto.push,
    slice = ArrayProto.slice,
    concat = ArrayProto.concat,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;
// ECMAScript 5 的函数封装
var nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeReduce = ArrayProto.reduce,
    nativeReduceRight = ArrayProto.reduceRight,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeLastIndexOf = ArrayProto.lastIndexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind;
/**
 * @description 数值类型，自动创建纵坐标
 * @param series 数值类型的二维数组
 * @return r {Array}
 */
_.AxisAuto = function (series) {
        var r = [];
        if (series && series instanceof Array && series.length) {
            var d = series[0].data.length,
                max = 0,
                key, tmp;
            for (key in series) {
                max = Math.max(Math.max.apply(null, series[key].data), max);
            }
            if (d && max > 0) {
                d = tmp = Math.ceil(max / d);
                r.push(d);
                do {
                    d += tmp;
                    r.push(d);
                } while (d < max)
            }
        }
        return r
    }
    /**
     * @description 按起始点计算直线的路径
     * @param   start {Array}   eg:[50,50]
     * @param   end   {Array}   eg:[100,30]
     * @return r {String}
     */
_.line = function (start, end) {
        var r = ['M', start.join(',')];
        if (start[0] == end[0]) {
            r.push('V' + end[1]);
        } else if (start[1] == end[1]) {
            r.push('H' + end[0]);
        } else {
            r.push(['L', end.join(',')])
        }
        return r
    }
    /**
     * @description 判断给定的变量是否为Object
     * @param
     * @return result {Boolean}
     */
_.isObject = function (obj) {
    return obj === Object(obj);
};
/**
 * @description 获取对象或数组的索引
 * @param
 * @return result {Boolean}
 */
_.keys = function (obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj)
        if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
};
/**
 * @description 对象或数组的遍历
 * @param
 * @return result {Boolean}
 */
_.each = _.forEach = function (obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
            if (iterator.call(context, obj[i], i, obj) === {}) return;
        }
    } else {
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            if (iterator.call(context, obj[keys[i]], keys[i], obj) === {}) return;
        }
    }
    return obj;
};
/**
 * @description 组数过滤
 * @param
 * @return result {Boolean}
 */
_.filter = function (obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    _.each(obj, function (value, index, list) {
        if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
};
/**
 * @description 对象拷贝
 * @param
 * @return result {Boolean}
 */
_.extend = function (obj) {
    _.each(slice.call(arguments, 1), function (source) {
        if (source) {
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    });
    return obj;
};
/**
 * @description 计算字符串的长度，区分中英文
 * @param
 * @return result {Number}
 */
_.strLength = function () {
        var len = 0;
        _.each(arguments, function (item) {
            len += item.replace(/[^ -~]/g, '**').length
        });
        return len
    }
    /**
     * @description 生成随机的字符串
     * @param
     * @return result {String}
     */
_.strRandom = function () {
        return Math.random().toString(16).slice(2)
    }
    /**
     * @description 动画帧
     * @param
     * @return result {Boolean}
     */
_.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();
module.exports = _;
