/**
 * @ignore  ====================================================================
 * @fileoverview 中国地图类
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-12-25
 * @ignore  depend Map
 * @ignore  ====================================================================
 */
var Map = require('./index');
var Raphael = require('../core/raphael');
var _ = require('../core/util');
var pointCache = {};
var chinaMap = function (options) {
    Map.call(this);
    this.R = _R = Raphael(options.id, options.width, options.height);
};
var Proto = chinaMap.prototype = Object.create(Map.prototype);

/**
 * @description 聚焦点
 * @param
 * @return result {Boolean}
 */
var Point = function (pos, r, animation, R) {
    return R.circle(pos.x, pos.y, r).attr({
        fill: '#97d6f5',
        stroke: '#97d6f5'
    }).animate(animation)
};


/**
 * @description 两点之间的轨迹
 * @param
 * @return result {Boolean}
 */
var pointLine = function (x1, y1, x2, y2, R) {
    var x = (x1 + x2) / 2;
    var y = (y1 + y2) / 2;
    var k = (y2 - y1) / (x2 - x1);
    return R.path(['M', x1, y1, 'S', 10, 10, x2, y2])
};

/**
 * @description 绘图
 * @param
 * @return result {Boolean}
 */
Proto.render = function () {
    var R = this.R;
    var Data = this.data;
    var Cache = this.cache;
    var style = this.style;
    var offset, box, x, y;
    if (R) {
        _.each(Data, function (item, key) {
            Cache[key] = R.path(item.path).attr(style);
            box = Cache[key].getBBox();
            x = box.x + box.width / 2;
            y = box.y + box.height / 2;
            offset = item.offset;
            if (offset) {
                x += offset[0] || 0;
                y += offset[1] || 0;
            }
            item.center = {
                x: x,
                y: y
            };
            // R.text(x, y, item.name);
        });
    }
};


/**
 * @description 模拟
 * @param
 * @return result {Boolean}
 */
Proto.hotPoint = function () {
    var R = this.R;
    var animation = Raphael.animation({
        r: 2.5,
        opcity: 0,
        'stroke-opacity': 0,
        fill: '#f00'
    }, 800, '<>').repeat('Infinity');
    _.each(this.data, function (item) {
        setTimeout(function () {
            Point({
                x: item.center.x,
                y: item.center.y
            }, 0.5, animation, R).attr({
                fill: '#f00',
                stroke: '#97d6f5'
            });
        }, Math.random() * 10000);
    });
};



/**
 * @description 模拟订单轨迹
 * @param
 * @return result {Boolean}
 */
Proto.orderPath = function (num) {
    var Data = this.data;
    var R = this.R;
    var keys = _.keys(Data),
        keysLen = keys.length;
    var random, random2;
    var r = [];
    for (var i = 0; i < num; i++) {
        random = Math.ceil(Math.random() * keysLen);
        random2 = Math.ceil(random / 2);
        random = Data[keys[random]].center;
        random2 = Data[keys[random2]].center;
        if (random != random2) {
            pointLine(random.x, random.y, random2.x, random2.y, R);
        }
    }
};



module.exports = chinaMap;
