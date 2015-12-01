/**
 * @ignore  =====================================================================================
 * @fileoverview   柱状图实例
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-11-13
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
var Bar = function () {
    var self = this;
    // 类名
    this.name = 'Bar';
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
            state;
        if (state = fill == disabled) {
            I.attr('fill', I.data('fill'));
        } else {
            I.attr('fill', disabled);
        }
        return state
    };

    /**
     * @description 获取单个实例的宽度或伸缩度
     * @param
     * @return result {Boolean}
     */
    this.getChildWidth = function () {
        var gapRadio = self.gapRadio,
            c = self.config, //配置参数
            reverse = c.reverse, //坐标系是否反转
            ceilWidth = c.ceilWidth, //刻度的单元格
            base = c.seriesLength * (1 + gapRadio) + gapRadio, //基数
            width = c.ceilWidth / base; //实例的宽度
        c.childWidth = width;
        return width;
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
     * @description 创建实例的模型
     * @param
     * @return result {Array}
     */
    this.create = function (value, subIndex, index) {
        var gapRadio = self.gapRadio,
            box = self.getBox(),
            c = self.config, //配置参数
            reverse = c.reverse, //坐标系是否反转
            max = c.Max, //坐标的最大值
            ceilWidth = c.ceilWidth, //刻度的单元格
            width = c.childWidth || self.getChildWidth(), //实例的宽度
            y0 = c.y0, //实例的起始纵坐标
            x0 = c.x0, //实例的起始横坐标
            height = (value / max) * (reverse ? box.width : box.height), //实例的高度
            gap, //间隔
            x, //横坐标
            y, //纵坐标
            rect; //实例
        gap = width * gapRadio;
        x = c.origin[0] + subIndex * c.ceilWidth;
        x += index * (width + gap) + gap;
        y = c.origin[1] - height - c.strokeAxis['stroke-width'];
        if (reverse) {
            x = c.origin[0] + c.strokeAxis['stroke-width'];
            y = c.origin[1] - subIndex * c.ceilWidth;
            y -= index * (width + gap) + gap;
        }
        return {
            x: x,
            y: y,
            w: reverse ? height : width,
            h: reverse ? width : height,
            y0: y0,
            x0: x0,
            subIndex: subIndex,
            value: value
        }
    }
};
Bar.prototype = new Core;
module.exports = Bar;
