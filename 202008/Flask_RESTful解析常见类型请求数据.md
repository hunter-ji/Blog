## 一. 前言

`Flask_RESTful`是一个Flask 扩展，它添加了快速构建 REST APIs 的支持。其请求解析接口是模仿 `argparse` 接口。它设计成提供简单并且统一的访问 Flask 中 `flask.request` 对象里的任何变量的入口。

<br />

## 二. 常见类型解析

### 1. 基本参数

* 请求

```json
{
  "username": "kuari",
  "info": "heihei"
}
```

* 解析

```python
parse = reqparse.RequestParser()
parse.add_argument('username', type = str)
parse.add_argument('info', type = str)
args = parse.parse_args()
```

<br />

### 2. 必选参数

使用参数`required`。

* 请求

```json
{
  "username": "kuari",
  "info": "heihei"
}
```

* 解析

```python
parse = reqparse.RequestParser()
parse.add_argument('username', type = str, required = True)
parse.add_argument('info', type = str, required = True)
args = parse.parse_args()
```

<br />

### 3. 列表[string]

使用参数`action = 'append'`

* 请求

```json
{
  "username": "kuari",
  "info": [
    "handsome", "cheerful", "optimism"
  ]
}
```

* 解析

```python
parse = reqparse.RequestParser()
parse.add_argument('username', type = str, required = True)
parse.add_argument('info', type = str, action = 'append', required = True)
args = parse.parse_args()
```

<br />

### 4. 列表[dict]

使用参数`action = 'append'`

* 请求

```json
{
  "username": "kuari",
  "friends": [
    {
      "username": "tom",
      "age": 20
    },
    {
      "username": "jerry",
      "age": 20
    }
  ]
}
```

* 解析

```python
parse = reqparse.RequestParser()
parse.add_argument('username', type = str, required = True)
parse.add_argument('info', type = dict, action = 'append', required = True)
args = parse.parse_args()
```

<br />

### 5. JSON

* 请求

```json
{
  "username": "kuari",
  "info": {
    "character": "optimism",
    "age": 20
  }
}
```

* 解析

```python
parse = reqparse.RequestParser()
parse.add_argument('username', type = str, required = True)
parse.add_argument('info', type = dict, required = True)
args = parse.parse_args()
```

