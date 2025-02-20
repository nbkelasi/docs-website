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



### 普通深拷贝

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
- event.preventDefault()  禁止表单提交，禁止默认行为

**事件委托**

事件流办不到的场景，委托其他元素来做一些行为。



this,e.currentTarget   是固定帮等事件的元素

e.target  是事件源对象



### 垃圾回收（garbage collection）

系统空闲时自动扫描内存，清理垃圾。

两种算法：

- 最近访问的
  采用的引用计数法-----引用数不为0则不会被清理

- 不常访问的

  采用标记清除，扫描出window不可达，标记为垃圾，下一次扫描清除垃圾。