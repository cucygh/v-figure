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
var PolyLine = function () {
    var self = this;
    // 类名
    this.name = 'PolyLine';
    // 柱状图类型
    this.type = 'Number';
    // 实例于间隔的比例
    this.gapRadio = 0.3;
    /**
     * @description 图例状态切换
     * @param
     * @return result {Boolean}
     */
    this.legendChange = function () {
        var I = this,
            disabled = '#999',
            fill = I.attr('fill'),
            srcFill = I.data('fill'),
            sibling,
            state;
        if (I.type == 'text') {
            I = I.prev;
        }
        sibling = I.next;
        if (state = fill == disabled) {
            I.attr({
                stroke: srcFill,
                fill: srcFill
            });
            sibling.attr('fill', srcFill);
        } else {
            I.attr({
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
    this.getLegend = function () {
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
        y = c.padding + c.title.padding[1];
        _.each(series, function (item) {
            legends.push({
                x: x,
                y: y + h / 2,
                w: w,
                type: 'line',
                name: item.name,
                style: item.style.line
            });
            x += w;
            legends.push({
                x: x,
                y: y + h / 2,
                text: item.legend,
                type: 'text',
                name: item.name,
                style: {
                    fill: item.style.line.stroke,
                    'text-anchor': 'start'
                }
            });
            x += _.strLength(item.legend) * 5 + 5
        });
        return legends
    };
    /**
     * @description 创建实例的模型
     * @param
     * @return result {Array}
     */
    this.create = function (values) {
        var gapRadio = self.gapRadio,
            box = self.getBox(),
            c = self.config, //配置参数
            max = c.Max, //坐标的最大值
            ceilWidth = c.ceilWidth, //刻度的单元格
            y0 = c.y0, //实例的起始纵坐标
            x0 = c.x0, //实例的起始横坐标
            line = [],
            startLine = [],
            points = [],
            gap, //间隔
            x, //横坐标
            y, //纵坐标
            y00,
            prePoint,
            rect; //实例
        _.each(values, function (item, index) {
            height = (item / max) * box.height; //实例的高度
            y = y0 - height;
            x = x0 + index * ceilWidth;
            if (index == 0) {
                prePoint = {
                    x: x0,
                    y: y
                };
                startLine.push('M' + x0 + ',' + y);
                y00 = y;
                line.push('M' + x + ',' + y);
            } else {
                startLine.push('L' + x + ',' + y00);
                prePoint = {
                    x: x,
                    y: y
                };
            };
            points.push({
                x: x,
                y: y
            });
        });

        line = _.bezier(points, 0.15, 0.15);
        return {
            startLine: startLine.join(''),
            line: line,
            points: points
        }
    }
};
PolyLine.prototype = new Core;
module.exports = PolyLine;
