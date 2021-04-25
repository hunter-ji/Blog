## 一. 简介

具体日志采集方案在`Grafana+Loki+Promtail日志收集方案`文章中已经介绍过，此处不再重复介绍。不太了解的小伙伴儿赶紧去复习！

此处主要是记录下`Docker Driver Client`方式的部署。



## 二. docker plugin

### 1. 安装

安装`loki`插件。

```bash
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
```

### 2. 验证

```bash
$ docker plugin ls
ID                  NAME         DESCRIPTION           ENABLED
ac720b8fcfdb        loki         Loki Logging Driver   true
```

### 3. 开启/禁用

```bash
docker plugin enable loki
docker plugin disable loki --force
```

### 4. 卸载

```bash
docker plugin rm loki
```



## 三. 部署

### 1. docker-compose.yml

```yaml
version: "3"

networks:
  loki:

services:
  loki:
    image: grafana/loki:2.0.0
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - loki

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    networks:
      - loki
```

### 2. 运行

```bash
docker-compose up -d
```

### 3. 容器运行形式

容器运行时需要修改`log-driver`：

```bash
 --log-driver=loki
--log-opt loki-url="http://<loki-url>/loki/api/v1/push"
--log-opt loki-retries=5
--log-opt loki-batch-size=400
```

举个例子：

```bash
docker run --log-driver=loki \
    --log-opt loki-url="http://192.168.10.10:3100/loki/api/v1/push" \
    --log-opt loki-retries=5 \
    --log-opt loki-batch-size=400 \
    -p 3000:3000 \
    nginx
```

由此查看日志，其`labels`只有`container_name`。



## 四. 参考文档

* [官方文档](https://grafana.com/docs/loki/latest/clients/docker-driver/)