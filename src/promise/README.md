# Promise/A+模拟实现
Promise模拟实现有3个关键点：
1. 如何异步化代码。在浏览器自带的Promise对象中，.then()方法中的代码将被异步化，放置到microtask中执行，而浏览器提供的microtask的异步化接口只有DOM mutations和Promises。因此，如果我们希望能模拟Promise，要么如社区常见的，使用setTimout，即将then方法中的代码放置到macrotask中；要么使用DOM mutations。

此外，通过该需求可以理解到，如果我们想异步化代码，必须通过agent提供的异步API才能做到。常见的框架，如react的setState和vue中的nextTick，也是这一原理。从具体的业务实践而言，假设我们的业务中需要频繁改动视图，那么我们可以考虑对这些修改进行批量处理并异步化：
- 批处理的关键在于合并修改。开发者传递修改操作给框架，框架内部约定好队列内容。极端简单的情况下，可能是一个变量，那么合并时仅需取队列最后一个操作内容即可；也有可能是一个对象或更复杂操作，则需视具体情况而定。
- 异步化的关键在于找到合适的barrier时机并委托给agent。根据我们的性能需求，barrier时机有可能是microtask，如vue，也有可能是RequestAnimationFrame，如诸多游戏渲染引擎。

2. 简单的状态机。完成Promise状态的流转，主要包含：
- 有且仅有三种状态：等待(pending)，已完成(fulfilled)，已拒绝(rejected)
- 状态只能从“等到”到“已完成”或“已拒绝”，不能逆向转换，同时“完成”和“拒绝”也不能相互转换。

![dsa](https://segmentfault.com/img/bVPepb?w=689&h=251)

另外Promise需要实现一个then方法，该方法：
- 在状态转变成“已完成”或“已拒绝”时，接收传入的参数。
- 返回一个新的Promise实例
- 链式调用

3. 常用API封装。Promise上提供了all、race等静态方法。在2016年以前，async.js这样的异步库大行其道，用来做一些异步流程控制，非常方便。现在Promise中自带了一些流程控制的方法。