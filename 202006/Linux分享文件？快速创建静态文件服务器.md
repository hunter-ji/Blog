## 一. 需求

Linux对于开发者来说极其友好，但是由于国内主流办公产品相关的生态较为匮乏，因此如何使用Linux去分享文件是一件十分头疼的问题。

对于这个问题，可以直接使用静态文件服务器解决部分需求，如下介绍几个常见方法。



## 二. 语言类

### 一. Python

对于`Python`来说，可以直接使用内置的库来实现。

* python2

  ```python
  python -m SimpleHTTPServer 8000
  ```

* Python3

  ```python
  python -m http.server 8000
  ```



### 二. Node.js

`node`生态内有一个项目`http-server`，直接`V8`引擎带你飞。

1. 安装

* Npm

```bash
npm install --global http-server
```

* Homebrew

```bash
brew install http-server
```



2. 运行

```bash
http-server [path] [options]
```

例如：

```bash
cd exmaple/
http-server
```



3. 项目仓库地址

https://github.com/http-party/http-server



## 三. 服务类

1. Nginx/Apache

`Nginx`和`Apache`本身可用于静态文件服务器，这就需要用户直接在本地安装。

当然，`nginx`需要注意配置一下，打开索引：

```
server {
	listen	80;
	...
	
	location / {
		root /usr/share/nginx/html;
		autoindex on;
	}
}
```



2. Docker

使用`Docker`其实也是使用如`Nginx`来实现静态文件服务器，但是容器化在该场景存在几大优势：

* 即开即用
* 环境隔离

相对于直接安装`Nginx`或者`Apache`，更推荐使用`Docker`。

