## 要点

在JS中绑定this的方法主要有4种：
1. new
2. 显式绑定(call, apply, bind)
3. 隐式绑定
4. 默认绑定

### 主要原理
在模拟显式绑定时，可以使用隐式绑定的方法，即将绑定的内容与被调用的函数置于同一个object中。

### 主要步骤
1. 将函数设为绑定对象的属性
2. 执行函数
3. 删除函数