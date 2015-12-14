/* [export] */
var stdPolyLine = require('../lib/polyline/stdPolyLine');
var yAxisWidth = document.querySelector('#yAxis').clientWidth;
var dataWidth = document.querySelector('#canvas').clientWidth;

var c1 = {
    id: 'canvas',
    padding:'50 30 50 0',
    series: [{
        data: [52, 70, 10, 20, 80, 120, 10, 34, 23, 11],
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
    xAxis: ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'],
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
    isxAxis: true,
    isyAxis: false,
    isGrid: true,
    isTitle: false,
    isLegend: false,
    isFocus: true,
    isZebra: true,
    isData: true
};

var c2 = {
    id: 'yAxis',
    padding:'50 0 50 30',
    series: [{
        data: [52, 70, 10, 20, 80, 120, 10, 34, 23, 11],
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
    xAxis: ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'],
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
    isxAxis: false,
    isyAxis: true,
    isGrid: false,
    isTitle: false,
    isLegend: false,
    isFocus: false,
    isZebra: false,
    isData: false
};
var m = new stdPolyLine(c1);

var y = new stdPolyLine(c2);
m.render();
y.render();
