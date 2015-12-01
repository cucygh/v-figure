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
var PolyLine = require('./index');
var stdPolyLine = function (options) {
    var self = this,
        lineSpace = {},
        create = self.create,
        _R;
    this.name = 'stdPolyLine';
    this.setOptions(options);
    this.R = _R = R(options.id, options.width, options.height);
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
            var t = create.call(null, curSerie.data);
            if (curSerie.skip) {
                item.line.animate({
                    opacity: 0,
                    path: t.startLine
                }, ani.line.speed / 2, ani.line.type);
                item.points.animate({
                    opacity: 0,
                    r: 0
                }, ani.point.speed / 2, ani.point.type);
            } else {
                item.line.animate({
                    opacity: 1,
                    path: t.line
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
            axis, tick, grid, legend, title, tmp, tmpBar, tmpBarParam, aniParam, zebra, hover, timeID, path, r;
        var _ = self._;
        axis = self.getAxis();
        tick = self.getTick();
        grid = self.getGrid();
        zebra = self.getGridZebra();
        legend = self.getLegend();
        title = self.getTitle();
        hover = self.getFocus(0, 0, 'rect');
        // 绘制基本信息
        _.requestAnimFrame.call(window, function () {
            _R.path(axis).attr(c.strokeAxis);
            _R.path(tick.tick).attr(c.strokeTick);
            _R.path(grid).attr(c.strokeGrid)
            _R.path(zebra).attr(c.strokeZebra);
            hover = _R.path(hover).attr(c.strokeFocus);
            _.each(tick.text, function (item) {
                _R.text(item.x, item.y, item.text).attr(item.style);
            });
            _.each(title, function (item) {
                _R.text(item.x, item.y, item.text).attr(item.style);
            });
            _.each(legend, function (item) {
                if (item.type == 'line') {
                    path = _.line([item.x, item.y], [item.x + item.w, item.y]).join('') + _.circle(item.x + item.w / 2, item.y, 3).join('');
                    _R.path(path).attr(item.style).attr('fill', item.style.stroke).data({
                        name: item.name,
                        fill: item.style.stroke
                    }).click(function () {
                        update.call(this);
                    });
                } else {
                    _R.text(item.x, item.y, item.text).attr(item.style).click(function () {
                        update.call(this);
                    }).data({
                        name: item.name,
                        fill: item.style.fill
                    });
                }
            });
        });
        // 绘制数据
        _.requestAnimFrame.call(window, function () {
            _.each(c.series, function (item, i) {
                var tmp = lineSpace[item.name] = {
                    points: _R.set()
                };
                r = item.style.point.r;
                tmp = lineSpace[item.name];
                var t = create.call(null, item.data);
                tmp.line = _R.path(t.startLine).attr({
                    opacity: 0
                });
                tmp.line.animate({
                    path: t.line,
                    opacity: 1
                }, animation.line.speed, animation.line.type, function () {
                    _.each(t.points, function (subItem) {
                        tmp.points.push(_R.circle(subItem.x - r / 2, subItem.y, 0));
                    });
                    tmp.points.animate({
                        r: r,
                        opacity: 1
                    }, animation.point.speed, animation.point.type).attr(item.style.point);
                }).attr(item.style.line);

            });
        });

        // 定义hover效果
        this.on(_R.canvas, 'mousemove', function (e) {
            timeID && clearTimeout(timeID);
            timeID = setTimeout(function () {
                var x = e.offsetX - c.root.offsetLeft;
                var y = e.offsetY - c.root.offsetTop;
                hover.attr('path', self.getFocus(x, y, 'line'));
            }, 50);
        });
    }
}
stdPolyLine.prototype = new PolyLine;
module.exports = stdPolyLine;
