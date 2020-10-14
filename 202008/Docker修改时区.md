## 一. 前言

在使用`Docker`时，其默认时区并非使用者所在时区，需要进行修改。对于单个容器，当前修改有几种常见方式，比如直接映射宿主机时区到容器内，而本文介绍的为使用`Dockerfile`来直接修改镜像时区。此处仅以常见几个基础容器为例来介绍。



## 二. 常见容器

### 1. **Alpine**

```Dockerfile
FROM alpine:latest

# 安装tzdata
RUN apk add --no-cache tzdata

# 设置时区
ENV TZ="Asia/Shanghai"

```

* 验证

```bash
docker build -t alpine:time .
docker run --rm -it alpine:time date
```



### 2. **Ubuntu**

```Dockerfile
FROM ubuntu

# 设置localtime
# 此处需要优先设置localtime，否则安装tzdata将会进入时区选择
RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 安装tzdata
RUN apt-get update \
		&& apt-get install tzdata -y \
		&& apt-get clean

```

* 验证

```bash
docker build -t ubuntu:time .
docker run --rm -it ubuntu:time date
```



### 3. Debian

* Debian中已经安装了`tzdata`，所以跟`Ubuntu`有所不通过

```dockerfile
FROM debian

# 修改设置dpkg为自动配置
ENV DEBIAN_FRONTEND=noninteractive

RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

RUN dpkg-reconfigure -f noninteractive tzdata

# 修改设置dpkg为手动输入选择操作
ENV DEBIAN_FRONTEND=dialog
```

* 验证

```bash
docker build -t debian:time .
docker run --rm -it debian:time date
```



## 三. 结语

此处不再列举太多，主要解决方式为安装`tzdata`，然后修改时区。