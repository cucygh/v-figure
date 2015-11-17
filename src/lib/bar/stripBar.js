/**
 * @ignore  =====================================================================================
 * @fileoverview 标准柱状图
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-11-13
 * @ignore  depend Library Raphael
 * @ignore  =====================================================================================
 */
var R = require('../core/raphael');
var Bar = require('./index');
var stripBar = function(options) {
    var self = this,
        barSpace = {},
        create = self.create,
        _R;
    this.name = 'stripBar';
    this.setOptions(options);
    this.R = _R = R(options.id, options.width, options.height);
    /**
     * @description 更新图表
     * @param
     * @return result {Undefined}
     */
    this.update = function() {
        var state = self.legendChange.call(this);
        var name = this.data('name');
        var _ = self._,
            c = self.config,
            animation=c.animation,
            series = c.series,
            curSerie,
            data;
        self.skip(name, state);
        _.each(barSpace, function(item, key) {
            curSerie = _.filter(series, function(val) {
                return val.name == key
            })[0];
            _.each(item, function(subItem) {
                data = create.call(self, subItem.data('value'), subItem.data('subIndex'), curSerie.index);
                subItem.data(data);
                if (!curSerie.skip) {
                    subItem.animate({
                        x: data.x,
                        y: data.y - data.h,
                        height: data.h,
                        width: data.w,
                        opacity: 1
                    }, animation.inOut, animation.type);
                } else {
                    subItem.animate({
                        x: data.x,
                        y: data.y,
                        width: 0,
                        opacity: 0
                    }, animation.inOut, animation.type);
                }
            });
        });
    };
    /**
     * @description 渲染画布
     * @param
     * @return result {Undefined}
     */
    this.render = function() {
        var c = self.config,
            ani = c.animation,
            update = self.update,
            reverse=c.reverse,
            axis, tick, grid, legend, title, tmp, tmpBar, tmpBarParam, aniParam,zebra;
        var _ = self._;
        axis = self.getAxis();
        tick = self.getTick();
        grid = self.getGrid();
        zebra = self.getGridZebra();
        legend = self.getLegend();
        title = self.getTitle();
        _.requestAnimFrame.call(window, function() {
            _R.path(axis).attr(c.strokeAxis);
            _R.path(tick.tick).attr(c.strokeTick);
            _R.path(grid).attr(c.strokeGrid);
            _R.path(zebra).attr(c.strokeZebra);
            _.each(tick.text, function(item) {
                _R.text(item.x, item.y, item.text).attr(item.style);
            });
            _.each(title, function(item) {
                _R.text(item.x, item.y, item.text).attr(item.style);
            });
            _.each(legend, function(item) {
                if (item.type == 'rect') {
                    _R.rect(item.x, item.y, item.w, item.h).attr(item.style).data({
                        name: item.name,
                        fill: item.style.fill
                    }).click(function() {
                        update.call(this);
                    });
                } else {
                    _R.text(item.x, item.y, item.text).attr(item.style);
                }
            });
        });
        _.requestAnimFrame.call(window, function() {
            _.each(c.series, function(item, i) {
                tmp = barSpace[item.name] = _R.set();
                _.each(item.data, function(subselftem, ii) {
                    tmpBarParam = create.call(null, subselftem, ii, i);
                    aniParam = {
                        width: tmpBarParam.w
                    };
                    tmpBar = _R.rect(tmpBarParam.x0, tmpBarParam.y-tmpBarParam.h, 0, tmpBarParam.h);
                    tmpBar.animate(aniParam, ani.duration, ani.type).data(tmpBarParam).hover(function() {
                        this.attr('opacity', 0.6);
                    }, function() {
                        this.attr('opacity', 1);
                    });
                    tmp.push(tmpBar);
                });
                tmp.attr(item.style);
            });
        });
    }
}
stripBar.prototype = new Bar;
module.exports = stripBar;
