/**
 * @ignore  =====================================================================================
 * @fileoverview   折线图实例
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-11-26
 * @ignore  depend Library Raphael
 * @ignore  =====================================================================================
 */
var Core = require('../core/index');
var _ = require('../core/util');

/**
 * @description 构造函数
 * @param
 * @return result {Object}
 */
var Pie = function () {
        Core.call(this);
        // 初始化标记，默认为否
        this.initStatus = false;
    },
    Proto = Pie.prototype = Object.create(Core.prototype);
Proto.constructor = Pie;

/**
 * @description 初始化
 * @param
 * @return result {Boolean}
 */
Proto.init = function () {
    // 如果已初始化，退出
    if (this.initStatus) {
        return;
    }
    var c = this.config, //配置参数
        box = c.Box;
    // 计算圆心
    this.center = {
        x: c.origin[0] + box.width / 2,
        y: c.origin[1] - box.height / 2
    };
    // 计算半径
    this.pieR = Math.min(box.width, box.height) * c.centerRadio;
    // 保存数据
    this.datas = this.getData();
    // 计算数据之和
    this.dataSum = this.getDataSum();
    // 计算当前角度
    this.radius = 0;
    // 修改初始化标记
    this.initStatus = true;
};

/**
 * @description 筛选所有的数据项
 * @param
 * @return result {Boolean}
 */
Proto.getData = function () {
    var datas = [];
    _.each(this.config.series, function (item) {
        datas.push(item.data)
    });
    return datas;
};

/**
 * @description 求和
 * @param
 * @return result {Boolean}
 */
Proto.getDataSum = function () {
    var r = 0;
    _.each(this.config.series, function (item) {
        r += item.data * 1;
    });
    return r;
};

/**
 * @description 根据指定弧度计算坐标位置，默认起始位置为0
 * @param
 * @return result {Boolean}
 */
Proto.computePos = function (radius, outerR) {
    var cx = this.center.x,
        cy = this.center.y,
        R = this.pieR,
        rad = Math.PI / 180,
        x = cx + R * Math.cos(-radius * rad),
        y = cy + R * Math.sin(-radius * rad),
        outerX = cx + (R + outerR) * Math.cos(-radius * rad),
        outerY = cy + (R + outerR) * Math.sin(-radius * rad);
    return {
        x: x,
        y: y,
        outerX: outerX,
        outerY: outerY
    }
};

/**
 * @description 扇形计算
 * @param   value   {Number}    当前值
 * @param   total   {Number}    所有值的和
 * @param   R       {Number}    半径
 * @param   center  {Object}    圆心
 * @param   values  {Number}    所有数值
 * @return result {Boolean}
 */
Proto.sector = function (value, start, end, R) {
    var rad = Math.PI / 180,
        cx = this.center.x,
        cy = this.center.y,
        // R = this.pieR,
        x1 = cx + R * Math.cos(-start * rad),
        x2 = cx + R * Math.cos(-end * rad),
        y1 = cy + R * Math.sin(-start * rad),
        y2 = cy + R * Math.sin(-end * rad),
        total = this.dataSum,
        path;
    if (total == value) {
        path = [
            ["M", cx, cy - R],
            ["A", R, R, 0, 1, 1, cx - 0.01, cy - R],
            ["Z"]
        ];
    } else {
        path = [
            ["M", cx, cy],
            ["L", x1, y1],
            ["A", R, R, 0, +(end - start > 180), 0, x2, y2, 'z']
        ];
    }
    return {
        path: path
    };
};

/**
 * @description 图例状态切换
 * @param
 * @return result {Boolean}
 */
Proto.legendChange = function () {
    var Dom = this,
        disabled = '#999',
        fill = Dom.attr('fill'),
        srcFill = Dom.data('fill'),
        sibling,
        state;
    if (Dom.type == 'text') {
        Dom = Dom.prev;
    }
    sibling = Dom.next;
    if (state = fill == disabled) {
        Dom.attr({
            stroke: srcFill,
            fill: srcFill
        });
        sibling.attr('fill', srcFill);
    } else {
        Dom.attr({
            stroke: disabled,
            fill: disabled
        });
        sibling.attr('fill', disabled);
    }
    return state
};

/**
 * @description 计算图例
 * @param
 * @return result {Boolean}
 */
Proto.getLegend = function () {
    var c = this.config,
        series = c.series,
        legend = c.legend,
        legends = [],
        len = 0,
        i = 0,
        w = 35,
        h = 10,
        x,
        y;
    if (!c.isLegend) {
        return ''
    }
    if (legend && series.length) {
        _.each(series, function (item) {
            if (item.legend) {
                len += _.strLength(item.legend);
                i++;
            }
        });
    }
    //  计算起始字符的坐标
    x = c.width / 2 - (len * 5 + i * (w + 5)) / 2;
    y = c.padding.top + c.title.padding[1];
    _.each(series, function (item) {
        // legends.push({
        //     x: x,
        //     y: y + h / 2,
        //     w: w,
        //     type: 'line',
        //     name: item.name,
        //     style: item.style.line
        // });
        // x += w;
        // legends.push({
        //     x: x,
        //     y: y + h / 2,
        //     text: item.legend,
        //     type: 'text',
        //     name: item.name,
        //     style: {
        //         fill: item.style.line.stroke,
        //         'text-anchor': 'start'
        //     }
        // });
        // x += _.strLength(item.legend) * 5 + 5
    });
    return legends
};

/**
 * @description 创建实例的模型
 * @param
 * @return result {Array}
 */
Proto.create = function (value, start, end) {
    var arc = [value, start, end],
        R = this.pieR,
        pos, line, txtPos, lineX;
    end = start + (end - start) / 2;
    pos = Proto.computePos.call(this, end, 15);
    lineX = (end < 90 || end > 270) ? 10 : -10;
    line = ['M', pos.x, pos.y, 'L', pos.outerX, pos.outerY, 'l', lineX, 0];
    txtPos = {
        x: pos.outerX + lineX,
        y: pos.outerY
    }
    return {
        arc: arc,
        line: line,
        txtPos: txtPos
    }
}

module.exports = Pie;
