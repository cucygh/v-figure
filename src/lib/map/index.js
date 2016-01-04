/**
 * @ignore  ====================================================================
 * @fileoverview 地图基类
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-12-25
 * @ignore  depend Library jQuery
 * @ignore  ====================================================================
 */
var config = require('./data.js');
var _ = require('../core/util');

/**
 * @description 构造类
 * @param
 * @return result {Boolean}
 */
var Map = function () {
    this.data = config;
    this.style = {
        "fill": "#97d6f5",
        "stroke": "#eee",
        "stroke-width": 1,
        "stroke-linejoin": "round"
    };
    this.cache = {};
};
var Proto = Map.prototype;
Proto.constructor = Map;

/**
 * @description 重新定义数据
 * @param   data    {Objec}
 * @return result {Boolean}
 */
Proto.setData = function (data) {
    this.data = data;
};



/**
 * @description 事件注册方法
 * @param   el  DOM
 * @param   type  标准的事件类型
 * @param   handle  事件响应函数
 * @return result {Boolean}
 */
Proto.on = function (el, type, handle) {
    if (el) {
        if (el.addEventListener) {
            el.addEventListener(type, handle, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, handle);
        }
    } else {
        return false;
    }
};

module.exports = Map;
