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
var stdPie = function (options) {
    Pie.call(this);
    this.setOptions(options);
    this.init();
    var self = this,
        config = this.config,
        lineSpace = {},
        _R;
    this.name = 'stdPie';
    this.R = _R = R(config.id, config.width, config.height);
    _R.customAttributes.arc = function (value, start, end, R) {
        return self.sector.call(self, value, start, end, R);
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
            curSerie,
            data;
        self.skip(name, state);
        _.each(lineSpace, function (item, key) {
            curSerie = _.filter(series, function (val) {
                return val.name == key
            })[0];
            var t = create.call(self, curSerie.data);
            if (curSerie.skip) {
                item.line.animate({
                    opacity: 0,
                    arc: t.startLine
                }, ani.line.speed / 2, ani.line.type);
                item.points.animate({
                    opacity: 0,
                    r: 0
                }, ani.point.speed / 2, ani.point.type);
            } else {
                item.line.animate({
                    opacity: 1,
                    arc: t.line
                }, ani.line.speed, ani.line.type, function () {
                    item.points.animate({
                        opacity: 1,
                        r: curSerie.style.point.r
                    }, ani.point.speed, ani.point.type);
                });
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
                if (item.type == 'line') {
                    // path = _.line([item.x, item.y], [item.x + item.w, item.y]).join('') + _.circle(item.x + item.w / 2, item.y, 3).join('');
                    // _R.path(path).attr(item.style).attr('fill', item.style.stroke).data({
                    //     name: item.name,
                    //     fill: item.style.stroke
                    // }).click(function () {
                    //     update.call(this);
                    // });
                } else {
                    // _R.text(item.x, item.y, item.text).attr(item.style).click(function () {
                    //     update.call(this);
                    // }).data({
                    //     name: item.name,
                    //     fill: item.style.fill
                    // });
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
                var t = self.create.call(self, data, start, end);
                tmp.text = _R.text(t.txtPos.x, t.txtPos.y, item.legend).attr({
                    opacity: 0
                });
                tmp.arc = _R.path('').attr('arc', [0, 0, 0, self.pieR]).attr(item.style).animate({
                    arc: [data, start, end, self.pieR]
                }, 500, '<>', function () {
                    tmp.text.animate({
                        opacity: 1
                    }, '200', '<>');
                });
                // tmp.line = _R.path(t.line).attr('stroke', item.style.fill);
                self.radius = end;
            });
        });
        if (!c.isData || !c.isFocus) {
            return;
        }
    }
}

stdPie.prototype = Object.create(Pie.prototype);
stdPie.prototype.constructor = stdPie;
module.exports = stdPie;
