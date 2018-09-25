(function(){
    const TASK = {
        SLEEP: Symbol(),
        OUTPUT: Symbol()
    }
    
    // 抽象出handleTask方法
    function handleTask(task, callback){
        switch (task.taskName) {
            case TASK.SLEEP:
                setTimeout(()=>{
                    console.log(`Wake up after ${task.data}`);
                    callback()
                }, task.data*1000);
                break;
            case TASK.OUTPUT:
                output(task.data);
                callback();
                break;
            default:
                break;
        }
    }
    
    // 抽象出output方法，这里往往需要被扩展。如输出头，或者环境判断
    function output(){
        console.log.apply(console, Array.prototype.slice.call(arguments));
    }
    
    // 抽象LazyManFactory，这里往往需要被扩展，如做成单例，更多的构造条件等等
    function LazyManFactory(name){
        lazyMan = new LazyMan(name);
        return lazyMan;
    }

    function LazyMan(name){
        this.normalTask = []; // 普通队列
        this.highPriorityTask = []; // 高优先级队列
    
        this.normalTask.push({
            taskName: TASK.OUTPUT,
            data: `Hi! This is ${name}`
        })

        this.asyncRun(); // 启动队列，但由于是异步启动，待启动之时，同步插入的任务已完成。
    }

    LazyMan.prototype.asyncRun = function(){
        let p = Promise.resolve();
        setTimeout(()=>{
            let task = this.highPriorityTask.concat(this.normalTask); // 高优先级任务在普通任务之前
            task.reduce((p, t)=>p.then(()=>new Promise(resolve=>handleTask(t, resolve))), p); 
        });
    }
    
    LazyMan.prototype.sleep = function(sec){
        // 任务的动作和数据分离，更易扩展；不同任务的数据同构程度高，降低理解和扩展成本
        // push操作往往会需要进一步操作，做数据检查等
        this.normalTask.push({
            taskName: TASK.SLEEP,
            data: sec
        });
    
        return this;
    }
    
    LazyMan.prototype.sleepFirst = function(sec){
        this.highPriorityTask.push({
            taskName: TASK.SLEEP,
            data: sec
        });
        return this;
    }
    
    LazyMan.prototype.eat = function(food){
        this.normalTask.push({
            taskName: TASK.OUTPUT,
            data: `Eat ${food}`
        });
    
        return this;
    }

    window.LazyMan = LazyManFactory;
})()