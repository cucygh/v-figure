/* [export] */
var stdBar = require('../lib/bar/stdBar');
var m = new stdBar({
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
    xAxis: ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'],
    series: [{
        data: [102, 10, 10, 20, 80, 120, 10, 34, 23, 11],
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
        data: [20, 12, 34, 23, 121, 23, 45, 76, 89, 23],
        style: {
            fill: '#f00',
            stroke: '#fff',
            r: 2
        },
        legend: '二维码'
    }, {
        data: [40, 62, 84, 123, 23, 45, 23, 56, 78, 24],
        style: {
            fill: '#f45',
            stroke: '#fff',
            r: 2
        },
        legend: '健身房'
    }, {
        data: [30, 92, 4, 163, 23, 45, 67, 89, 120, 23],
        style: {
            fill: '#d05',
            stroke: '#fff',
            r: 2
        },
        legend: '思考'
    }, {
        data: [10, 192, 14, 63, 34, 98, 110, 11, 91, 35],
        style: {
            fill: '#a45',
            stroke: '#fff',
            r: 2
        },
        legend: '数据库'
    }],
    yAxis: [10, 30, 50, 60, 90, 200],
    animation: {
        duration: 1000,
        type: 'bounce',
        inOut: 500,
        open: true
    },
    legend: true
});
m.render();
