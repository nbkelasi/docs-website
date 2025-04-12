## Hook与函数组件

### 函数组件基本使用及点标记组件写法

#### 函数组件的基本使用

函数组件是比类组件编写起来更简单的一种组件形式

```jsx
// 类组件
class Welcome extends React.Component {
    render(){
        return (
            <div>hello world</div>
        );
    }
}
// 函数组件
let Welcome = () => {
    return (
        <div>hello world</div>
    );
}
```

还可以在函数组件中完成，父子通信，事件，默认值等操作

```jsx
let Welcome = (props) => {
    const handleClick = () => {
        console.log(123);
    }
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            <div>hello world, { props.count }</div>
        </div>
    );
}
Welcome.defaultProps = {
    count: 0
}
Welcome.propTypes = {
    count: PropTypes.number
}
```

#### 点标记组件写法

无论是函数组件还是类组件，都可以进行点标记的写法操作组件

```jsx
const Imooc = {
    Welcome: class extends React.Component {
        render(){
            return (
                <div>hello Welcome</div>
            )
        }
    },
    Head: () => {
        return (
            <div>hello Head</div>
        )
    }
}
let element = (
    <div>
        <Imooc.Welcome />
        <Imooc.Head />
    </div>
);
```

这种写法，适合复杂组件的形式，可扩展子组件进行组合使用，更加具备语义化操作。



### Hook概念与Hook之useState函数

Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，useState 是允许你在 React 函数组件中添加 state 的 Hook。

useState函数主要实现的功能就是类似于类组件中setState()方法所实现的功能，当数据发生改变的时候可以重新执行组件的重渲染操作。

```jsx
let { useState } = React;
let Welcome = (props) => {
    const [count, setCount] = useState(0);
    const handleClick = () => {
        setCount(count + 1)       
    }
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            <div>hello world, { count }</div>
        </div>
    );
}
```

当点击按钮的时候，通过调用`setCount`来修改count值，从而使得Welcome组件重新执行，而useState函数具备记忆功能，所以再次得到的count值就是修改之后的值，那么视图重新渲染就会显示新的效果。

在使用Hook钩子函数的时候，有一些规范要求:

- 只能在最顶层使用Hook，
- 只能在函数组件中使用Hook。也就是useState一定要放到组件的最前面进行调用，不要在函数或语句中进行调用。

setCount函数是用来修改count数据的，所以他跟前面讲的类组件的state是很像的，也是具备自动批处理能力的，如果不想使用这种自动批处理能力的话，还是可以使用`flushSync`这个方法。

```jsx
let { useState } = React;
let { flushSync } = ReactDOM;
let Welcome = (props) => {
    const [count, setCount] = useState(0);
    const [msg, setMsg] = useState('hello');
    const handleClick = () => {
        flushSync(()=>{
          setCount(count + 1)
        })
        flushSync(()=>{
          setMsg('hi')
        })       
    }
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            <div>hello world, { count }, { msg }</div>
        </div>
    );
}
```

以上对Welcome组件重新渲染了两次。setCount函数具备回调函数的写法，可以把相同的操作进行都触发的行为。

```jsx
setCount((count)=> count+1)
setCount((count)=> count+1)
setCount((count)=> count+1)

<div>{ count }</div>   // 渲染 3
```

useState中的值在修改的时候，并不会进行原值的合并处理，所以使用的时候要注意。可利用扩展运算符的形式来解决合并的问题。

```jsx
const [info, setInfo] = useState({
    username: 'xiaoming',
    age: 20
})
setInfo({
    ...info,
    username: 'xiaoqiang'
})
```

如果遇到初始值需要大量运算才能获取的话，可采用惰性初始state，useState()添加回调函数的形式来实现。

```jsx
const initCount = () => {
    console.log('initCount');
    return 2*2*2;
}
const [count, setCount] = useState(()=>{
    return initCount();
});
```

这样初始只会计算一次，并不会每次都。



### useEffect函数

Effect Hook 可以让你在函数组件中执行副作用操作，副作用即：DOM操作、获取数据、记录日志等，uEffect Hook 可以用来代替类组件中的生命周期钩子函数。

基本使用：

```jsx
let { useState, useEffect } = React;
let Welcome = (props) => {
    const [count, setCount] = useState(0);
    useEffect(()=>{
        // 初始 和 更新 数据的时候会触发回调函数
        console.log('didMount or didUpdate');
    })
    const handleClick = () => {
        setCount(count + 1);
    }
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            <div>hello world, { count }</div>
        </div>
    );
}
```

当有一些副作用需要进行清理操作的时候，在useEffect中可通过return返回回调函数来实现。

```jsx
let Welcome = (props) => {
    const [count, setCount] = useState(0);
    //异步函数，在浏览器渲染DOM后触发的
    useEffect(()=>{
        console.log('didMount or didUpdate');
        return ()=>{  // 这里回调函数可以用来清理副作用
            console.log('beforeUpdate or willUnmount');
        }
    })
    const handleClick = () => {
        //setCount(count + 1);
        root.unmount();
    }
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            <div>hello world, { count }</div>
        </div>
    );
}
```

在更新前触发或在卸载时候触发`beforeUpdate or willUnmount`，这样可以对某些副作用进行清理操作。

useEffect有很多需要注意的事项，总结如下：

- #### **使用多个 Effect 实现关注点分离**

  因为useEffect可以调用多次，每一次都是独立的，互相不影响，所以可以进行逻辑关注点的分离操作。

  ```jsx
  let Welcome = (props) => {
      const [count, setCount] = useState(0);
      useEffect(()=>{
          console.log(count);
      })
      const [msg, setMsg] = useState('hello');
      useEffect(()=>{
          console.log(msg);
      })
      const handleClick = () => {
          setCount(count + 1);
      }
      return (
          <div>
              <button onClick={handleClick}>点击</button>
              <div>hello world, { count }, { msg }</div>
          </div>
      );
  }
  ```

  

- #### **通过跳过 Effect 进行性能优化**

  当关注点分离后，改变一个数据后，例如count，那么msg相关的useEffect也会触发，那么对于性能这块还是有一些影响的，能不能做到哪一个数据改变了，只重新触发自己的useEffect回调函数呢？

  可以通过给useEffect设置第二个参数来做到。

  ```jsx
  const [count, setCount] = useState(0);
  useEffect(()=>{
      console.log(count);
  }, [count])
  const [msg, setMsg] = useState('hello');
  useEffect(()=>{
      console.log(msg);
  }, [msg])
  ```

  

- #### **Effect 中使用了某个响应式数据，一定要进行数组的依赖处理**

  ```jsx
  let Welcome = (props) => {
      const [count, setCount] = useState(0);
      useEffect(()=>{
          console.log(count);
      }, [])   // ✖ 当useEffect中有响应式数据，那么在依赖数组中一定要指定这个响应式数据
  
      useEffect(()=>{
          console.log(123);
      }, [])   // ✔ 只有初始化的时候触发，模拟 初始的生命周期钩子 
  
      const handleClick = () => {
          setCount(count + 1);
      }
      return (
          <div>
              <button onClick={handleClick}>点击</button>
              <div>hello world, { count }</div>
          </div>
      );
  }
  ```

  当useEffect中使用了响应式的数据count时候，需要在[]中进行依赖处理，`[count]`这样才是符合规范的。

- #### **频繁的修改某个响应式数据，可通过回调函数进行改写**

  ```jsx
  let Welcome = (props) => {
      const [count, setCount] = useState(0);
      useEffect(()=>{
          setInterval(()=>{
              setCount(count + 1);
          }, 1000)
      }, [count])   // ✔ 会造成定时器的累加，所以需要清理，非常麻烦的
  
      useEffect(()=>{
          setInterval(()=>{
              setCount((count)=> count + 1);
          }, 1000)
      }, [])   // ✔
  
      const handleClick = () => {
          setCount(count + 1);
      }
      return (
          <div>
              <button onClick={handleClick}>点击</button>
              <div>hello world, { count }</div>
          </div>
      );
  }
  ```

  

- #### **useEffect()是在渲染被绘制到屏幕之后执行的，是异步的；useLayoutEffect()是在渲染之后但在屏幕更新之前，是同步的**

  ```jsx
  let { useState, useEffect, useLayoutEffect } = React;
  let Welcome = (props) => {
      const [msg, setMsg] = useState('hello world');
      useEffect(()=>{
          let i = 0;
          while(i<100000000){
              i++;
          }
          setMsg('hi react');
      })
      /* useLayoutEffect(()=>{
          let i = 0;
          while(i<100000000){
            i++;
          }
          setMsg('hi react');
        }) */
      return (
          <div>
              <div>{ msg }</div>
          </div>
      );
  }
  ```

  使用useEffect，页面会看到闪烁的变化，而采用useLayoutEffect就不会看到数据闪烁的问题，因为useLayoutEffect可以同步显示UI，大部分情况下我们采用useEffect()，性能更好。但当你的useEffect里面的操作需要处理DOM，并且会改变页面的样式，就需要用useLayoutEffect，否则可能会出现闪屏问题。



### useRef函数

useRef函数的作用就是原生DOM操作，跟类组件中的ref操作是类似的，也是可以通过回调函数和useRef()两种方式来操作原生DOM。

- #### 回调函数形式

  ```jsx
  let Welcome = (props) => {  
      const handleClick = () => {
      }
      const elementFn = (elem) => {
          console.log(elem);
      }
      return (
          <div>
              <button onClick={handleClick}>点击</button>
              <input ref={elementFn} type="text" />
          </div>
      );
  }
  ```

- #### useRef()形式

  ```jsx
  let { useRef } = React;
  let Welcome = (props) => {  
      const myRef = useRef()
      const handleClick = () => {
          myRef.current.focus()
      }
      return (
          <div>
              <button onClick={handleClick}>点击</button>
              <input ref={myRef} type="text" />
          </div>
      );
  }
  ```

- #### 函数转发

  可以把ref添加到函数组件上，那么就可以把ref对应的对象转发到子组件的内部元素身上。

  ```jsx
  let Head = React.forwardRef((props, ref) => {
      return (
          <div>
              hello Head
              <input type="text" ref={ref} />
          </div>
      )
  })
  let Welcome = (props) => {  
      const myRef = useRef()
      const handleClick = () => {
          myRef.current.focus();
      }
      return (
          <div>
              <button onClick={handleClick}>点击</button>
              <Head ref={myRef} />
          </div>
      );
  }
  ```

- #### useRef的记忆能力

  useRef可以做到跟useState类似的功能，就是可以对值进行记忆操作。

  ```jsx
  let Welcome = (props) => {  
      const [num, setNum] = useState(0);
      //let count = 0;  //不具备记忆功能的
      let count = useRef(0);  // 可以给普通值进行记忆操作
      const handleClick = () => {
          count.current++;
          console.log(count.current);
          setNum(num + 1)
          //console.log(num);
      }
      return (
          <div>
              <button onClick={handleClick}>点击</button>
          </div>
      );
  }
  ```

  我们就可以利用这一点，来实现一些应用，例如利用useRef来对useEffect进行只做更新的操作。

  ```jsx
  let Welcome = (props) => {  
      const [num, setNum] = useState(0);
      let isUpdate = useRef(false);
      useEffect(()=>{
          if(isUpdate.current){
              console.log(123);
          }
      })
      const handleClick = () => {
          setNum(num + 1)
          isUpdate.current = true;
      }
      return (
          <div>
              <button onClick={handleClick}>点击</button>
          </div>
      );
  }
  ```






### useContext函数

这个函数用来创建context对象，而context对象的用法跟类组件中的context对象是一样的，也是完成跨组件通信的。

语法有：

let MyContext = React.createContext()用于得到一个可以进行传递数据的组件，<MyContext.Provider value={}>用于实现数据的传递。let value = useContext(MyContext)用于获取传递进组件内的值。

```jsx
let { useContext } = React;
let MyContext = React.createContext('默认值');
let Welcome = (props) => {  
    return (
        <div>
            hello Welcome
            <MyContext.Provider value="welcome的问候~~~">
                <Head />
            </MyContext.Provider>
        </div>
    );
}
let Head = () => {
    return (
        <div>
            hello Head
            <Title />
        </div>
    );
}
let Title = () => {
    let value = useContext(MyContext);
    return (
        <div>
            hello Title, { value }
        </div>
    );
}
```



### 函数组件性能优化之React.memo

函数组件中的数据没有发生改变的时候，是不会重新渲染视图的。

```jsx
let Welcome = (props) => {  
    const [ count, setCount ] = useState(0);
    const handleClick= () => {
        setCount(0);
    }
    console.log(123);
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            hello Welcome { Math.random() }
        </div>
    );
}
```

在上面的程序中，当点击了按钮，123是不会被打印的。这里我们还需要了解一种特殊的现象，代码如下：

```jsx
let Welcome = (props) => {  
    const [ count, setCount ] = useState(0);
    const handleClick= () => {
        setCount(1);
    }
    console.log(123);
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            hello Welcome { Math.random() }
        </div>
    );
}
```

上面的代码，当点击按钮后，应该触发一次123后就不会再触发了，但是实际上确触发了两次，那么这是为什么呢？实际上React官网上有对这一现象做过说明。

链接地址如下：https://zh-hans.reactjs.org/docs/hooks-reference.html#bailing-out-of-a-state-update。引用内容如下：

如果你更新 State Hook 后的 state 与当前的 state 相同时，React 将跳过子组件的渲染并且不会触发 effect 的执行。（React 使用 [`Object.is` 比较算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 来比较 state。）

需要注意的是，React 可能仍需要在跳过渲染前渲染该组件。不过由于 React 不会对组件树的“深层”节点进行不必要的渲染，所以大可不必担心。如果你在渲染期间执行了高开销的计算，则可以使用 `useMemo` 来进行优化。

内部只是为了进行检测，并不会影响我们的效果。这里还说到了如果不想让组件在没有数据依赖的情况下，可通过`React.memo`来避免没有必要的重新渲染，实际上`React.memo`的功能类似于类组件中的纯函数概念。

```jsx
let Welcome = (props) => {  
    const [ count, setCount ] = useState(0);
    const handleClick= () => {
        setCount(1);
    }
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            hello Welcome
            <Head count={count} />
        </div>
    );
}
let Head = React.memo(() => {
    return (
        <div>hello Head, { Math.random() }</div>
    )
})
```

当count没有发生改变的时候，那么<Head/>组件不会重新触发。



### useCallback与useMemo

useCallback返回一个可记忆的函数，useMemo返回一个可记忆的值，useCallback只是useMemo的一种特殊形式。

实际上我们在父子通信的时候，有可能传递的值是一样的，但是传递的内存地址可能是不一样的，那么在React眼里是会对组件进行重新执行的。

一般对象类型的值都是具备内存地址的，所以值相同，但内存地址可能不同，举例如下：

```jsx
let Welcome = (props) => {  
    const [ count, setCount ] = useState(0);
    const handleClick= () => {
        setCount(count+1);
    }
    const foo = () => {}
    return (
        <div>
            <button onClick={handleClick}>点击</button>
            hello Welcome
            <Head bar={bar} />
        </div>
    );
}
```

当点击按钮的时候，<Head/>组件会进行重新渲染，因为每次重新触发<Welcome/>组件的时候，后会重新生成一个新的内存地址的foo函数。

那么如何不让foo函数重新生成，使用之前的函数地址呢？因为这样做可以减少子组件的渲染，从而提升性能。可以通过useCallback来实现。

```jsx
const foo = useCallback(() => {}, [])
```

而有时候这种需要不一定都是函数，比如数组的情况下，我们就需要用到useMemo这个钩子函数了，useMemo更加强大，其实useCallback是useMemo的一种特殊形式而已。

```jsx
const foo = useMemo(()=> ()=>{}, [])   // 针对函数
const bar = useMemo(()=> [1,2,3], [])  // 针对数组
```

这里我们还要注意，第二个参数是一个数组，这个数组可以作为依赖项存在，也就是说当依赖项发生值的改变的时候，那么对应的对象就会重新创建。

```jsx
const foo = useMemo(()=> ()=>{}, [count])   // 当count改变时，函数重新创建
```



### useReducer函数

useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法。

在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。

下面是没有使用useReducer实现的一个小的案例。

```jsx
let Welcome = (props) => {  
    const [ isLogin, setLogin ] = useState(true)
    const [ isLogout, setLogout ] = useState(false)
    const handleLogin = () => {
        setLogin(true)
        setLogout(false)
    }
    const handleLogout = () => {
        setLogin(false)
        setLogout(true)
    }
    return (
        <div>
            { isLogin ? <button onClick={handleLogout}>退出</button> : <button onClick={handleLogin}>登录</button> }
        </div>
    );
}
```

这里分成了两个useState函数去完成的，并没有体现整体关联性与统一性。下面是利用useRducer函数的改进写法。

```jsx
let { useReducer } = React;
let loginState = {
    isLogin: true,
    isLogout: false
}
let loginReducer = (state, action) => {
    switch(action.type){
        case 'login':
            return { isLogin: true, isLogout: false }
        case 'logout':
            return { isLogin: false, isLogout: true }
        default: 
            throw new Error() 
    }
}
let Welcome = (props) => {  
    const [ state, loginDispatch ] = useReducer(loginReducer, loginState);
    const handleLogin = () => {
        loginDispatch({ type: 'login' });
    }
    const handleLogout = () => {
        loginDispatch({ type: 'logout' });
    }
    return (
        <div>
            { state.isLogin ? <button onClick={handleLogout}>退出</button> : <button onClick={handleLogin}>登录</button> }
        </div>
    );
}
```

### 并发模式与startTransition

React 18 之前，渲染是一个单一的、不间断的、同步的事务，一旦渲染开始，就不能被中断。

React 18 引入并发模式，它允许你将标记更新作为一个 transitions，这会告诉 React 它们可以被中断执行。这样可以把紧急的任务先更新，不紧急的任务后更新。

利用startTransition这个方法来实现不紧急的任务操作。

```jsx
let { memo, useState, startTransition } = React;
let List = memo(({query})=>{
    const text = 'hello world'
    const items = []

    if( query !== '' && text.includes(query) ){
        const arr = text.split(query);
        for(let i=0;i<10000;i++){
            items.push(<li key={i}>{arr[0]}<span style={{color:'red'}}>{query}</span>{arr[1]}</li>)
        }
    }
    else{
        for(let i=0;i<10000;i++){
            items.push(<li key={i}>{text}</li>);
        }
    }

    return (
        <ul>
            { items }
        </ul>
    )
})
let Welcome = memo(()=>{
    const [ searchWord, setSearchWord ] = useState('');
    const [ query, setQuery ] = useState('');
    const handleChange = (ev) => {
        setSearchWord(ev.target.value)  //第一个任务
        startTransition(()=>{
            setQuery(ev.target.value)   //第二个任务(不紧急的任务)
        })
    }
    return (
        <div>
            <input type="text" value={searchWord} onChange={handleChange} />
            <List query={query} />
        </div>
    )
})
```

这里的`第一个任务`是紧急的，需要先执行，而`第二个任务`耗时比较长，所以可以作为不紧急任务存在，这样就不会阻塞`第一个任务`先去执行操作，从而达到不影响视图的渲染。

### useTransition与useDeferredValue

- #### useTransition

  useTransition返回一个状态值表示过渡任务的等待状态，以及一个启动该过渡任务的函数。

  ```jsx
  let { memo, useState, useTransition } = React;
  let List = memo(({query})=>{
      const text = 'hello world'
      const items = []
  
      if( query !== '' && text.includes(query) ){
          const arr = text.split(query);
          for(let i=0;i<10000;i++){
              items.push(<li key={i}>{arr[0]}<span style={{color:'red'}}>{query}</span>{arr[1]}</li>)
          }
      }
      else{
          for(let i=0;i<10000;i++){
              items.push(<li key={i}>{text}</li>);
          }
      }
  
      return (
          <ul>
              { items }
          </ul>
      )
  })
  let Welcome = memo(()=>{
      const [ searchWord, setSearchWord ] = useState('');
      const [ query, setQuery ] = useState('');
      const [ pending, startTransition ] = useTransition();
      const handleChange = (ev) => {
          setSearchWord(ev.target.value)  //第一个任务
          startTransition(()=>{
              setQuery(ev.target.value)   //第二个任务(不紧急的任务)
          })
      }
      return (
          <div>
              <input type="text" value={searchWord} onChange={handleChange} />
              { pending ? <div>loading...</div> : <List query={query} /> }
          </div>
      )
  })
  ```

  利用useTransition方法得到两个值，分别是：pending 和 startTransiton。pending是一个等价的状态。当没有成功前pending得到true，当操作完成后，pending就会变成false，这样就会有更好的用户体验效果。

- #### useDeferredValue

  useDeferredValue 接受一个值，并返回该值的新副本，该副本将推迟到更紧急地更新之后。

  ```jsx
  let { memo, useState, useDeferredValue } = React;
  let List = memo(({query})=>{
      const text = 'hello world'
      const items = []
      if( query !== '' && text.includes(query) ){
          const arr = text.split(query);
          for(let i=0;i<10000;i++){
              items.push(<li key={i}>{arr[0]}<span style={{color:'red'}}>{query}</span>{arr[1]}</li>)
          }
      }
      else{
          for(let i=0;i<10000;i++){
              items.push(<li key={i}>{text}</li>);
          }
      }
      return (
          <ul>
              { items }
          </ul>
      )
  })
  let Welcome = memo(()=>{
      const [ searchWord, setSearchWord ] = useState('');
      const query = useDeferredValue(searchWord); // query就是不紧急时候的值(延迟后的值)
      const handleChange = (ev) => {
          setSearchWord(ev.target.value)  //第一个任务
      }
      return (
          <div>
              <input type="text" value={searchWord} onChange={handleChange} />
              <List query={query} />
          </div>
      )
  })
  ```

  useDeferredValue()可以直接得到不紧急的值query，所以简化了操作，内部自动进行了startTransiton调用。



### 函数组件功能复用之自定义Hook

完成页面获取鼠标坐标的小案例

```jsx
let { useState, useEffect } = React
let useMouseXY = () => {
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    useEffect(()=>{
        function move(ev){
            setX(ev.pageX)
            setY(ev.pageY)
        }
        document.addEventListener('mousemove', move)
        return () => {
            document.removeEventListener('mousemove', move)
        }
    }, [])
    return {
        x,
        y
    }
}
let Welcome = ()=>{
    const {x, y} = useMouseXY()
    return (
        <div>
            hello Welcome, {x}, {y}
        </div>
    )
}
```

自定义Hook函数跟React自带的Hook函数用法类似，其实现原理也是类似的。