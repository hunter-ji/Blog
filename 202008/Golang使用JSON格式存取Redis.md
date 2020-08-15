## 一. 前言

对于`Golang`操作`Redis`，此处使用`github.com/go-redis/redis`。



## 二. 操作

### 1. 连接redis服务器

```go
package redis

import (
	"context"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	jsoniter "github.com/json-iterator/go"
)

var ctx = context.Background()

func BaseClient() (rdb *redis.Client) {
  redisServer := "redis_server"
  port := "redis_port"
  password := "redis_password"

	rdb = redis.NewClient(&redis.Options{
		Addr:     redisServer + ":" + port,
		Password: password,
		DB:       0,
	})

	return
}


```



### 2.存储

```go
func SetJson(key string, value map[string]interface{}, expiration int) (err error) {
	rdb := BaseClient()
	valueString, _ := jsoniter.MarshalToString(value)
	err = rdb.Set(ctx, key, valueString, time.Duration(expiration)*time.Second).Err()
	return
}
```

* 调用

```go
func main() {
  value, _ := redis.SetJson("user", map[string]interface{}{
    "name": "tom",
    "age": 	12
  }),
  60,
}
```



### 3.读取

```go
func Get(key string) (value string, err error) {
	rdb := BaseClient()
	value, err = rdb.Get(ctx, key).Result()
	return
}
```

* 调用

```go
type User struct {
  Name	string
  Age		int
}

func main() {
  value, _ := redis.Get("user")
  
  var user User
  json.Unmarshal([]byte(value), &user)
  
  fmt.Print(user)
}
```



## 三. 结语

使用`JSON`格式存储与读取其实就是对目标数据在存储前和读取后进行格式转换。