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
_.AxisAuto = function (series, tickLength) {
    var r = [];
    if (series && series instanceof Array && series.length) {
        var d = tickLength || 5,
            max = 0,
            min = 0,
            key, tmp;
        for (key in series) {
            max = Math.max(Math.max.apply(null, series[key].data), max);
            min = Math.min(Math.min.apply(null, series[key].data), min);
        }
        min = min < 0 ? Math.floor(min / 10) * 10 : Math.ceil(min / 10) * 10;

        tmp = Math.ceil((max - min) / (d - 1) / 10) * 10;
        for (var i = 0; i < d; i++) {
            r.push(min);
            min += tmp;
        }
    }
    return r
};
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
};
/**
 * @description 利用Path制作Rect
 * @param   start {Array}   eg:[50,50]
 * @param   end   {Array}   eg:[100,30]
 * @return result {Boolean}
 */
_.rect = function (start, end) {
    var r = ['M', start.join(',')];
    if (start[0] == end[0] || start[1] == end[1]) {
        return _.line(start, end)
    } else {
        r.push('H' + end[0]);
        r.push('V' + end[1]);
        r.push('H' + start[0]);
        r.push('C');
        return r
    }
};

/**
 * @description 利用Path制作Circle
 * @param
 * @return result {Boolean}
 */
_.circle = function (x, y, r) {
    var rt = ['M' + (x - r) + ',' + y],
        left = [x - r, y],
        right = [x + r, y];
    rt.push(['A' + r + ',' + r, 0, 1, 0, right.join(' ')].join(','));
    rt.push('M' + (x + r) + ',' + y);
    rt.push(['A' + r + ',' + r, 0, 1, 0, left.join(' ')].join(','));

    return rt;
};

/**
 * @description 环状
 * @param
 * @return result {Boolean}
 */
_.arcRing = function (inR, outR, radis, center) {
    var rad = Math.PI / 180,
        cx = center.x,
        cy = center.y,
        radis1 = -radis,
        radis2 = radis-180,
        x1 = cx + inR * Math.cos(radis1 * rad),
        x2 = cx + outR * Math.cos(radis1 * rad),
        x1End = cx + inR * Math.cos(radis2 * rad),
        x2End = cx + outR * Math.cos(radis2 * rad),
        y1 = cy + inR * Math.sin(radis1 * rad),
        y1End = cy + inR * Math.sin(radis2 * rad),
        y2 = cy + outR * Math.sin(radis1 * rad),
        y2End = cy + outR * Math.sin(radis2 * rad),
        path;
    path = [
        ["M", x2, y2],
        ["A", outR, outR, 0, 0, 1, x2End, y2End],
        ["L", x1End, y1End],
        ["A", inR, inR, 0, 0, 0, x1, y1, 'z'],
    ];
    return path;
};

/**
 * @description 三次贝塞尔曲线控制点计算
 * @param
 * @return result {Boolean}
 */
_.bezierCtrlPoint = function (points, a, b) {
    if (!a || !b) {
        a = 0.25;
        b = 0.25;
    }
    var r = [],
        len = points.length,
        aX, aY, bX, bY, last;
    _.each(points, function (item, index) {
        if (index == len - 1) {
            return true
        }
        if (index < 1) {
            var aX = item.x + (points[1].x - points[0].x) * a;
            var aY = item.y + (points[1].y - points[0].y) * a;
        } else {
            var aX = item.x + (points[index + 1].x - points[index - 1].x) * a;
            var aY = item.y + (points[index + 1].y - points[index - 1].y) * a;
        };
        if (index > len - 3) {
            last = len - 1;
            var bX = points[last].x - (points[last].x - points[last - 1].x) * b;
            var bY = points[last].y - (points[last].y - points[last - 1].y) * b;
        } else {
            var bX = points[index + 1].x - (points[index + 2].x - item.x) * b;
            var bY = points[index + 1].y - (points[index + 2].y - item.y) * b;
        };
        r.push([{
            x: aX,
            y: aY
        }, {
            x: bX,
            y: bY
        }]);
    });
    return r;
};

/**
 * @description 三次贝塞尔曲线
 * @param
 * @return result {Boolean}
 */
_.bezier = function (points, a, b) {
    var ctrls = _.bezierCtrlPoint(points, a, b),
        r = ['M' + points[0].x + ' ' + points[0].y],
        len = points.length,
        ctrl,
        i;
    for (i = 1; i < len; i++) {
        ctrl = ctrls[i - 1];
        r.push('C' + ctrl[0].x + ' ' + ctrl[0].y + ',' + ctrl[1].x + ' ' + ctrl[1].y + ',' + points[i].x + ' ' + points[i].y);
    }
    return r.join('');
};

/**
 * @description 弧度圆环
 * @param
 * @return result {Boolean}
 */
_.radian = function (value, total, mR, R, center) {
    var alpha = 360 / total * value,
        a = (90 - alpha) * Math.PI / 180,
        x = center.x + R * Math.cos(a),
        y = center.y - R * Math.sin(a),
        path;
    if (total == value) {
        path = [
            ["M", center.x, center.y - R],
            ["A", R, R, 0, 1, 1, center.x - 0.01, center.y - R]
        ];
    } else {
        path = [
            ["M", center.x, center.y - R],
            ["A", R, R, 0, +(alpha > 180), 1, x, y]
        ];
    }
    return {
        path: path
    };
};

/**
 * @description 求和
 * @param
 * @return result {Boolean}
 */
_.sum = function (values) {
    var r = 0;
    _.each(values, function (item) {
        r += item * 1;
    });
    return r;
};

/**
 * @description 判断给定的变量是否为对象
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
 * @description 对象类型
 * @param
 * @return result {Boolean}
 */
_.type = function (o) {
    var s = Object.prototype.toString.call(o);
    return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

/**
 * @description 计算字符串的长度，区分中英文
 * @param
 * @return result {Number}
 */
_.strLength = function () {
    var len = 0;
    _.each(arguments, function (item) {
        len += (item + '').replace(/[^ -~]/g, '**').length
    });
    return len
};
/**
 * @description 生成随机的字符串
 * @param
 * @return result {String}
 */
_.strRandom = function () {
    return Math.random().toString(16).slice(2)
};

/**
 * @description 计算补白
 * @param
 * @return result {Boolean}
 */
_.paddingCompute = function (padding) {
    var top, right, bottom, left;
    padding = '' + padding;
    padding = padding.trim().split(' ');
    if (padding[0]) {
        top = right = bottom = left = padding[0] * 1;
    }
    if (padding[1]) {
        right = left = padding[1] * 1;
    }
    if (padding[2]) {
        bottom = padding[2] * 1;
    }
    if (padding[3]) {
        left = padding[3] * 1;
    }
    return {
        top: top,
        right: right,
        bottom: bottom,
        left: left
    }
};
/**
 * @description 计算超过某个值的数量
 * @param arr   {Array} 要计算的范围
 * @param factor   {Number} 因子系数
 * @param maxWidth   {Number} 阀值
 * @return result {Boolean}
 */
_.exceedWidth = function (arr, factor, maxWidth) {
    var i = 0;
    _.each(arr, function (item) {
        i = Math.max(i, _.strLength(item) * factor / maxWidth);
    });
    return Math.ceil(i)
};

/**
 * @description 判断一个点是否在指定区域内
 * @param   point {objext}  要检测的点
 *              x {Number}
 *              y {Number}
 * @param   origin {objext}  原点坐标
 *              x {Number}
 *              y {Number}
 * @param   box {objext}  边距
 *              width {Number}
 *              height {Number}
 * @return result {Boolean}
 */
_.isInBox = function (point, origin, box) {
    var xMin = origin.x,
        xMax = xMin + box.width,
        yMax = origin.y,
        yMin = yMax - box.height,
        x = point.x,
        y = point.y,
        r = false;
    if (x > xMin && x < xMax && y > yMin && y < yMax) {
        r = true;
    }
    return r;
};


/**
 * @description 创建tips
 * @param pos   {Object}    tips位置
 * @param text  {String}    文本
 * @param maxLenth  {Number}    单行最大长度
 * @param size  {Number}    文本的大小
 * @param arrow  {Number}    箭头的大小
 * @return result {Boolean}
 */
_.makeTips = function (pos, text, maxLenth, size, arrow) {
    var lineLength = Math.min(_.strLength(text), maxLenth),
        x = pos.x,
        y = pos.y,
        reg = new RegExp('.{' + lineLength + '}', 'g'),
        txts = (text + '').match(reg),
        width = size * lineLength * 0.5,
        height = size * txts.length,
        arrowWidth = arrow / 2,
        path;
    path = ['M', x - width / 2, y - height / 2, 'h', width, 'v', height, 'h', -width / 2 + arrowWidth, 'l', -arrowWidth, arrowWidth, 'l', -arrowWidth, -arrowWidth, 'h', -width / 2 + arrowWidth, 'v', -height, 'z'];
    return path
};



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
