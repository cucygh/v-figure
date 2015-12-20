/**
 * @ignore  =====================================================================================
 * @fileoverview 标准折线图
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-11-27
 * @ignore  depend Library Raphael
 * @ignore  =====================================================================================
 */
var R = require('../core/raphael');
var _ = require('../core/util');
var Pie = require('./index');
var Polar = function (options) {
    Pie.call(this);
    this.setOptions(options);
    this.init();
    var self = this,
        config = this.config,
        lineSpace = {},
        _R;
    this.name = 'Polar';
    this.R = _R = R(config.id, config.width, config.height);
    this.rMax = 0;
    this.dataSum = '';
    this.getDataSum = function () {
        var r = 0;
        _.each(this.config.series, function (item) {
            if (!item.skip) {
                r += item.data[0] * 1;
            }
        });
        return r;
    };
    this.getRMax = function () {
        var max = 0;
        _.each(config.series, function (item) {
            if (!item.skip) {
                max = Math.max(item.data[1], max);
            }
        });
        this.rMax = max;
        return max
    };
    _R.customAttributes.arc = function (start, end, R) {
        return self.sector.call(self, start, end, R);
    };
    /**
     * @description 更新图表
     * @param
     * @return result {Undefined}
     */
    this.update = function () {
        var state = self.legendChange.call(this);
        var name = this.data('name');
        var _ = self._,
            c = self.config,
            ani = c.animation,
            series = c.series,
            start,
            end,
            r,
            curSerie,
            data;
        self.skip(name, state);
        self.dataSum = self.getDataSum();
        self.getRMax();
        self.radius = 0;
        _.each(lineSpace, function (item, key) {
            curSerie = _.filter(series, function (val) {
                return val.name == key
            })[0];
            if (curSerie.skip) {
                item.arc.animate({
                    opacity: 0,
                    arc: [0, 0, 0]
                }, ani.duration / 2, ani.type);
                item.text.animate({
                    opacity: 0
                }, ani.duration / 2, ani.type);
            } else {
                start = self.radius;
                end = 360 / self.dataSum * curSerie.data[0] + start;
                r = curSerie.data[1] / self.rMax * self.pieR;
                var txtPos = self.create.call(self, curSerie.data[0], start, end).txtPos;
                item.arc.animate({
                    opacity: 1,
                    arc: [start, end, r]
                }, ani.duration, ani.type).data({
                    start: start,
                    end: end,
                    r:r
                });
                item.text.animate({
                    opacity: 1,
                    x: txtPos.x,
                    y: txtPos.y
                }, ani.animation, ani.type);
                self.radius = end;
            }
        });
    };
    /**
     * @description 渲染画布
     * @param
     * @return result {Undefined}
     */
    this.render = function () {
        var c = self.config,
            ani = c.animation,
            update = self.update,
            origin = c.origin,
            animation = c.animation,
            legend, title, tmp, aniParam, timeID, path, r;
        var _ = self._;
        legend = self.getLegend();
        title = self.getTitle();
        // 绘制基本信息
        _.requestAnimFrame.call(window, function () {
            title && _.each(title, function (item) {
                _R.text(item.x, item.y, item.text).attr(item.style);
            });
            legend && _.each(legend, function (item) {
                if (item.type == 'path') {
                    _R.path(item.path).attr(item.style).attr('fill', item.style.fill).data({
                        name: item.name,
                        fill: item.style.fill
                    }).click(function () {
                        update.call(this);
                    });
                } else {
                    _R.text(item.x, item.y, item.text).attr(item.style).attr('fill', item.style.fill).click(function () {
                        update.call(this);
                    }).data({
                        name: item.name,
                        fill: item.style.fill
                    });
                }
            });
        });
        // // 绘制数据
        _.requestAnimFrame.call(window, function () {
            self.getRMax();
            self.dataSum = self.getDataSum();
            c.isData && _.each(c.series, function (item, i) {
                var tmp = lineSpace[item.name] = {},
                    data = item.data[0],
                    r = item.data[1] / self.rMax * self.pieR,
                    start = self.radius,
                    end = 360 / self.dataSum * data + start;
                var t = self.create.call(self, data, start, end);
                tmp.text = _R.text(t.txtPos.x, t.txtPos.y, item.legend).attr({
                    opacity: 0
                });
                tmp.arc = _R.path('').attr('arc', [0, 0, 0, r]).attr(item.style).animate({
                    arc: [start, end, r]
                }, 500, '<>', function () {
                    tmp.text.animate({
                        opacity: 1
                    }, '200', '<>');
                }).hover(function () {
                    var data = this.data();
                    this.attr('arc', [data.start, data.end, data.r + 3]);
                    this.attr('opacity', 0.8);
                }, function () {
                    var data = this.data();
                    this.attr('arc', [data.start, data.end, data.r]);
                    this.attr('opacity', 1);
                }).data({
                    start: start,
                    end: end,
                    r: r
                });
                self.radius = end;
            });
        });
        if (!c.isData || !c.isFocus) {
            return;
        }
    }
}

Polar.prototype = Object.create(Pie.prototype);
Polar.prototype.constructor = Polar;
module.exports = Polar;
