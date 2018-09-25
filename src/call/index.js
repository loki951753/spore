// 第一版
Function.prototype.call2 = function(context){
    context.fn = this; // 使用this获取到调用call的函数

    context.fn(); // 执行函数

    delete context.fn; // 抹去痕迹
}

// 第二版：考虑call传入参数
// 传入参数需要解决的一个问题是不定参数如何被传递给fn
// 有两种办法：eval，以及使用ES6的展开语法
Function.prototype.call3 = function(context){
    context.fn = this;
    var args = [];
    for(var i=1,len=arguments.length; i<len; i++){
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args + ')');

    delete context.fn;
}

// 第三版：考虑一些其他情况
// 1. call在传入null时，this会被指向window
// 2. call的执行结果需要被返回
Function.prototype.call3 = function(context){
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i=1, len=arguments.length; i<len; i++){
        args.push('arguments[' + i + ']');
    }
    var ret = eval('context.fn(' + args + ')');
    
    delete context.fn;

    return ret;
}