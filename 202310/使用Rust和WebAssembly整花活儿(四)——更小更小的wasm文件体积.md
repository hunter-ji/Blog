# 一. 前言

在上一篇文章[《使用Rust和WebAssembly整花活儿(三)——Rust与JS交互》](https://github.com/Kuari/Blog/issues/74)中，讲述了Rust与JS的交互，包括Rust与JS的函数相互调用，比较炸裂的功能就是使用JS调用Rust的struct，JS本身连struct都没有，居然可以调用Rust的struct，这对于Rust开发者的开发体验而言，是真的很棒！

基于前面的系列文章，已经足以使用Rust开发一个完整的功能了。

但是，在前端引入wasm文件时，还是可能存在一些问题，比如wasm文件较大，导致网页访问时间较长，用户体验较差。本篇文章将会通过多种途径来减少Rust编译wasm文件的体积，以减少前端加载wasm文件的时间。

曾经一段时间，我一直用[Go开发WebAssembly](https://github.com/Kuari/Blog/issues/69)，其编译后的wasm文件体积还是较大的，为了减少wasm文件的体积真是煞费苦心，1xMB大小的wasm文件真的是太痛了......但是体积优化往往都会指向一条“充满魅惑的不归路”——换成Rust开发😆！如果你已经在用Rust开发WebAssembly了，那么恭喜你，对Go而言，在wasm体积上，你已经赢在起跑线上了。



# 二. 环境

- Rust 1.70.0
- wasm-bindgen 0.2.87



# 三. 查看体积

在真正去减少体积前，我们需要来先看一下，当前情况下体积是多少，方便后续对比前后体积。

查看体积的方式有多种，这里推荐几个，（Linux和MacOS）使用其一即可。

### ls

可以使用`ls -l`或者`ll`：

```bash
$ ll pkg/hello_wasm_bg.wasm
-rw-r--r--  1 kuari  staff    23K Jul 20 21:52 pkg/hello_wasm_bg.wasm
```

### stat

```bash
$ stat pkg/hello_wasm_bg.wasm 
16777222 142141572 -rw-r--r-- 1 kuari staff 0 23347 "Jul 20 21:52:53 2023" "Jul 20 21:52:01 2023" "Jul 20 21:52:01 2023" "Jul 20 21:52:01 2023" 4096 48 0 pkg/hello_wasm_bg.wasm
```

### wc

```bash
$ wc -c pkg/hello_wasm_bg.wasm 
   23347 pkg/hello_wasm_bg.wasm
```

以`wc`为例，当前该wasm文件体积为**23347b**。



# 四. 代码层面

> Link-Time Optimization (LTO) 是指在程序链接时进行的一种过程间优化（interprocedural optimization）。它允许编译器在链接阶段对多个编译单元进行优化，从而提高程序的性能、可靠性和安全性。

从代码层面优化，主要是利用LTO（Link-Time Optimization）。

## 1. 代码内

在`Cargo.toml`中开启LTO：

```toml
[profile.release]
lto = true
```

开启LTO虽然能够减少编译后的体积，但是也会增加编译时间。

LTO开启后，默认是在减少一定程度的编译体积的情况下，要确保编译的时间。如果你的需求就是更小的体积，而不是较短的时间，那么，可以通过手动指定编译等级来让LTO作出改变。

在代码内可以使用如下等级：

* `s`：默认的 LTO 等级。它会进行最基本的 LTO 优化，包括内联函数、函数重写、数据重排等
* `z`：最高级的 LTO 等级。它会进行更复杂的 LTO 优化，包括死代码消除、内存分配优化、安全性优化等

那么可以在`Cargo.toml`中这么配置：

```toml
[profile.release]
lto = true
opt-level = 'z'
```

原始的文件体积是23347b，现在编译后看一下体积：

```bash
$ wc -c pkg/hello_wasm_bg.wasm                          
   19879 pkg/hello_wasm_bg.wasm
```

很明显是减少体积！但是，使用`z`等级并不代表一定每次体积都会比`s`小的，有时候`s`也会比`z`小，这需要视代码情况而定。



## 2. 代码外

在代码外，可以使用[wasm-opt](https://github.com/WebAssembly/binaryen)来进行优化，其可以对 WebAssembly 模块进行多方面的优化，当然本篇文章中重点在体积方面（挖个坑，后面再详聊/狗头）。并且wasm-opt可以对所有符合WebAssembly规范的wasm文件进行优化，所以，就算你不是Rust写的，那也可以用其进行优化。（想想我曾经Go写的wasm，也是有多一个法子可以优化一把了......）

首先，来看一下wasm-opt的基本优化参数：

* **-o**：指定优化后的模块输出文件
* **-O**：启用默认优化，等同于`-Os`参数
* **-O0**：不进行任何优化
* **-O1**：进行一些基本的优化，例如内联函数优化和死代码消除优化
* **-O2**：进行更为彻底的优化，例如函数重写、数据重排、内存分配优化等
* **-O3**：进行最为彻底的优化，包括一些可能影响程序功能的优化
* **-O4**：与 `-O3` 相同，但会启用更为激进的优化
* **-Os**：优化目标是减小代码大小，会进行一些可能影响性能的优化
* **-Oz**：与 `-Os` 相同，但会启用更为激进的优化

基于本篇文章主题，此处将使用`-Os`和`-Oz`两种参数，其于上述"代码内"的等级是对应的。

此处以原始wasm文件，以`-Oz`参数来执行一下，看一下对比效果：

```bash
$ wc -c pkg/output.wasm                                 
   23194 pkg/output.wasm
```

再以上述开启“代码内“LTO编译后的wasm文件，以wasm-opt执行一下，看一下对比效果：

```bash
$ wc -c pkg/output.wasm                                                                                      
   19871 pkg/output.wasm
```

总体而言，wasm文件的体积越来越小。只是当前我这里的案例，是沿用系列文章内容的代码，没有什么实际性复杂代码，再者本身体积已经很小了，所以不会特别有效果。



# 五. 网络层面

网络层面的话，就是众所周知的在网络传输时，客户端和服务端约定相同的压缩算法，然后服务端给出时进行压缩，客户端接收时进行解压。网络层面可以对传输报文进行压缩，但不丢失信息。

比如大家都很熟悉的gzip压缩算法，不过，压缩算法有好几种：

* gzip
* compress
* deflate
* br

其中gzip也是压缩率最高的了，此处就以gzip为例。

在网络层面，将wasm文件以gzip压缩，减少其在传输时的体积。虽然减少了传输时的体积，但是浏览器在拿到压缩后的数据，需要消耗一定性能来解密。

## 1. 开启GZIP

开启GZIP其实简单，只要前后端约定好都用gzip就行了。

首先，前端请求wasm文件时，需要在request header中放入浏览器支持的压缩模式：

```
Accept-Encoding: gzip, deflate
```

接着，服务端收到这个请求后就可以给出服务端也支持的压缩模式，并告诉浏览器服务端将会用什么压缩模式。

跟浏览器通信的方式就是将信息塞到respone header里面：

```
Content-Encoding: gzip
```

这样就开启GZIP了。

然后，就是浏览器接收到response的body和header，知道后端使用gzip压缩的，那么浏览器就会自动用gzip来解压，拿到完整的数据了。

## 2. 服务端支持

或许你会想问，浏览器能自动解密，那服务端怎么自动加密呢？要后端写代码让文件加密吗？

那当然不是了，直接让http server来完成这个操作。此处以耳熟能详的Nginx为例。

最简单的就是一行配置开启gzip了：

```
gzip on;
```

也可以指定gzip的一些参数，比如可以加密的类型、最小加密长度等等：

```
gzip on;
gzip_types      text/plain application/xml;
gzip_proxied    no-cache no-store private expired auth;
gzip_min_length 1000;
...
```

更多的http server配置，可以去各自官方文档查阅。



# 六. 物理层面

你可能会惊奇，什么物理层面？！

没错，真就是物理层面——直接对wasm文件进行gzip物理压缩！哈哈，这个方法也真是绝了，我之前在Go开发wasm时，寻找减少体积的时候发现的，如果你的wasm已经优化得穷途末路了，不妨大胆试试这个方案。😆

还记得上面章节“网络层面“中，有个问题就是是否需要手动压缩，那么这里就是全程手动压缩和解压缩了，哈哈。

## 1. 物理压缩

首先，是对wasm文件进行物理层面的gzip压缩，此处先使用原始的wasm（23347b）：

```bash
gzip -c pkg/hello_wasm_bg.wasm > pkg/output.gz
```

然后，看一下其体积：

```bash
$ wc -c pkg/output.gz
   10403 pkg/output.gz
```

效果卓群，从23347b减少到了10403b！

然后来把上述“代码层面”的优化来一遍，看一下最后的体积：

```bash
$ wc -c pkg/output.gz                                   
    9237 pkg/output.gz
```

效果更加卓群了，从19871b减少到了9237b了！

所以，此处就是对wasm文件进行物理压缩并存储，然后浏览器请求时，直接请求到`.gz`文件。

## 2. 物理解压

浏览器拿到`.gz`文件后，需要物理解压。

这里推荐使用`pako`这个前端库，对`.gz`文件进行解压：

```js
async function gunzipWasm() {
  const res = await fetch("target.gz")
  let buffer = await pako.ungzip(await res.arrayBuffer())
  // A fetched response might be decompressed twice on Firefox.
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=610679
  if (buffer[0] === 0x1F && buffer[1] === 0x8B)
  {buffer = pako.ungzip(buffer)}
  return buffer
}
```

之后就可以直接使用了。



# 七. BUFF叠加

此处直接将上述所有方法都用起来，直接叠加buff，来看看当前（本系列文章积累的）这个案例能减少多少体积。在“物理层面”章节中，已经累加除了“网络层面”的buff了，所以可以直接使用其结果。而“网络层面”章节中，以gzip来压缩，将gzip的压缩率以40%来估算。

那么最终该案例的wasm体积将在**5542b**，压缩率大约在**77%**！

当然，还要算上一个初始的语言buff——Rust，使用Rust本身就已经导致wasm文件体积很小了。



# 八. 总结

本片文章中，从代码层面、网络层面、物理层面共三个层面介绍了对wasm文件的体积优化方案，其中共有四个方案。

最后，当前（本系列文章积累的）该案例叠加了所有buff之后，能够减少**77%**的体积，真的感觉挺棒的了，哈哈。

希望能够对各位有所帮助。
