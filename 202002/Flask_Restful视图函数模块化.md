Restful作为目前流行的api设计规范，在flask上也有较好的实践，即为flask_restful。我们在使用flask_restful的时候，当代码量达到一定程度，需要将视图函数模块化。然而在Flask之前一直使用Blueprint模块化，那么flask_restful如何模块化呢？底下就来瞅瞅！



## 一. 当前架构

```
server/
├── __init__.py
├── commands.py
├── config.py
└── views.py
```

* `__init__.py`：将该文件夹标示为一个模块
* `commands.py`：额外命令，如初始化数据库
* `config.py`：配置文件
* `views.py`：视图函数



此为一个简单的flask项目架构，我们可以将flask中的各个功能拆分出来，分给不同文件，最后在`__init__.py`导入。

```python
from flask import Flask
from flask_cors import CORS
from flask_restful import Api

app = Flask('server')
app.config.from_pyfile('config.py')

CORS(app)

api = Api(app)

from server import commands, views
```





## 二. 初步模块化

现在将视图函数改为一个文件夹`views`，然后在该文件夹下放入拆分后的文件。这里以登录和获取用户信息接口为例，架构就变成了下面这样。

```
server/
├── __init__.py
├── commands.py
├── config.py
└── views
    ├── __init__.py
    ├── login.py
    └── info.py
```

此处的`__init__.py`文件功能如上，是将文件夹`views`标示为模块，但是此处的`__init__py`是个空白文件，但是`server`文件夹中的`__init__.py`的引入需要改变。

```python
...
from server import commands
from server.views import login, info
```





## 三. 最终模块化

此时还不够，例如登录和获取用户信息接口是`User`模块下的，而获取文章标题接口是`Article`模块的下的，因此我们继续分。

```
server/
├── __init__.py
├── commands.py
├── config.py
└── views
    ├── Aricle
    │   ├── __init__.py
    │   └── title.py
    ├── User
    │   ├── __init__.py
    │   ├── info.py
    │   └── login.py
    └── __init__.py

```

`server`文件夹中的`__init__.py`的引入继续改变。

```python
...
from server import commands
from server.views.User import login, info
from srever.views.Article import title
```





## 四. 结语

至此，关于`flask_restful`的视图函数模块化结束，若有后续改进会继续分享，若大家有更好的方式请务必分享一下。

当时为了解决这个问题查了很久，但是要么是介绍blueprint的，要么就是flask_restful插件入门，简直刺激...

