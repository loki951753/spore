Function.prototype.bind2 = function(context, ...args){
    var self = this;

    var fBound = function(...bindArgs){
        const isCalledAsConstructor = this instanceof fBound;

        // 因为new绑定this的优先级高于bind
        // 因此倘若bind返回的函数被new调用，则this被指向新创建的对象
        if(isCalledAsConstructor){
            context = this;
        }

        return self.apply(context, args.concant(bindArgs));
    }
    var fNOP = function(){};
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP(); //使用寄生组合式的继承方式从被bind函数继承

    return fBound;
}