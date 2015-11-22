/**
 * @ignore  =====================================================================================
 * @fileoverview   核心库的原始对象
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-11-13
 * @ignore  depend Library Raphael
 * @ignore  =====================================================================================
 */
// 配置文件
var config = require('../config/index');
// 辅助类
var _ = require('./util');
// 构造类
var Factory = function () {
        this.config = config;
        this._ = _;
    },
    Proto = Factory.prototype;
/**
 * @description 多维数据的状态控制
 * @param name  维度名称
 * @param value  维度显示
 * @return result {Boolean}
 */
Proto.skip = function (name, value) {
    _.each(this.config.series, function (item) {
        if (item.name == name) {
            item.skip = !value;
        }
    });
    this.getSeriesLength.call(this);
    this.getChildWidth.call(this);
};
/**
 * @description 计算有效数据的长度
 * @param
 * @return result {Boolean}
 */
Proto.getSeriesLength = function () {
    var i = 0;
    _.each(this.config.series, function (item) {
        if (!item.skip) {
            item.index = i;
            i++;
        } else {
            item.index = 0;
        }
    });
    this.config.seriesLength = i;
};
/**
 * @description 数据的自动校验
 * @param
 * @return result {Undefined}
 */
Proto.check = function () {
    var c = this.config;
    var yAxis = c.yAxis,
        xAxis = c.xAxis,
        box = this.getBox();
    // 计算数据维度的有效长度
    Proto.getSeriesLength.call(this);
    // 标识数据项
    _.each(c.series, function (item) {
        item.name = item.name || _.strRandom()
    });
    // 计算坐标原点
    c.origin = [c.padding * 1, c.height - c.padding];
    // 计算实际坐标原点
    c.y0 = c.origin[1] - c.strokeAxis['stroke-width']; //实例的起始纵坐标
    c.x0 = c.origin[0] + c.strokeAxis['stroke-width']; //实例的起始横坐标
    // 坐标系是否反转
    if (c.reverse) {
        // 检测横坐标是否已配置，如果没有自动生成
        if (!xAxis.length && c.series) {
            xAxis = _.AxisAuto(c.series);
        } else {
            xAxis = xAxis || [];
        }
        // 自动计算坐标轴
        c.xAxis = xAxis;
        // 计算坐标的最大值
        c.Max = Math.max.apply(null, xAxis);
        // 计算刻度单元格
        c.ceilWidth = box.height / yAxis.length;
    } else {
        // 检测纵坐标是否已配置，如果没有自动生成
        if (!yAxis.length && c.series) {
            yAxis = _.AxisAuto(c.series);
        } else {
            yAxis = yAxis || [];
        }
        // 自动计算坐标轴
        c.yAxis = yAxis;
        // 计算坐标的最大值
        c.Max = Math.max.apply(null, yAxis);
        // 计算刻度单元格
        c.ceilWidth = box.width / xAxis.length;
    }
};
/**
 * @description 设置配置参数
 * @param
 * @return result {Undefined}
 */
Proto.setOptions = function (options) {
    _.extend(this.config, options);
    Proto.check.call(this);
};
/**
 * @description 计算画布的有效区域
 * @return result {Object}
 *           - width {Number}
 *           - height {Number}
 */
Proto.getBox = function () {
    var c = this.config;
    if (!c.Box) {
        c.Box = {
            width: c.width - c.padding * 2,
            height: c.height - c.padding * 2
        };
    }
    return c.Box
};
/**
 * @description 计算坐标轴
 * @param
 * @return result {String}
 */
Proto.getAxis = function () {
    var line = _.line,
        c = this.config,
        origin = c.origin,
        xEnd = [c.width - c.padding, origin[1]],
        yEnd = [origin[0], c.padding];
    var xPath = line(origin, xEnd),
        yPath = line(origin, yEnd),
        r = xPath.concat(yPath);
    return r.join('')
};
/**
 * @description 计算刻度
 * @param
 * @return result {Array}
 */
Proto.getTick = function () {
    var ticks = [],
        texts = [],
        c = this.config,
        xAxis = c.xAxis,
        yAxis = c.yAxis,
        xAxisLen = xAxis.length,
        yAxisLen = yAxis.length,
        box = this.getBox(),
        w = box.width / xAxisLen,
        h = box.height / yAxisLen,
        origin = [c.padding * 1, c.height - c.padding],
        line = _.line,
        reverse = c.reverse,
        xexceed = reverse ? 1 : _.exceedWidth(xAxis, 6, c.ceilWidth),
        startX,
        startY,
        endX,
        endY,
        path,
        text;
    for (var i = 0; i <= xAxisLen; i += xexceed) {
        startX = endX = origin[0] + w * i;
        startY = origin[1];
        endY = startY * 1 + 5;
        path = line([startX, startY], [endX, endY]);
        ticks.push(path);
        if (i == xAxisLen) {
            break;
        };
        texts.push({
            x: reverse ? (startX + w) : (startX + w * xexceed / 2),
            y: startY * 1 + 10,
            text: xAxis[i]
        });
    }
    for (i = 1; i <= yAxisLen; i++) {
        startY = endY = origin[1] - h * i;
        startX = origin[0];
        texts.push({
            x: startX - 5,
            y: reverse ? startY + h / 2 : startY,
            text: yAxis[i - 1],
            style: {
                'text-anchor': 'end'
            }
        });
    }
    return {
        tick: ticks.join(''),
        text: texts
    }
};
/**
 * @description 计算暗格
 * @param
 * @return result {String}
 */
Proto.getGrid = function () {
    var c = this.config,
        line = _.line,
        grid = [],
        xAxis = c.xAxis,
        yAxis = c.yAxis,
        xAxisLen = xAxis.length,
        yAxisLen = yAxis.length,
        box = this.getBox(),
        w = box.width / xAxisLen,
        h = box.height / yAxisLen,
        origin = [c.padding * 1, c.height - c.padding],
        startX,
        startY,
        endX,
        endY,
        path;
    if (!c.isGrid) {
        return ''
    }
    for (var i = 1; i <= xAxisLen; i++) {
        startX = endX = origin[0] * 1 + w * i;
        startY = origin[1];
        endY = c.padding;
        path = line([startX, startY], [endX, endY]);
        grid.push(path);
    }
    for (i = 1; i <= yAxisLen; i++) {
        startY = endY = origin[1] * 1 - h * i;
        startX = origin[0];
        endX = c.width - c.padding;
        path = line([startX, startY], [endX, endY]);
        grid.push(path);
    }
    return grid.join('')
};
/**
 * @description 暗格斑马线
 * @param
 * @return result {Boolean}
 */
Proto.getGridZebra = function () {
    var c = this.config,
        line = _.line,
        zebra = [],
        xAxis = c.xAxis,
        yAxis = c.yAxis,
        xAxisLen = xAxis.length,
        yAxisLen = yAxis.length,
        box = this.getBox(),
        w = box.width / xAxisLen,
        h = box.height / yAxisLen,
        origin = [c.padding * 1, c.height - c.padding],
        startX,
        startY,
        endX,
        endY,
        path;
    if (!c.isGrid) {
        return ''
    }
    if (c.reverse) {
        for (i = 1; i < xAxisLen; i += 2) {
            startY = origin[1] * 1 - box.height;
            startX = origin[0] + w * i;
            endX = origin[0] + w * (i + 1);
            endY = origin[1];
            path = _.rect([startX, startY], [endX, endY]);
            zebra.push(path);
        }
    } else {
        for (i = 1; i < yAxisLen; i += 2) {
            startY = origin[1] * 1 - h * i;
            startX = origin[0];
            endX = c.width - c.padding;
            endY = startY + h;
            path = _.rect([startX, startY], [endX, endY]);
            zebra.push(path);
        }
    }
    return zebra.join('')
};
/**
 * @description 计算标题
 * @param
 * @return result {Array}
 *          - x {Number}
 *          - y {Number}
 *          - text {String}
 */
Proto.getTitle = function () {
    var c = this.config,
        title = c.title,
        titles = [],
        origin = c.origin,
        titlePadding,
        padding = c.padding,
        x,
        y;
    if (title && _.isObject(title) && title.text) {
        titlePadding = title.padding;
        x = origin[0] + titlePadding[0];
        y = c.padding + titlePadding[1];
        titles.push({
            x: x,
            y: y,
            text: title.text,
            style: title.style.text
        });
        if (title.subText) {
            titles.push({
                x: x,
                y: y + title.style.text['font-size'],
                text: title.subText,
                style: title.style.subText
            });
        }
    }
    return titles
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
        h = 20,
        x,
        y;
    if (legend && series.length) {
        _.each(series, function (item) {
            if (item.legend) {
                len += _.strLength(item.legend);
                i++;
            }
        })
    }
    //  计算起始字符的坐标
    x = c.width / 2 - (len * 5 + i * (w + 5)) / 2;
    y = c.padding + c.title.padding[1];
    _.each(series, function (item) {
        legends.push({
            x: x,
            y: y,
            w: w,
            h: h,
            type: 'rect',
            name: item.name,
            style: item.style
        });
        x += w;
        legends.push({
            x: x,
            y: y + h / 2,
            text: item.legend,
            type: 'text',
            style: {
                'text-anchor': 'start'
            }
        });
        x += _.strLength(item.legend) * 5 + 5
    });
    return legends
};

/**
 * @description 鼠标聚焦效果
 * @param x  {Number}  鼠标X坐标
 * @param y  {Number}  鼠标Y坐标
 * @param type  {String}  聚焦类型
 *          - cross  {String} 交叉效果
 *          - line  {String} 直线效果
 *          - rect  {String} 矩形阴影效果
 * @return result {Boolean}
 */
Proto.getFocus = function (x, y, type) {
    var c = this.config,
        origin = c.origin,
        padding = c.padding,
        reverse = c.reverse,
        ceilWidth = c.ceilWidth,
        box = this.getBox(),
        x0 = c.x0,
        y0 = c.y0,
        point = {
            x: x,
            y: y
        },
        originPoint = {
            x: origin[0],
            y: origin[1]
        },
        start,
        end,
        r = [];
    if (_.isInBox(point, originPoint, box)) {
        switch (type) {
        case 'cross':
            start = [x0, y];
            end = [x0 + box.width, y];
            r.push(_.line(start, end));
            start = [origin[1], y0];
            end = [origin[1], y0 - box.height];
            r.push(_.line(start, end));
            break;
        case 'line':
            if (reverse) {
                y = Math.floor(y / ceilWidth);
                start = [x0, y * ceilWidth];
                end = [x0 + box.width, y * ceilWidth];
                r.push(_.line(start, end));
            } else {
                x = Math.floor(x / ceilWidth);
                start = [x * ceilWidth, y0];
                end = [x * ceilWidth, y0 - box.height];
                r.push(_.line(start, end));
            }
            break;
        case 'rect':
            if (reverse) {
                y = Math.floor(y / ceilWidth);
                start = [x0, y * ceilWidth];
                end = [x0 + box.width, y * ceilWidth];
                r.push(_.rect(start, end));
            } else {
                x = Math.floor(x / ceilWidth);
                start = [x * ceilWidth, y0-box.height];
                end = [x * ceilWidth, y0 - box.height];
                r.push(_.rect(start, end));
            }
            break;
        default:
            r = 'M'+[x0,y0].join(',');
        }
    } else {
        r = 'M'+[x0,y0].join(',');
    }
};

module.exports = Factory
