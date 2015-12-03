var F = function () {
    this.c = {
        name: 'F'
    };
}

var B = function () {

};
B.prototype=new F;

var A=function(c){
    this.c=c;
}
A.prototype=new B;

a=new A({name:'A'});
b=new A({name:'B'})
