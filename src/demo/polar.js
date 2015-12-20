/* [export] */
var Polar = require('../lib/pie/polar');
var m = new Polar({
    id: 'canvas',
    width: 800,
    height: 300,
    title: {
        text: '南丁格尔玫瑰图',
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
    xAxis: ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'],
    series: [{
        data: [10, 40],
        style: {
            // 填充色
            fill: '#1ba9ba',
            // 描边
            stroke: '#fff',
            // 圆角
            r: 2
        },
        legend: '测试案例'
    }, {
        data: [40, 20],
        style: {
            fill: '#f00',
            stroke: '#fff',
            r: 2
        },
        legend: '二维码'
    }, {
        data: [7, 30],
        style: {
            fill: '#f45',
            stroke: '#fff',
            r: 2
        },
        legend: '健身房'
    }, {
        data: [30, 11],
        style: {
            fill: '#d05',
            stroke: '#fff',
            r: 2
        },
        legend: '思考'
    }, {
        data: [11, 9],
        style: {
            fill: '#a45',
            stroke: '#fff',
            r: 2
        },
        legend: '数据库'
    }],
    yAxis: [10, 30, 50, 60, 90, 200],
    // 饼图半径于画布宽/高最小值的比例
    centerRadio: 0.5,
    animation: {
        duration: 1000,
        type: 'bounce',
        inOut: 500,
        open: true
    },
    legend: {
        x: 30,
        y: 30
    },
    isxAxis: true,
    isyAxis: true,
    isGrid: true,
    isTitle: false,
    isLegend: true,
    isFocus: true,
    isZebra: true,
    isData: true
});
m.render();
