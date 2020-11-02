## 一. 前言

当前产品遇到一个报错，就是接口收到请求没有限制请求字段长度，导致字段长度超过数据库对应字段长度，直接报了500。因此也对此有些新的需求，需要在后端限制请求字段最大长度。



## 二. 环境

* **开发语言**：Python 3.7
* **后端框架**：Flask 1.1.1
* **插件**：Flask-RESTful 0.3.8



## 三. 实现

```python
def field_max_limit(max_length):
    def validate(s):
        if type(s) != str:
            raise ValidationError("The field must be String.")

        if len(s) <= max_length:
            return s
        raise ValidationError("The field cannot exceed %i characters." % max_length)

    return validate

# 解析请求参数时候验证长度
parse.add_argument('username', type = field_max_limit(5), required = True)
```



## 四. 示例

```python
from flask import Flask
from flask_restful import Api, Resource, reqparse
from werkzeug.routing import ValidationError

app = Flask(__name__)
api = Api(app)


def field_max_limit(max_length):
    def validate(s):
        if type(s) != str:
            raise ValidationError("The field must be String.")

        if len(s) <= max_length:
            return s
        raise ValidationError("The field cannot exceed %i characters." % max_length)

    return validate


class Login(Resource):

    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('username', type = field_max_limit(5), required = True)
        parse.add_argument('password', type = field_max_limit(20), required = True)
        args = parse.parse_args()

        print({
            'username': args.username,
            'password': args.password
        })

        return {
            'code': 20000
        }


api.add_resource(Login, '/login')
```

