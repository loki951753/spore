// @NOTE: 下列代码只完成README中的模拟要点，如需更全面的模拟实现，请查找其他模拟实现。

const PENDING = Symbol();
const RESOLVED = Symbol();
const REJECTED = Symbol();

function macroAsync(fn){
    setTimeout(fn);
}

function microAsync(fn){
    let observer = new MutationObserver(()=>{
        fn();
    });

    let textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
        characterData: true
    });

    let counter = 1;

    let trigger = ()=>{
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    };

    trigger();
}

function MyPromise(fn){
    let _this = this;
    _this.state = PENDING; // 初始化状态为pending
    _this.value = undefined;

    // 保存then中的回调，只有当promise状态为pending时才会缓存，并且每个实例至多缓存一个
    _this.resolvedCallbacks = [];
    _this.rejectedCallbacks = [];

    _this.resolve = function(value){
        // 异步化
        macroAsync(()=>{
            if(_this.state === PENDING){
                _this.state = RESOLVED;
                _this.value = value;
                _this.resolvedCallbacks.forEach(cb=>cb());
            }
        })
    };

    _this.reject = function(reason){
        macroAsync(()=>{
            if(_this.state === PENDING){
                _this.state = REJECTED;
                _this.value = reason;
                _this.rejectedCallbacks.forEach(cb=>cb());
            }
        })
    };

    fn(_this.resolve, _this.reject); // 表明Promise构造函数中的语句是同步执行
}

MyPromise.prototype.then = function(onFulfilled, onRejected){
    // 规范细节实现，如默认值参数等
    let _this = this;
    let newPromise;

    if(_this.state === RESOLVED){
        newPromise = new MyPromise(function(resolve, reject){
            onFulfilled(_this.value);
        });
    }

    if(_this.state === REJECTED){
        newPromise = new MyPromise(function(){
            onRejected(_this.reason)
        });
    }

    if(_this.state === PENDING){
        newPromise = new MyPromise(function(){
            _this.resolvedCallbacks.push(()=>onFulfilled(_this.value));
            _this.rejectedCallbacks.push(()=>onRejected(_this.reason));
        });
    }

    return newPromise;
};

MyPromise.all = function(promises){
// 当所有promise都执行成功，进入成功态；
// 当任一promise执行成功，进入失败态

    return new MyPromise(function(resolve, reject){
        let arr = []; // 存放每个promise的结果值
        let count = 0;  // 记录promise成功数量

        promises.forEach(p=>{
            p.then((onFulfilled)=>{
                arr[index] = onFulfilled;
                if(++count ===promises.length){
                    resolve(arr);
                }
            }, reject);
        });
    });
};

MyPromise.race = function(promises){
// 当任一promise执行成功，进入成功态；
// 当任一promise执行失败，其他promise继续执行
// 注意，race并不会中断未胜出的异步任务的执行
    return new MyPromise(function(resolve, reject){
        promises.forEach(function(p){
            p.then(resolve, reject);
        });
    })
};

let promise = new Promise(function(resolve, reject){
    console.log('promise start')
    setTimeout(function(){
        resolve(1);
    }, 1000)
});

promise.then(function(data){
    console.log('then1');
    console.log('data', data)
}, function(err){
    console.log('err1', err);
});

promise.then(function(data){
    console.log('then2');
    console.log('data', data)
}, function(err){
    console.log('err2', err);    
});