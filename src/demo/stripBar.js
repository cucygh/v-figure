/* [export] */
var stripBar = require('../lib/bar/stripBar');
var m = new stripBar({
    id: 'canvas',
    width: 800,
    height: 300,
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
    yAxis: ['巴西', '中国', '印度', '尼泊尔', '英格兰'],
    series: [{
        data: [102, 10, 10, 345, 34],
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
        data: [20, 12, 34, 34, 43],
        style: {
            fill: '#f00',
            stroke: '#fff',
            r: 2
        },
        legend: '二维码'
    }, {
        data: [40, 62, 84, 444, 23],
        style: {
            fill: '#f45',
            stroke: '#fff',
            r: 2
        },
        legend: '健身房'
    }, {
        data: [30, 92, 4, 34, 123],
        style: {
            fill: '#d05',
            stroke: '#fff',
            r: 2
        },
        legend: '思考'
    }, {
        data: [10, 192, 14, 34, 23],
        style: {
            fill: '#a45',
            stroke: '#fff',
            r: 2
        },
        legend: '数据库'
    }],
    animation: {
        duration: 1000,
        type: 'bounce',
        inOut: 500,
        open: true
    },
    reverse: true
});
m.render();
