/* [export] */
var stdPolyLine = require('../lib/polyline/stdPolyLine');
var m = new stdPolyLine({
    id: 'canvas',
    width: 800,
    height: 300,
    title: {
        text: '折线图基本案例',
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
        data: [52, -71, 10, 20, 80, 120, 10, 34, 23, 11],
        style: {
            line: {
                // 描边
                stroke: '#1ba9ba',
                'stroke-dasharray': '.',
                'stroke-width':2,
                // 圆角
                r: 5
            },
            point: {
                stroke: '#1ba9ba',
                r: 2,
                fill: '#1ba9ba'
            }
        },
        legend: '测试案例'
    }, {
        data: [42, 90, 20, 10, 70, 20, 100, 64, 43, 11],
        style: {
            line: {
                // 描边
                stroke: '#f00',
                // 圆角
                r: 4
            },
            point: {
                stroke: '#f00',
                r: 0,
                fill: '#f00'
            }
        },
        legend: '测试案例'
    }],
    animation: {
        line: {
            speed: 500,
            type: '<>'
        },
        point: {
            speed: 200,
            type: '<>'
        }
    },
    // 坐标系的样式
    strokeAxis: {
        stroke: '#eee',
        'stroke-linejoin': 'round',
        'stroke-width': 1.5
    },
    // 坐标系的刻度样式
    strokeTick: {
        stroke: '#fff',
        'stroke-linejoin': 'round',
        'stroke-width': 1
    },
    strokeFocus: {
        stroke: '#1ba9ba',
        'stroke-linejoin': 'round',
        'stroke-width': 1.5
    },
    legend: true
});
m.render();
