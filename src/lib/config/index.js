/**
 * @ignore  =====================================================================================
 * @fileoverview 画布的配置
 * @see wiki
 * @author  guohui.yin@qunar.com
 * @version 1.0.0
 * @ignore  created in 2015-00-00
 * @ignore  depend Library Raphael
 * @ignore  =====================================================================================
 */

var options = {
    // 画布ID
    id: 'canvas',
    // 画布标题
    title: {
        text: '柱状图基本案例',
        subText: '测试用例',
        padding: [-30, -35],
        style: {
            text: {
                'font-size': 16,
                fill: '#ab0',
                'text-anchor': 'start'
            },
            subText: {
                fill: '#999',
                'text-anchor': 'start'
            }
        }
    },
    // 画布图例
    legend: {
        open: true
    },
    // 文本的默认颜色
    color: '#666',
    // 线条的默认颜色
    bdColor: '#1ba9ba',
    strokeZebra: {
        fill: '#eee',
        stroke: 'none',
        opacity: 0.3
    },
    // 坐标系的样式
    strokeAxis: {
        stroke: '#1ba9ba',
        'stroke-linejoin': 'round',
        'stroke-width': 1.5
    },
    // 坐标系的刻度样式
    strokeTick: {
        stroke: '#666',
        'stroke-linejoin': 'round',
        'stroke-width': 1
    },
    // 表格样式
    strokeGrid: {
        stroke: '#eee',
        'stroke-linejoin': 'round',
        'stroke-width': 1
    },
    // 聚焦样式
    strokeFocus: {
        stroke: '#eee',
        'stroke-linejoin': 'round',
        'stroke-width': 1,
        fill: '#eee',
        opacity: 0.6
    },
    // tips样式
    strokeTips: {
        stroke: '#666', //描边
        fill: '#666', //背景色
        type: 'top center', //对齐方式
        offset: '0 -15', //偏移量
        arrowSize: '5', //箭头大小
        baseSize: '14', //文字大小
        lineLength: 5 //单行最大长度，超过长度自动换行
    },
    // 画布的内边距，上-右-下-左
    padding: '50 50 50 50',
    // 画布的宽度
    width: 800,
    // 画布的高度
    height: 400,
    // 是否显示坐标系的表格
    isGrid: true,
    // 横坐标
    xAxis: [],
    // 纵坐标
    yAxis: [],
    // 动画设置
    animation: {
        duration: 1000,
        type: 'bounce',
        inOut: 500,
        open: true
    },
    // 图表类型
    type: 'Number',
    // 坐标系是否反转
    reverse: false,
    // 横坐标是否展示
    isxAxis: true,
    // 纵坐标是否展示
    isyAxis: true,
    // 栅格是否显示
    isGrid: true,
    // 标题是否显示
    isTitle: true,
    // 图例是否显示
    isLegend: true,
    // 聚焦效果是否开启
    isFocus: true,
    // 斑马纹路是否显示
    isZebra: true,
    // 数据是否绘制
    isData: true,
    // 是否显示tips
    isTips: true
};

module.exports = options;
