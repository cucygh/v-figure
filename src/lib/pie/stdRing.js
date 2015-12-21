/**
 * @ignore  =====================================================================================
 * @fileoverview 标准环形图
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-12-20
 * @ignore  depend Library Raphael
 * @ignore  =====================================================================================
 */
var R = require('../core/raphael');
var _ = require('../core/util');
var Pie = require('./index');
var stdRing = function (options) {
    Pie.call(this);
    this.setOptions(options);
    this.init();
    var self = this,
        config = this.config,
        lineSpace = {},
        _R;
    this.name = 'stdRing';
    this.R = _R = R(config.id, config.width, config.height);
    _R.customAttributes.arc = function (inR, outR, start, end) {
        return self.arc.call(self, inR, outR, start, end);
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
            inner = c.innerWrapper,
            outer = c.outerWrapper,
            start,
            end,
            r,
            curSerie,
            data;
        self.skip(name, state);
        self.dataSum = self.getDataSum();
        self.radius = 0;
        _.each(lineSpace, function (item, key) {
            curSerie = _.filter(series, function (val) {
                return val.name == key
            })[0];
            if (curSerie.skip) {
                item.arc.animate({
                    opacity: 0,
                    arc: [inner.r + 15, outer.r - 15, 0, 0]
                }, ani.duration / 2, ani.type);
            } else {
                start = self.radius;
                end = 360 / self.dataSum * curSerie.data + start;
                item.arc.animate({
                    opacity: 1,
                    arc: [inner.r + 15, outer.r - 15, start, end]
                }, ani.duration, ani.type).data({
                    start: start,
                    end: end
                });
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
            inner = c.innerWrapper,
            outer = c.outerWrapper,
            legend, title, tmp, aniParam, timeID, path, r, inner, outer;
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
            c.isData && _.each(c.series, function (item, i) {
                var tmp = lineSpace[item.name] = {},
                    data = item.data,
                    start = self.radius,
                    end = 360 / self.dataSum * data + start;
                tmp.arc = _R.path('').attr('arc', [inner.r + 15, outer.r - 15, 0, 0]).attr(item.style).animate({
                    arc: [inner.r + 15, outer.r - 15, start, end]
                }, 500, '<>').hover(function () {
                    this.attr('opacity', 0.8);
                }, function () {
                    this.attr('opacity', 1);
                }).data({
                    start: start,
                    end: end
                });
                self.radius = end;
            });
            // 绘制同心圆
            if (inner && inner.show) {
                _R.path(_.circle(self.center.x, self.center.y, inner.r)).attr(inner.style).toFront();
            }
            if (outer && outer.show) {
                _R.path(_.circle(self.center.x, self.center.y, outer.r)).attr(outer.style).toBack();
            }

        });



        if (!c.isData || !c.isFocus) {
            return;
        }
    }
}

stdRing.prototype = Object.create(Pie.prototype);
stdRing.prototype.constructor = stdRing;
module.exports = stdRing;
