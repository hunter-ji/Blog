# Nginx系列



## 功能

* 正向代理
* 反向代理
* 负载均衡
* 动静分离



## 配置文件

### 配置文件位置

* /etc/nginx/nginx.conf

### 配置文件组成

1. 全局块
   * 从配置文件开始到events块之间的内容，主要会设置一些影响nginx服务器整体运行的配置指令；
   * 比如`worker_processes 1;`，`worker_processes`值越大，可以支持的并发处理量也越大；
2. events块
   * events块涉及的指令主要影响Nginx服务器与用户的网络连接；
   * 比如`worker_connections 1024;`，`worker_connections`支持的最大连接数量；
3. http块
   * Nginx服务配置中最频繁的部分
   * http块包含`http全局块`，`server块`