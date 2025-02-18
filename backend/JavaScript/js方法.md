### 字符操作方方法

#### 字符串“拼接”

**concat**

将一个或多个字符串拼接成一个

```
a = 'hello '
a.concat('world','!')
a    //hello world!
```

#### 字符串“取”

**slice**

第一个参数：是字符串的起始位置，负数就是从右边开始

第二个参数：字符串的结束位置（不包含位置本身），负数会转换成字符串长度加上负参数（省略就默认取到字符串末尾）

**substr**

第一个参数：字符串的起始位置，负数就是从右边开始。

第二个参数：字符串返回的数量，负数会转换为0（省略就默认取到字符串末尾）

**substring**

第一个参数：字符串的起始位置，负数会转换为0

第二个参数：字符串的结束位置（不包含位置本身），负数会转换成字符串长度加上负参数（省略就默认取到字符串末尾）

> 注意：substring的那个参数数小就以那个参数为起点，另一个为终点





### 数组操作方法

#### **1.forEach**

对数组的每个元素执行一次给定的函数。

无返回值，仅仅是遍历

```js
const array1 = ["a", "b", "c"];

array1.forEach((element,index,arr) => console.log(element,index,arr));

```

- element : 数组中正在处理的当前元素。

- index : 数组中正在处理的当前元素的索引。

- array : 调用了 forEach() 的数组本身。



#### **2.map**

**`map()`** 方法**创建一个新数组**，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。

返回一个新数组，元素自己来定义。

```js
const map1 = array1.map((x) => x * 2);
```

同样是element,index,arr三个属性。

可以配合`fill()`来动态创建数组。

```js
const array1 = new Array(100)
const map1 = array1.fill(undefined).map((element,index,arr) => return index + 1;);
```



#### 增删改查

unshift(index)---前增

push(index)---后增

splice(index,dele_number,add_item)---增删一体

shift(index)---前删

pop(index)---后删

slice(state,end)---截取

concat(arr1，arr2...)---连接数组

flat(depth)---平铺数组



#### ES6方法

**查找**

find()---找元素，找不到返回undefined

findIndex()---找索引，找不到返回-1

filter()---过滤，返回满足条件的元素

以下方法满足后只返回一个布尔值，符合条件结束

some()---找到条件为true的值即结束

every()---找到条件为false的值即结束



**求和**

**`reduce()`** 方法对数组中的每个元素按序执行一个提供的 **reducer** 函数，每一次运行 **reducer** 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。

