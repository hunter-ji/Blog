## 一. 前言

代码运行过程中，意外情况会导致`500`错误，对于使用者来说体验很不好，对于开发者来说也无法及时获取错误，需要去查看日志。

并且有的插件在某些报错情况下会返回一些敏感信息，非常危险。因此需要去捕获全局错误，通知开发者，自定义错误消息等。



## 二. 实现

```python
from server import app
from flask import request
from datetime import datetime
from werkzeug.exceptions import HTTPException


@app.errorhandler(Exception)
def all_exception_handler(e):
    if isinstance(e, HTTPException):
        if e.code == 404:
            return {
                       'code':    40004,
                       'message': '404'
                   }, 404

    # 通知开发者/写入日志
    handle(path = request.path, content = str(e))
    
    return {
        'code':    20001,
        'message': 'Error'
    }

```

