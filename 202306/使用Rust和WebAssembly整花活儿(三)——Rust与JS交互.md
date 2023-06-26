# 一. 前言

在上一篇文章[《使用Rust和WebAssembly整花活儿(二)——DOM和类型转换》](https://github.com/Kuari/Blog/issues/73)中，描述了使用Rust操作DOM，并实现Rust与JS类型转换的多种方法。

在开发 Web 应用程序时，使用 Rust 编写的 Wasm 模块可以提供更高的性能和更好的安全性。但是，为了与现有的 JavaScript 代码集成，必须实现 Rust 与 JS 之间的交互。Rust 与 JS 交互的主要目的是将两种语言的优势结合起来，以实现更好的 Web 应用程序。

基于上一篇文章中，Rust与JS的类型转换的多种方法，本篇文章继续深入Rust与JS的交互。

首先，Rust与JS的类型转换，可以实现变量的传递，那么变量是要用在哪里呢？那必然是函数了！

所以，本篇文章来讲述一下Rust与JS的函数相互调用，基于此，可以实现大量日常功能开发。

并且，还将会讲述一下，如何导出Rust的struct给JS调用。

是的，没错，在JS调用Rust的struct！一开始看到这个功能的时候，我的脑子是有点炸裂的......😳

本篇文章中，将基于上一篇文章中创建的项目来继续开发。

源码：[github.com/Kuari/hello-wasm](https://github.com/Kuari/hello-wasm)

# 二. 函数的相互调用

## 1. JS调用Rust函数

其实，在本系列文章的第一篇中，就是使用的JS调用Rust函数作为案例来演示的，这里依然以此为例，主要讲一下要点。

首先，声明一个Rust函数：

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

此处需要注意的要点如下：

* 引入`wasm_bindgen`
* 声明一个函数，使用`pub`声明
* 在函数上使用`#[wasm_bindgen]`宏来将Rust函数导出为WebAssembly模块的函数

接着，编译成wasm文件：

```bash
wasm-pack build --target web
```

然后，在JS中调用该函数：

```html
<script type="module">
    import init, { add } from './pkg/hello_wasm.js';

    const run = async () => {
        await init();
        const result = add(1, 2);
        console.log(`the result from rust is: ${result}`);
    }

    run();
</script>
```

最后，启动http server，在浏览器的控制台中可以看到`the result from rust is: 3`，表明调用成功！



## 2. Rust调用JS函数

### 2.1 指定JS对象

在Rust中调用JS函数，需要进行指定JS对象，也就是说，得明确告诉Rust，这个JS函数是从JS哪儿拿来的用的。

主要在于下面两个方式：

* ***js_namespace***: 是一个可选的属性，用于指定一个JavaScript命名空间，其中包含将要在wasm模块中导出的函数。如果没有指定`js_namespace`，则所有的导出函数将被放置在全局命名空间下。
* ***js_name***: 是另一个可选属性，它用于指定JavaScript中的函数名称。如果没有指定`js_name`，则导出函数的名称将与Rust中的函数名称相同。



### 2.2 JS原生函数

对于一些JS原生函数，在Rust中，需要去寻找替代方案，比如我们上一篇文章中讲的`console.log()`函数，是不是觉得好麻烦啊！

那么，你想直接在Rust中调用JS原生函数吗？！

此处，就以`console.log()`函数为例，直接在Rust中引入并调用，免去替代方案的烦恼。

首先，给出Rust代码：

```rust
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(message: &str);
}

#[wasm_bindgen]
pub fn call_js_func() {
    log("hello, javascript!");
}
```

如上代码中，`call_js_func`函数，顾名思义，此处是调用了js函数，并传入参数`hello, javascript!`。

那么，`call_js_func`函数上方的代码，我们来一步步解析一下：

1. 第一行代码`#[wasm_bindgen]`是Rust的属性，它告诉编译器将函数导出为WebAssembly模块
2. `extern "C"`是C语言调用约定，它告诉Rust编译器将函数导出为C语言函数
3. `#[wasm_bindgen(js_namespace = console)]`告诉编译器将函数绑定到JavaScript中的console对象
4. `fn log(message: &str)`是一个Rust函数，它接受一个字符串参数，并将其打印到JavaScript中的console对象中

此处与JS交互的关键是`js_namespace`。在Rust中，`js_namespace`是用于指定JavaScript命名空间的属性。在WebAssembly中，我们可以通过它将函数绑定到JavaScript中的对象上。

在上述代码中，`#[wasm_bindgen(js_namespace = console)]`告诉编译器将函数绑定到JavaScript中的`console`对象。这意味着在JS中使用`console.log()`函数来调用Rust中的`log()`函数。

因此，类似的原生函数，都可以使用该方法来实现调用。

最后，我们在JS中调用下：

```html
<script type="module">
    import init, { call_js_func } from './pkg/hello_wasm.js';

    const run = async () => {
        await init();
        call_js_func();
    }

    run();
</script>
```

可以在浏览器的控制台中看到`hello, javascript!`。妙啊！

其实对于`console.log()`而言，还有另一种调用方式，那就是使用`js_namespace`和`js_name`同时指定。

或许，你会问，这有什么不同吗？是的，这有些不同。

不知道你是否发现，当前这个案例中，指定了`js_namespace`为`console`，但是真实执行的函数是`log()`，那么这个`log`函数的指定，其实是体现在Rust中同样的函数名`log`。也就是说，该案例的`log()`就是`console.log()`中的`log()`。

我们来换个名字看看，将原来的`log()`换成`log2()`：

```rust
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log2(message: &str);
}

#[wasm_bindgen]
pub fn call_js_func() {
    log2("hello, javascript!")
}
```

然后编译后去控制台看看，就会看到报错：

```
TypeError: console.log2 is not a function
```

因此，当我们使用`js_namespace`和`js_name`结合的方式，在此处是可以进行自定义函数名的。

看一下Rust代码：

```rust
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(message: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_str(message: &str);
}

#[wasm_bindgen]
pub fn call_js_func() {
    log_str("hello, javascript!")
}
```

此处，重新定义了一个函数`log_str`，但是其指定了`js_namespace = console`和`js_name = log`，那么此处，就可以使用自定义的函数名。

直接编译后，在控制台看一下，可以直接看到正常输出：`hello, javascript!`。

总结一下，如果没有指定`js_name`，则 Rust 函数名称将用作 JS 函数名称。



### 2.3 自定义JS函数

在一定场景下，需要使用Rust调用JS函数，比如对于一些对于JS而言更有优势的场景——用JS操作DOM，用Rust计算。

首先，创建一个文件`index.js`，写入一个函数：

```js
export function addIt(m, n) {
    return m + n;
};
```

当前的文件结构关系如下：

```
.
├── Cargo.lock
├── Cargo.toml
├── README.md
├── index.html
├── index.js
├── pkg
│   ├── README.md
│   ├── hello_wasm.d.ts
│   ├── hello_wasm.js
│   ├── hello_wasm_bg.wasm
│   ├── hello_wasm_bg.wasm.d.ts
│   └── package.json
├── src
│   └── lib.rs
└── target
    ├── CACHEDIR.TAG
    ├── debug
    ├── release
    └── wasm32-unknown-unknown
```

其中，`index.js`和`lib.rs`，以及`hello_wasm_bg.wasm`都是不在同一级别的，`index.js`都在其它两个文件的上一级。记住这个机构关系！

然后，在`lib.rs`中，指定函数：

```rust
#[wasm_bindgen(raw_module = "../index.js")]
extern "C" {
    fn addIt(m: i32, n: i32) -> i32;
}
```

其中，`raw_module = "../index.js"`的意思是，指定对应的`index.js`文件，大家应该清楚，此处指定的是刚刚创建的`index.js`。`raw_module`的作用就是用来指定js文件的。

这段代码在前端，可以等同于：

```js
import { addIt } from '../index.js'
```

这样在前端都不用引入了，直接在Rust中引入了，感觉还有点奇妙的。

接着，在Rust调用该函数：

```rust
#[wasm_bindgen]
pub fn call_js_func() -> i32 {
    addIt(1, 2)
}
```

最后，在前端调用，编译后，在浏览器的控制台中可以看到输出结果了！

总结一下，这里有几个注意点：

1. JS的函数必须要export，否则将无法调用；
2. `raw_module`只能用来指定相对路径，并且，大家可以在浏览器的控制台中注意到，此处的`../`的相对路径，其实是以wasm文件而言的相对路径，这里一定要注意呀！

# 三. JS调用Rust的struct

现在，来点炸裂的，JS调用Rust的struct？！

JS中连struct都没有，这玩意儿导出来会是什么样，得怎么在JS中调用呢？！

首先，定义一个struct，并且声明几个方法：

```rust
#[wasm_bindgen]
pub struct User {
    name: String,
    age: u32
}

#[wasm_bindgen]
impl User {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, age: u32) -> User {
        User { name, age }
    }

    pub fn print_user(&self) {
        log(format!("name is : {}, age is : {}", self.name, self.age).as_str());
    }

    pub fn set_age(&mut self, age: u32) {
        self.age = age;
    }
}
```

此处，声明了一个struct名为`User`，包含`name`和`age`两个字段，并声明了`new`、`print_user`和`set_age`方法。

其中还有一个未见过的`#[wasm_bindgen(constructor)]`，`constructor`用于指示被绑定的函数实际上应该转换为调用 JavaScript 中的 new 运算符。或许你还不太清晰，继续看下去，你就会明白了。

接着，在JS中调用这个struct，和其方法：

```html
<script type="module">
    function addIt2(m, n) {
        return m + n;
    };

    import init, { User } from './pkg/hello_wasm.js';

    const run = async () => {
        await init();

        const user = new User('kuari', 20);
        user.set_age(21);
        user.print_user();
    }

    run();
</script>
```

可以看到，这里的用法就很熟悉了！

大概想一下，在Rust中要如何调用？也就是直接new一个——`User::new('kuari', 20)`。

此处在JS中，也是如此，先new一个！

然后很自然地调用struct的方法。

编译后，打开浏览器，可以在控制台看到输出：`name is : kuari, age is : 21`。

其实，或许大家会很好奇，起码我是非常好奇的，Rust的struct在JS中到底是一个怎样的存在呢？

这里直接添加一个`console.log(user)`，就可以在输出看到。那么到底在JS中是一个怎样的存在呢？请各位动手打印一下看看吧！:P

# 四. 总结

本篇文章中，主要讲述了Rust与JS的交互，体现在Rust与JS的相互调用，这是建立在[上一篇文章](https://github.com/Kuari/Blog/issues/73)中类型转换的基础上的。

Rust与JS的函数相互调用的学习成本还是较大的，而且对比Go写wasm，Rust的颗粒度是非常细的，几乎可以说是随心所欲了。

比较炸裂的就是Rust的struct导出给JS用，这对于Rust与JS的交互而言，还是非常棒的体验。
