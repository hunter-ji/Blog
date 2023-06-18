# 一. 前言

在上一篇文章[《使用Rust和WebAssembly整花活儿(一)——快速开始》](https://github.com/Kuari/Blog/issues/72)中，描述了如何创建项目和快速生成wasm并在前端中使用，迈出了整花活儿的第一步。

在开发 Web 应用程序时，使用 Rust 编写的 Wasm 模块可以提供更高的性能和更好的安全性。但是，为了与现有的 JavaScript 代码集成，必须实现 Rust 与 JS 之间的交互。Rust 与 JS 交互的主要目的是将两种语言的优势结合起来，以实现更好的 Web 应用程序。

本篇文章中，将基于上一篇文章中创建的项目来继续开发。

源码：[github.com/Kuari/hello-wasm](https://github.com/Kuari/hello-wasm)



# 二. 环境

- Rust 1.70.0
- wasm-bindgen 0.2.87
- web-sys 0.3.64



# 三. DOM

### 1. 配置依赖

要操作DOM，需要引入新的依赖`web-sys`，因此，可以配置`Cargo.toml`中依赖如下：

```toml
[dependencies]
wasm-bindgen = "0.2.87"
web-sys = { version = "0.3.64", features = [] }
```

你或许会好奇，这个`features`是什么，讲真，我一开始很好奇，又没看到什么特别的说明，试错才发现，原来是要手动引入功能依赖...比如说，当你需要在Rust中使用JS的`console`，那么你需要在`features`中加入`console`。

### 2. 获取Document

在Rust中使用`Document`，我们需要按照上一步的说明，添加`features`。那么这里有一个依赖关系，首先在Rust中获取`window`，然后再获取`document`。

因此，添加`features`后如下：

```toml
[dependencies]
wasm-bindgen = "0.2.87"
web-sys = { version = "0.3.64", features = ["Window", "Document"] }
```

然后在`lib.rs`中创建一个函数，用来调用`document`：

```rust
#[wasm_bindgen]
pub fn update_message() {
    let window = web_sys::window().expect("Failed to load window");
    let document = window.document().expect("Failed to load document");
}
```

那么，现在就是在Rust中解锁了`document`，就可以在前端为所欲为了！

### 3. 操作Element

那么开始操作一波，首先得获取到`Element`......

是的，你没有想错，继续来添加`features`吧，此处要添加一个`Element`：

```toml
[dependencies]
wasm-bindgen = "0.2.87"
web-sys = { version = "0.3.64", features = ["Window", "Document", "Element"] }
```

ok，那么继续。此处设定函数传入两个参数`selector`和`message`，然后通过`selector`获取element，更新值为`message`参数的值。完整函数如下：

```rust
#[wasm_bindgen]
pub fn update_message(selector: &str, message: &str) {
    let window = web_sys::window().expect("Failed to load window");
    let document = window.document().expect("Failed to load document");
    let element = document.query_selector(selector).expect("Failed to load element");

    if let Some(element) = element {
        element.set_inner_html(message);
    } else {
        panic!("Failed to set inner html")
    }
}
```

### 4. 编译

将写完的Rust项目编译成wasm：

```bash
wasm-pack build --target web
```

### 5. 在html中调用

基于上一篇文章的项目中的html，此处添加一个`div`，id为`message`，添加调用wasm的`update_message`函数，代码如下：

```html
<body>
    <div id="message"></div>
</body>

<script type="module">
    import init, { update_message } from './pkg/hello_wasm.js'; // 引入update_message函数

    const run = async () => {
        await init();

        update_message('#message', '<h1>Hello, Rust!</h1>'); // 调用update_message函数
    }

    run();
</script>
```

### 6. 在浏览器验证

启动一个http server，然后在浏览器查看，可以看到在页面上出现一个`h1`标签的`Hello, Rust!`。

### 7. 发现更多方法

按照文章来写的过程中，你应该会发现一个问题——怎么这些方法没有补全？！

是的，没错的，（至少我发现）当前`web-sys`并没有补全，所以只能结合开发者优秀的前端技能和丰富的[官方文档](https://rustwasm.github.io/wasm-bindgen/api/web_sys/)来开发了。



# 四. Rust与JS的类型相互转换

对于wasm而言，性能固然是提升的，但是类型转换一直是个问题。当大量数据需要在wasm/js中进行类型转换时，这对性能来说，真的是个灾难。之前在使用go开发wasm时，就遇到过这样的问题，需要用官方的方法来进行手动类型转换，然而wasm处理的是一个很大的数据量......

不过好在Rust的类型支持真的挺丰富的！

### 1. 基础类型

基础类型挺简单的，而且Rust的范性也很好地支持了很多类型。如下是基础类型映射表：

| Rust类型      | JavaScript类型          |
| ------------ | ----------------------- |
| i8        | number                  |
| i16       | number                  |
| i32        | number                  |
| i64       | BigInt          |
| u8        | number            |
| u16       | number                  |
| u32 | number |
| u64 | BigInt |
| f32 | number |
| f64 | number |
| bool         | boolean                 |
| char         | string                  |
| &str       | string                  |
| String       | string                  |
| &[T] 例如：&[u8] | [T] 例如：Uint8Array |
| Vec<T>       | Array                   |



### 2. 基础类型转换示例

在`lib.rs`文件中，创建一个函数，挑选几个类型作为参数传入，然后将其读取并打印：

```rust
#[wasm_bindgen]
pub fn print_values(js_number: i32, js_boolean: bool, js_uint8_array: &[u8], js_number_array: Vec<i32>) {
    println!("js number: {}", js_number);
    println!("js boolean: {}", js_boolean);

    for item in js_uint8_array {
        println!("js Uint8Array item: {}", item);
    }

    for item in js_number_array {
        println!("js number array item: {}", item);
    }
}
```

可以看到该函数传入了JS的`number`、`boolean`、`Uint8Array`和`Array`四个类型的参数。

然后编译：

```bash
wasm-pack build --target web
```

接着，在前端中引入函数并调用：

```html
<script type="module">
    import init, { print_values } from './pkg/hello_wasm.js';

    const run = async () => {
        await init();

        const jsNumber = 10;
        const jsBoolean = true;

        const jsUint8Array = new Uint8Array(3);
        jsUint8Array[0] = 1;
        jsUint8Array[1] = 2;
        jsUint8Array[2] = 3;

        const jsNumberArray = [30, 40, 50];

        print_values(jsNumber, jsBoolean, jsUint8Array, jsNumberArray);
    }

    run();
</script>
```

最后，启动http server并打开浏览器，在控制台可以看到...看不到？！

是的，没错，Rust的`println!`只会将打印的内容发送到Rust的标准输出流，而不是前端的控制台。如果想在控制台中打印，那么需要调用JS的`console`了。

使用新的功能，第一步就是添加`features`，`Cargo.toml`中添加`console`如下：

```toml
[dependencies]
wasm-bindgen = "0.2.87"
web-sys = { version = "0.3.64", features = ["Window", "Document", "Element", "console"] }
```

在Rust中调用`console.log()`如下：

```rust
web_sys::console::log_1(&"Hello, Rust!".into());
```

此处将其封装成一个函数：

```rust
fn console_log(message: String) {
    web_sys::console::log_1(&message.into());
}
```

然后，将示例函数的`println`改成`console_log()`和`format!`，函数代码如下：

```rust
#[wasm_bindgen]
pub fn print_values(js_number: i32, js_boolean: bool, js_uint8_array: &[u8], js_number_array: Vec<i32>) {
    console_log(format!("js number: {}", js_number));
    console_log(format!("js boolean: {}", js_boolean));

    for item in js_uint8_array {
        console_log(format!("js Uint8Array item: {}", item));
    }

    for item in js_number_array {
        console_log(format!("js number array item: {}", item));
    }
}
```

最后，编译之后，打开浏览器，就可以在控制台看到输出：

```
js number: 10
js boolean: true
js Uint8Array item: 1
js Uint8Array item: 2
js Uint8Array item: 3
js number array item: 30
js number array item: 40
js number array item: 50
```



### 3. 通用类型

Rust中提供了一个通用的类型——JsValue，可以作为任何JS类型。

这里给一个简单的案例，设置一个函数，使用`JsValue`作为参数传入，并打印。

创建函数：

```rust
#[wasm_bindgen]
pub fn print_js_value(val: JsValue) {
    console_log(format!("{:?}", val));
}
```

然后编译成wasm文件。

在html中调用：

```html
<script type="module">
    import init, { print_js_value } from './pkg/hello_wasm.js';

    const run = async () => {
        await init();

        const jsNumber = 10;
        const jsBoolean = true;

        const jsUint8Array = new Uint8Array(3);
        jsUint8Array[0] = 1;
        jsUint8Array[1] = 2;
        jsUint8Array[2] = 3;

        const jsNumberArray = [30, 40, 50];

        print_js_value(jsNumber);
        print_js_value(jsBoolean);
        print_js_value(jsUint8Array);
        print_js_value(jsNumberArray);
    }

    run();
</script>
```

在html中，传入了不同类型的参数，但是在浏览器的控制台中可以看到，将所有不同类型的参数都打印出来了：

```
JsValue(10)
JsValue(true)
JsValue(Uint8Array)
JsValue([30, 40, 50])
```



### 4. Result

`Result`在Rust中是一个很重要的存在，经常写Rust的话，也不想在写WebAssembly时改变开发习惯。

其实对于JS而言，`Result`可以直接在`catch`中捕获到，只是说，这里我们需要定义好参数类型。

#### 4.1 使用Result返回报错

首先来一个只返回报错的场景：

```rust
#[wasm_bindgen]
pub fn only_return_error_when_result(count: i32) -> Result<(), JsError> {
    if count > 10 {
        Ok(())
    } else {
        Err(JsError::new("count < 10"))
    }
}
```

这里返回类型是`Result`，但是仅仅返回了一个错误。值得注意的是，这里的报错使用的类型是`JsError`，当然，这里也可以使用`JsValue`。

然后在html调用：

```html
<script type="module">
    import init, { only_return_error_when_result } from './pkg/hello_wasm.js';

    const run = async () => {
        await init();

        try {
            only_return_error_when_result(1);
            console.log('1 is ok');
        } catch(error) {
            console.log('An error is reported when the input parameter is 1: ', error);
        }

        try {
            only_return_error_when_result(100);
            console.log('100 is ok');
        } catch(error) {
            console.log('An error is reported when the input parameter is 100: ', error);
        }
    }

    run();
</script>
```

这里调用了两次，第一次应当是错误的，第二次应该是正确的，并且都使用了`catch`来捕获错误。

那么，在浏览器的控制台可以看到输出：

```
An error is reported when the input parameter is 1:  Error: count < 10
100 is ok
```

#### 4.2 使用Result返回正常值和错误

那么，如果想既返回正常值，也想返回错误呢？Rust返回一个`Result`是没有问题，那么JS怎么解析呢？

直接上Rust代码：

```rust
#[wasm_bindgen]
pub fn return_all_when_result(count: i32) -> Result<i32, JsError> {
    if count > 10 {
        Ok(count + 10)
    } else {
        Err(JsError::new("count < 10"))
    }
}
```

该函数，获取到参数后，如果满足条件，加10后返回，否则报错。

那么看看html中如何调用：

```html
<script type="module">
    import init, { return_all_when_result } from './pkg/hello_wasm.js';

    const run = async () => {
        await init();

        try {
            const res = return_all_when_result(1);
            console.log(`get ${res}`);
        } catch(error) {
            console.log('An error is reported when the input parameter is 1: ', error);
        }

        try {
            const res = return_all_when_result(100);
            console.log(`get ${res}`);
        } catch(error) {
            console.log('An error is reported when the input parameter is 100: ', error);
        }
    }

    run();
</script>
```

是的，没错，正常获取就行了....../捂脸哭

这里的调用，依然是，第一个是错误的，第二个是正确返回值的，并且都使用了`catch`来捕获错误。

最后，就是在浏览器的控制台中看到：

```
An error is reported when the input parameter is 1:  Error: count < 10
get 110                                                             
```



### 5. 直接引入JS类型

如果你想更直接一点，那么可以直接引入JS类型！这里主要是利用`js-sys`这个依赖，可以在[官方文档](https://docs.rs/js-sys/latest/js_sys/)上看到很多JS的类型和函数，直接引入即可使用。当然，一定场景下，直接引入的类型，是需要手动转换类型的。

#### 5.1 配置依赖

在`Cargo.toml`中添加`js-sys`依赖：

```toml
[dependencies]
wasm-bindgen = "0.2.87"
web-sys = { version = "0.3.64", features = ["Window", "Document", "Element", "console"] }
js-sys = "0.3.61"
```

#### 5.2 Uint8Array

首先以`Uint8Array`举例，在`lib.rs`头部引入类型：

```rust
use js_sys::Uint8Array;
```

然后创建一个函数，参数和返回都是`Uint8Array`类型：

```rust
#[wasm_bindgen]
pub fn print_uint8_array(js_arr: Uint8Array) -> Uint8Array {
    // new Uint8Array
    let mut arr = Uint8Array::new_with_length(3);

    // Uint8Array -> vec
    for (index, item) in js_arr.to_vec().iter().enumerate() {
        console_log(format!("{} - the item in js_arr: {}", index, item));
    }

    // Avoid type conversion
    // Use the method of the type itself
    for index in 0..js_arr.length() {
        console_log(format!("{} - the item in js_arr: {}", index, js_arr.get_index(index)));
    }

    // vec -> Uint8Array
    let vec = vec![1, 2, 3];
    let arr2 = Uint8Array::from(vec.as_slice());
    arr = arr2.clone();

    // Use the method of the type itself
    arr.set_index(0, 100);

    arr
}
```

> 忽略该函数中无意义的逻辑和`arr`变量的警告，只是为了演示用法。

可以在代码中看到，直接引入的`Uint8Array`有自己的方法，一定场景下，需要转换类型，但是最好避免进行类型转换，而直接使用其自带的方法。

这里可以简要总结下，就是最好一定场景内全部使用直接引入的JS类型，或者直接全部使用Rust类型来代替JS类型，两者都存在场景下，手动转换类型是件很糟糕的事。



#### 5.3 Date

`Date`类型，在上面的篇章中都没有提及，这里可以直接引入JS的`Date`类型来使用。

首先是引入类型：

```rust
use js_sys::Date;
```

然后，创建一个函数，返回时间戳：

```rust
#[wasm_bindgen]
pub fn return_time() -> f64 {
    let date = Date::new_0();
    date.get_time()
}
```

接着，在html中调用：

```html
<script type="module">
    import init, { return_time } from './pkg/hello_wasm.js';

    const run = async () => {
        await init();

        console.log('current time: ', return_time());
    }

    run();
</script>
```

最后，在浏览器的控制台中，可以看到：

```
current time:  1686979932833
```



# 五. 总结

本文中，主要讲述了如何使用Rust来实现DOM操作，读者可以根据方法自己去找到合适的方法，来实现自己的场景。其次，还讲述了Rust与JS的类型转换，从基础的各自类型的映射，到Rust独有的`Result`，到直接引入JS类型。当然这里需要注意的是，直接引入JS类型和Rust的基础类型映射JS类型这两种方法尽量不要混用，混用会导致需要手动类型转换，造成性能损耗。

至此，又向Rust和WebAssembly整花活儿迈进了一步~😼
