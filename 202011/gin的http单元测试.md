## 一. 前言

Go 标准库专门提供了 `net/http/httptest` 包专门用于进行 http Web 开发测试。

此处基于gin来实现http的单元测试。



## 二. GET请求

此处使用http单元测试对`/ping`请求测试，其正常会返回字符串`pong`，响应码为`200`。

### web应用

```go
package main

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	return r
}

func main() {
	r := setupRouter()
	r.Run(":8080")
}
```

### http单元测试

```go
package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPingRoute(t *testing.T) {
	router := setupRouter()

  // 创建http server并发起请求
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code) // 断言响应码为200
	assert.Equal(t, "pong", w.Body.String()) // 断言响应为"pong"
}
```



## 三. POST/PUT/DELETE请求

post、put、delete请求处理相似，都是处理其request body，因此此处只以post为例。

此处对`/todo`进行测试，其正常返回为`json`，其中`code`为`20000`，响应码为`200`。

### web应用

```go
package main

func setupRouter() *gin.Engine {
	r := gin.Default()
	r.POST("/todo", func(c *gin.Context) {
		type ToDo struct {
		TodoId int `binding:"required" json:"todo_id"`
    }

    var todo ToDo
    if err := c.ShouldBindJSON(&todo); err != nil {
      c.JSON(400, gin.H{
        "message": "参数不全",
      })
      return
    }
    
    // 处理代码，此处以打印为例，省略处理...
    fmt.Println(todo.TodoId)
    
    c.JSON(200, gin.H{
			"code": 20000,
		})
    
	})
	return r
}

func main() {
	r := setupRouter()
	r.Run(":8080")
}
```

### http单元测试

```go
package main

func TestTodoCreate(t *testing.T) {
  
  // 请求方法
	method := "POST"
  // 请求路由
	urlStr := "/todo"
	// request body
	body := map[string]interface{}{
		"title": "hello",
	}

	jsonByte, _ := json.Marshal(body)
	req := httptest.NewRequest(method, tc.urlStr, bytes.NewReader(jsonByte))
	w := httptest.NewRecorder()
	router := routers.SetupRouter()
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code) // 判断响应码

	var response map[string]int
	json.Unmarshal([]byte(w.Body.String()), &response)

	value, exits := response["code"]
	assert.True(t, exits)
	assert.Equal(t, 20000, value) // 判断自定义状态码
}
```



## 四. 封装测试请求

由于http单元测试代码中存在较多重复，因此此处封装重复代码。

```go
package tests

type TestConfig struct {
	Url    string
	Method string
	Body   interface{}
}

func (tc *TestConfig) Request() *httptest.ResponseRecorder {

	var req *http.Request
	if tc.Body != nil {
		jsonByte, _ := json.Marshal(tc.Body)
		req = httptest.NewRequest(tc.Method, tc.Url, bytes.NewReader(jsonByte))
	} else {
		req = httptest.NewRequest(tc.Method, tc.Url, nil)
	}

	w := httptest.NewRecorder()
	router := routers.SetupRouter()
	router.ServeHTTP(w, req)
	return w
}
```



## 五. 封装后的单元测试

此处以post请求为例。

```go
package main

func TestAddTag(t *testing.T) {
	// 新增tag
	var addTestConfig tests.TestConfig
	addTestConfig.Method = "POST"
	addTestConfig.Url = "/tag"
	addTestConfig.Body = map[string]string{
		"tag_name": "HelloHello",
	}

	w := addTestConfig.Request()
	assert.Equal(t, 200, w.Code)

	var addResponse map[string]int
	json.Unmarshal([]byte(w.Body.String()), &addResponse)

	value, exits := addResponse["code"]
	assert.True(t, exits)
	assert.Equal(t, 20000, value)

	lastInsertTagId, exits := addResponse["tag_id"]
	assert.True(t, exits)
}
```

