/* [export] */
var china = require('../lib/map/chinaMap');
var m = new china({
    id: 'canvas',
    width: 600,
    height: 500
});
m.render();

setTimeout(function () {
    // m.hotPoint();
    // m.orderPath(5);
}, 100);
