## js进阶知识点

### 预解析

js中提前解析的一个过程。

以下操作会被预解析

- var声明

- 函数声明---置顶声明+赋值

  ```js
  function fn2(){}
  ```

- 函数表达式

  ```js
  var fn1 = function(){}
  ```



### 访问作用域

写了var 函数顶上挂

没写var 逐级函数找var

直到最终window挂

```js
//写了var
(function(){
    var a;
    (function(){
        a = 1;
    })
    console.log(a); //1
})
console.log(a); //报错

//没写var
(function(){
    a = 1
})
console.log(a); //window.a =>1
```



### 深拷贝

**普通**

```js
function deepClone(obj){
            if(typeof obj !== 'object'|| obj === null){
                return obj;
            }
            let params
            if(obj instanceof Date || obj instanceof RegExp){
                params = obj;
            }
            // constructor属性指向自身的构造函数
            let tmp = new  obj.constructor(params);

            if(obj instanceof Array || obj instanceof Object){
                // 数组和对象
                for(let key in obj){
                    tmp[key] = deepClone(obj[key]);
                }
            }
            return tmp;
        }
```

处理不了特殊类型，Map和Set

**WeakMap优化**

假如有两个对象被环形引用，常规深拷贝会造成栈溢出，可以用weakMap来处理

```js
let map = new WeakMap();
function deepClone(obj){
            if(typeof obj !== 'object'|| obj === null){
                return obj;
            }
    		//检查有没有缓存过
            if(map.has(obj)){
                return map.get(obj);
            }
            let params
            if(obj instanceof Date || obj instanceof RegExp){
                params = obj;
            }
            // constructor属性指向自身的构造函数
            let tmp = new  obj.constructor(params);
            // 缓存
            map.set(obj,tmp);

            if(obj instanceof Array || obj instanceof Object){
                // 数组和对象
                for(let key in obj){
                    tmp[key] = deepClone(obj[key]);
                }
            }
            return tmp;
        }
//环形引用
let obj2 = {next: obj1}
let obj1 = {prev:obj2}
```



### 构造函数

在实际的业务中，将散列的对象封装一个构造函数更加易于维护与阅读。

下面为封装构造函数的实例

```js
function Person(name,age){
    this.name = name;
    this.age = age;
}
//固定的变量或方法可以写在原型链上可以避免重复创建
Person.prototype.color = '黄种人';
Person.prototype.eat = function(){
    console.log(this.color,this.name+'正在愉快的吃..')
}
```

可以用`hasOwnProperty('color')`来判断该属性是否为自身属性，可以用来区分原型属性

`Object.keys()`和`Object.values()`也可以用来区分，它们只输出自身属性。

keyStr in obj=>布尔值也可以用来区分,效果和hasOwnProperty一样

 

### 改变this

**用方法**

- bind

   **`bind()`** 方法创建一个新函数，当调用该新函数时，它会调用原始函数并将其 `this` 关键字设置为给定的值，同时，还可以传入一系列指定的参数，这些参数会插入到调用新函数时传入的参数的前面。

  ```js
  var fn1 = fn.bind('str',1,2);
  fn1(3,4) //1,2会在3，4的前面
  ```

- call
  **`call()`** 方法会以给定的 `this` 值和逐个提供的参数调用该函数。

- apply

   **`apply()`** 方法会以给定的 `this` 值和作为数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#使用类数组对象)）提供的 `arguments` 调用该函数。



**手写bind**

```js
		//提前缓存参数和this
        var tool = Array.prototype.slice; //工具函数
        Function.prototype.myBind = function (asThis) {
            var cachedArgs = tool.call(arguments, 1);
            console.log('mybind..', cachedArgs);

            //保存fn的值
            var callFn = this;
            if(typeof callFn !== 'function') throw new Error('当前的this非函数')

            var innerFn = function () {
                var args = tool.call(arguments);
                cachedArgs = cachedArgs.concat(args);
                console.log(cachedArgs, asThis);

                //区分new的还是调用的
                if (this instanceof innerFn) {
                    //创建对象的四个步骤
                    var target = {};
                    //原型挂载
                    target.__proto__ = callFn.prototype;
                    //执行构造函数
                    callFn.apply(target, cachedArgs);
                    return target
                } else {
                    //用fn 改变this，传递参数
                    return callFn.apply(asThis, cachedArgs);
                }

            }
            return innerFn;
        };
```





### 原型链相关



**访问原型**

1. 显示原型   构造函数  【prototype】 原型
   构造函数通过prototype访问原型

2. 隐式原型(向上)  实例   【`__proto__`】原型

   构造函数new出来的的实例通过constructor访问Person，通过`__proto__`来访问原型



**以Object为中心**

抽象图

<img src="\public\Snipaste_2025-02-18_18-20-16.png" style="zoom:80%;" />



**Function原型**

<img src="\public\Function原型.png" alt="Function原型" style="zoom:80%;" />



> 小细节：`Function.prototype === Function.__proto__`是true的。指向native code，因为Function既是对象也是函数，自身和创建的实例都指向function原型

**总结**

构造函数 --> new -->  创建实例

实例 -->   constructor  --> 构造函数



对象  `__proto__`    自身原型

构造函数对象    prototype  创建实例的原型

Object  prototype  创建实例的原型

Object `__proto__`    fn【native code】



Function   prototype    fn【native code】

Function    `__proto__`    fn【native code】



最终原型链会找到  【Object prototype{}】，再 `__proto__`  就会是 【null】



#### 继承

**组合派生继承**

```js
function Animal(age) {
            console.log('Animal构造函数正在执行..');
            this.age = age;
        }
        Animal.prototype.eat = function(){
            console.log(this.name,'动物正在愉快的吃饭...');
        }
        function Cat(name,age){
            this.name = name;
            Animal.call(this,age);
        }
        //原型继承，创建对象之前
        Cat.prototype = Object.create(Animal.prototype);
        //构造函数扭回来
        Cat.prototype.constructor = Cat;
        // 附加 [object Object] => [object Cat]功能 及 原型类型 Animal => Cat
        Cat.prototype[Symbol.toStringTag] = Cat.name;  //修改原型类型描述，toString方法也会有所改变

        var c1 = new Cat('小黑',10);
        c1.eat();
        console.dir(c1);

        console.log(c1.toString()); //=>[object Cat]
```

解决了原型继承和构造函数继承的一些问题。





### 闭包

一个函数访问外部的变量,**一般在不想使用全局变量的时候或数据持久化的时候可以用闭包**

通过闭包函数形成独立实例的变量，不会造成全局污染。

**应用：**返回初这个函数，让其持久存在，访问上述的变量，就可以独立于全局变量。

```js
function fn(){
//闭包部分
var b = new Array(100).fill('Green');
    function inner(){
        let innerB = b;
        return innerB[0]+'dan'
    }
//闭包end      只有inner函数才能对b进行修改	
    return inner;
}


var closure = fn()


//释放闭包
closure = null；
```

**使用闭包**

1. 在函数内声明一个变量，避免外部访问
2. 在该函数内再声明一个函数访问上述变量（闭包）
3. 返回函数内部的函数

```js
function fn() {  //套函数可以保证num不被外部访问
            var num = 1;
            function f() {
                return num++;
            }
            return f; //持久化使用这个闭包
        }
        var btns = document.querySelectorAll('button');
        btns.forEach(function (btn) {
            btn.onclick = function (e) {
                var clusure = fn();
                var timer = setInterval(function () {
                    e.target.innerText = clusure();
                    if(e.target.innerText > 5){
                        //结束
                        clusure = null;
                        clearInterval(timer);
                        e.target.innerText = '结束';
                    }
                }, 1000)
            }
        })
```



### 事件流

 **事件在 DOM 结构中传播的路径和顺序**

先从上到下(捕获) ，再从下到上(冒泡)



DOM事件绑定方式控制

- event.stopPropagation() 方法阻止捕获和冒泡阶段中当前事件
- event.preventDefault()  禁止表单提交，禁止默认行为可以和函数后面加个{passive:true}二选一

**事件委托**

事件流办不到的场景，委托其他元素来做一些行为。



this,e.currentTarget   是固定帮等事件的元素

e.target  是事件源对象



### 垃圾回收（garbage collection）

系统空闲时自动扫描内存，清理垃圾。



**三种方式**

- 引用计数 ：某个对象被其他变量引用一次，引用计数+1，赋值一次null，则减1，为0时被清除。
- 标记清除：第一轮扫描活动对象，标记活动对象。window不可达的对象不标记，第二轮清除没有标记的对象。
- 标记整理：清除之前会先执行整理，移动对象位置，使他们在地址上时一个连续的空间。







## ES6之后



### 参数解构和默认值

#### **参数解构**

{}的解构不能当作是一个对象，它只是一种结构

```js
let { log:l } = console;

        function parseObj({ data }){
            return data;
        }
        let arr = [{data:1},{data:2},{data:3}];
        let reaArr = arr.map(parseObj);
        l(reaArr);  //1,2,3

function sum({num: n1},{num:n2}){
            return n1+n2;
        }
        const total = sum({num: 1},{num:2});
        l(total);//3

let {num:{gan:{num}}} = {num:{gan:{num:12}}}
l(num); //12
let [,a,b] = [1,2,3]; //a:2 b:3
```



#### **参数默认值**

没有默认值的形参，如果不传值，且函数内部有对形参的事件调用，则会报错。

**基本数据类型**

```js
let { log:l } = console;
function add(n1=0,n2=0){
    return n1+n2;
}
l(add()); //0    
l(add(8));  //8
l(add(8,2)); //10
```

**引用数据类型**

```js
function hasProp(obj={}){
    return obj.hasOwnProperty('name');
}
l(hasProp({name:'Green'})); //true
l(hasProp()); //false 如果函数形参只是一个obj则会报错
```

**数组**

```js
function arr2Str(arr=[]){
	l(arr.join('dan'));
}
arr2Str([1,2,3])
```



#### 两者结合

```js
function fn({x:10,y} = {y:2}){
    l(x,y);
}
fn({y:1}) //10 1 参数传递进去，传进去的为主
fn({x:1}) //1,undefined 同理
fn()  //10,2 没有传递会以默认值为主，进行Object.assign合并属性(形参,默认值)
```



### 数组平铺

```js
let arr = [1,2,3,[4,5,[6,7,[8,[9]]]];

//方法1
let arr1 = arr.flat(infinity); //无线展开

//方法2
while(arr.some(Array.isArray)){
    arr = arr.flatMap(e=>e);
}
```

其余方法不太行，flatMap和concat都能展开一层，但一层一层的拨过于麻烦。



### Set数组去重、排序

这里只展示了一种方法

```js
// 数组去重、排序
        const ASC = 'asc'; const DESC = 'desc';
        function dupSort(arr,orderBy){
            let num = orderBy === DESC ? 1 : -1;

            // 后排序性能更好
            return Array.from(new Set(arr)).sort((n1,n2)=>{
                return (n2-n1) * num;
            });
            // sort如果不加方法底层按照字母对比前一位，所以10以上就不准了
        }
```



### promise（重点）

**概念**

promise有成功、失败两种处理

每一个Promise内部都会保存一个状态，有三种值：promiseState

pending/fulfilled/rejected   代发/满足/拒绝

new Promise  时 => pending

调用resolve 后 => fulfilled

调用reject 后 => rejected

PromiseResult存储传递的值



【状态不可修改，不可回退】



一组内只需要一个catch  一个finally来整体捕获及资源释放



【只要是异常被catch了，或者正常出来，状态都是fulfilled】



**捕获全局**

```js
 // 捕获全局 Uncaught （in promise）
        window.addEventListener('unhandledrejection', err => {
            err.preventDefault();
            console.log('出现Promise异常了..');

        })

        let p1 = new Promise((resolve, reject) => {
            resolve('成功1');
        })
            .then(res => {
                return new Promise((resolve, reject) => {
                    console.log(res);
                    resolve('成功1');
                })
            })
            .then(res => {
                return new Promise((resolve, reject) => {
                    console.log('异常1');
                    reject('异常1');
                })
            })
            .then(res => {
                return new Promise((resolve, reject) => {
                    console.log('成功4');
                })
            })


        let p2 = new Promise((resolve, reject) => {
            resolve('成功2');
        })
            .then(res => {
                return new Promise((resolve, reject) => {
                    console.log(res);
                    resolve('成功3');
                })
            })
            .then(res => {
                return new Promise((resolve, reject) => {
                    console.log(res);
                })
            })
```

结果为![捕获全局](\public\捕获全局.png)

> 层级输出，且触发异常后，下面的就不会执行了。（成功11没有执行）



**generator**（async await的前身） *过度产品*

用法

```js
function* gen(){
            console.log(1);//同步代码
            console.log(1);//同步代码
                        //礼让分界线，用next控制
            let res = yield 'Green' //异步代码
            console.log('res',res);
        }
        let generator = gen();
        // 通过代码开关来管理函数内的【代码块执行顺序】
        let res = generator.next();
        generator.next(res.value);
```

**async await**（常用）

```js
// async await
        async function asyncFn(){
            console.log('代码执行...');
            let res = await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve('我是数据...');
                },1000)
            });
            console.log('res',res);
        }
        asyncFn();
```



#### Promise API

场景：省市数据查询：所有的请求都要响应才算成功

**Promise.all**

```js
Promise.all([req(),req(),req()])
        .then(res =>{
            console.log('都成功了...',res);
        })
        .catch(err => {
            console.log('有一个失败了...',err);
        })
```

**Promise.race**

```js
//有一个成功就算成功
Promise.all([req(),req(),req()])
        .then(res =>{
            console.log('成功了一个...',res);
        })
        .catch(err => {
            console.log('全都失败了...',err);
        })
```

场景：应用于外部需要一个代表成功或失败的Promise

Promise.resolve

```js
let p3 = Promise.resolve('成功');
let p4 = Promise.reject('失败');
```



#### 书写优雅的await

数据响应模块

```js
function req() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    let data = Math.random();
                    if (data > 0.5) resolve(data);
                    else reject(data)
                }, 1000)
            })
        }
```

普通

```js
async function asyncFn(){
            // 为了避免异常导致程序崩溃，try catch处理
            try {
                var res = await req();
                // 如果成功.. 处理数据
                // 当前代码的可读性不高，因为try的{}
            } catch (err){
                console.log('异常了..',err);
                return;
            }
            console.log('成功:',res); //用var来解决块级作用域访问不到的问题
        }
         asyncFn();
```

优雅的封装（个性化处理异常）

```js
// 优化Promise返回结果
        function pretty(promise) {
            // 处理异常，避免程序出现报错
            // 因为没有配合await使用，所以可以不必使用try catch语法
            return promise.then(res => {
                return [undefined, res]
            }).catch(err => {
                return [err, undefined];
            });
        }
		//需要单独处理异常的场景使用
        async function asyncFn1() {
            var [err, res] = await pretty(req());
            if (err) return console.log('异常了..');
            // 处理成功的数据
            console.log('成功:', res); //用var来解决块级作用域访问不到的问题
        }
```

场景：集中处理异常

```js
async function asyncFn2(){
            await req();
        }
        asyncFn2();

        // 集中处理
        window.addEventListener('unhandledrejection',err=>{
            err.preventDefault();
            console.log('集中处理异常');   
        })
```



#### 重写forEach方法

场景：开发中如果需要基于数组做循环请求，可以使用for语法，或重写forEach

```js
Array.prototype.forEachTwo =async function(fn){
            if(typeof fn !== 'function') throw new Error('必须传递方法');
            // 判断变化的this,防止call方法
            if(!Array.isArray(this)) throw new Error('call方法必须保证this是数组');

            // 循环调用fn
            for(let i = 0,len = this.length;i<len;i++){
                await fn.apply(this,[this[i],i,this])  //不写await等同于瞬间调用10个异步函数，函数里面共同await了1秒
            }
        }

arr.forEachTwo(async n=>{
            let res = await req(n);
            console.log('响应结果：',res); //普通forEach直接一秒全部输出了。
        })
```



### 宏任务与微任务

宏任务：

- setTimeout
- IO
- AJAX
- 页面渲染

微任务：

- Promise
- queueMicrotask



**同类顺序：**

他们都是**平级**的时候**顺序执行**，**嵌套**的时候**下轮执行**。

**微与宏平级**

微任务与宏任务平级执行的时候，微任务先执行。**小任务大于微任务**。

**微与宏嵌套**

当**宏套微**时，微执行完了宏才算完。





### 事件循环

**js单线程执行顺序**（script就是一个大的宏任务）：

1. 同步代码
2. 微任务
3. 动画帧开始前的函数`requestAnimationFrame`
4. 渲染
   、、下面统一为渲染后执行
5. 对比元素变化（监视）
6. 渲染空闲执行的任务  `requestldleCallback`
7. 宏任务（setTimeout）

> 不断循环执行。

setTimeout进入宏任务后，运行=>执行读秒=>放入回调队列=>执行回调函数=>在主线程 渲染之后执行



### 事件阻塞

同步代码阻塞

```js
function fn(){
	while(true){}
}//函数执行后会阻塞事件循环
```

微任务代码阻塞

```js
function microTask(){
    queueMicrotask(()=>{
        microTask();
    })
} //微任务嵌套执行后宏任务无法执行完，导致阻塞
```

宏任务代码不会阻塞

```js
function macroTask(){
    //渲染后执行
	setTimeout(()=>{
        macroTask();//下一轮的渲染后执行
    })
}//每一次嵌套执行都会放到下一次的宏任务队列中，子要自身不阻塞就不会造成阻塞
```

每一帧开始的回调函无限嵌套也不会阻塞

```js
function frame(){
    //每一帧渲染前执行
    requestAnimationFrame(()=>{
        frame();//下一轮的渲染前执行
    })
}
```



### 模块化

09年   CMD(模块定义规范)、AMD(异步定义规范)、CommonJS中的Module(Node.js中的Module)



**ES_module**

具名导出

```js
export const a1 = 'a1';  //improt { a1 } from './文件名.js'
let a2 = 'a2';
let a3 = 'a3';
export { a2,a3} //improt { a2,a3 } from './文件名.js'
```

默认导出

```js
export default '默认值'; //improt xxx from './文件名.js'
```

全部导出

```js
improt *  from './文件名.js' 或者  improt * as xxx  from './文件名.js'
```





## **前后端交互**

**从地址栏敲击回车之后**
![](\public\地址栏回车后发生了什么.png)



http是一种应用协议，tcp传输协议

针对应用，主要约定服务期与客户端的交互

数据载体：请求（报文） + 响应（报文）

特点：先有请求才有响应



**流程：**

1. 默认端口：http:80,https:443
2. 地址栏回车是向服务器发起了get请求，附加【请求报文】：请求首行、请求头、请求体
3. 服务器 路由：请求方式 + url +查询字符串 分派执行代码
4. 服务器 解析：请求首行、请求头、请求体
5. 响应index.html，封装成【响应报文】：响应首行、响应头、响应体
6. 如果还存在其他外链资源复用这次连接继续请求
7. http1.1(connection:keep-alive):首次情趣建立连接，关闭页签销毁连接，中间资源复用连接
8. http1.0(connection:close)：立即关闭连接，下次请求重写建立连接



**三次握手**

1. 客户端 发起交互 提供seq序列号
2. 服务器根据 序列号响应 + 自身的序列号
3. 客户端响应 自己的序列号 + 服务器序列号

建立连接



ajax解析过程

1. （未初始化）还没调用send()方法

2. （载入）已调用send()方法，正在发送请求
3. （载入完成）send()方法执行完成
4. （交互中）正在解析响应内容
5. （完成）响应内容解析完成，可以在客户端调用了