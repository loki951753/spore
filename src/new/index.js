function objectFactory(){
    var args = Array.prototype.slice.call(arguments);
    var Constructor = args.shift(); // 获取构造函数及初始化参数

    var obj = Object.create(Constructor.prototype); // 创建一个__protp__指向Constructor.prototype的对象

    Constructor.apply(obj, args); // 执行构造函数并将其this绑定为obj

    return typeof ret === 'object' ? ret : obj;
}