### 报错

使用`flask_sqlalchemy`，服务端出现500错误，日志显示报错如下：

```bash
MySQL server has gone away
```



### 解决

添加配置:

```python
SQLALCHEMY_POOL_RECYCLE = 280
```

该配置作用是设置多少秒后回收连接，如果不提供值，默认为 2 小时。此处将其设置为280秒。



该配置原文解释：

> Number of seconds after which a connection is automatically recycled. This is required for MySQL, which removes connections after 8 hours idle by default. Note that Flask-SQLAlchemy automatically sets this to 2 hours if MySQL is used.