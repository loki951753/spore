## lazyman
这是一道非常有名的面试题，出自微信，原文如下

> 实现一个LazyMan，可以按照以下方式调用:
>
> - **LazyMan("Hank")输出**
> 
> Hi! This is Hank!
> 
> - **LazyMan("Hank").sleep(10).eat("dinner")输出**
>
> Hi! This is Hank!
>
> //等待10秒..
>
> Wake up after 10
>
> Eat dinner~
> 
> - **LazyMan("Hank").eat("dinner").eat("supper")输出**
>
> Hi This is Hank!
>
> Eat dinner~
>
> Eat supper~
> 
> - **LazyMan("Hank").sleepFirst(5).eat("supper")输出**
>
> //等待5秒
>
> Wake up after 5
>
> Hi This is Hank!
>
> Eat supper
> 
> 以此类推。
>

## 思路
事先没有看网上的其他解法，这里只写出我的第一直觉的考虑过程。（更全面的解法参照网上其他大牛的代码。）考虑如下：

- 之前在工作中做过一个nodejs的命令行工具，使用Promise将异步执行代码串联起来。因此这里第一直觉考虑的是构建异步任务队列。对象内部维护一个数组即可。
- 链式调用，在实例方法中返回this。
- sleepFirst有插队功能，内部的数组除了push普通功能，还要使用unshift插队高优先级任务。如果sleepFirst有多次，unshift插队会时逆序高优先级任务。因此暂时使用两个数组，一个普通权限，一个高优先级权限。
- 异步队列的构建过程应该在执行之前，类似于Promise/A+中then中执行函数的插入。sleep也好，eat也好，先将其任务构建并插入至任务队列中，再有各种setTimeout或者console.log。如果需要满足这种行为，则队列任务的**启动**需要异步化。最终的执行流程是：


1. 构造函数完成LazyMan实例初始化；
2. eat/sleep/sleepFirst链式调用，将任务入队；
3. 队列构造完毕，异步启动队列，队列内的异步任务交由Promise.then方法串行执行；

需要注意的是：**异步启动队列**可简单的由setTimeout(()=>{})启动，也可以插入microTask，但这两种都是将时机委托给agent的做法。如果对启动时机有要求，也需要进一步扩展这里的方法。
