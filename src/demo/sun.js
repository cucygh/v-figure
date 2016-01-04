/* [export] */

// 底层库
var Raphael = require('../lib/core/raphael');
// 太阳直径
var sunR = 100;
// 地球直径
var earthR = 60;
// 画布宽度
var width = 800;
// 画布高度
var height = 600;
// 画布
R = Raphael('canvas', width, height);
// 地球公转半径
var earthOutR = 300;
// 太阳中心坐标
var sunCenter = {
    x: width / 2,
    y: height / 2
};

/**
 * @description 地球公转轨迹
 * @param rotate  {Number}  角度
 * @return result {Boolean}
 */
R.customAttributes.earth = function (rotate) {
    // var rad = Math.PI / 180,
    //     x = sunCenter.x + earthOutR * Math.cos(rotate * rad)-earthR/2,
    //     y = sunCenter.y + earthOutR * Math.sin(rotate * rad)-earthR/2;
    // return {
    //     x: x,
    //     y: y
    // }
    var rad = Math.PI / 180,
        x = sunCenter.x + earthOutR * Math.cos(rotate * rad) - earthR / 2,
        y = sunCenter.y + earthOutR * 0.6 * Math.sin(rotate * rad) - earthR / 2;
    return {
        x: x,
        y: y
    }
};

/**
 * @description 地球公转轨迹定义
 * @param
 * @return result {Boolean}
 */
var earthTrack = Raphael.animation({
    earth: 360,
    transform: 'r720'
}, 8000, 'linear').repeat('Infinity');
/**
 * @description 地球公转轨迹定义
 * @param
 * @return result {Boolean}
 */
var earthTrack2 = Raphael.animation({
    earth: 420,
    transform: 'r360'
}, 5000, 'linear').repeat('Infinity');

// 太阳
var sunImg = 'http://images2015.cnblogs.com/blog/818663/201510/818663-20151013205656257-1729257972.png';
// 地球
var earthImg = 'http://images2015.cnblogs.com/blog/818663/201510/818663-20151013205943538-1279197333.png';

var sun = R.image(sunImg, sunCenter.x - sunR / 2, sunCenter.y - sunR / 2, sunR, sunR);
var earth = R.image(earthImg, sunCenter.x - earthOutR, sunCenter.y, earthR, earthR);
// var earth2 = R.image(earthImg, sunCenter.x - earthOutR, sunCenter.y, earthR, earthR);

// 开始公转
earth.attr('earth', 0).animate(earthTrack);
// earth2.attr('earth', 60).animate(earthTrack2);

console.log(sunCenter);
