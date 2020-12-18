## 一. 前言

`gin`的中间件的使用场景非常广泛，此处主要介绍如何使用其来完成常见场景下的鉴权。



## 二. 官方文档

官方文档列出了如下几种使用方式：

* [使用中间件](https://github.com/gin-gonic/gin#using-middleware)
* [定制中间件](https://github.com/gin-gonic/gin#custom-middleware)
* [使用基础认证的中间件](https://github.com/gin-gonic/gin#using-basicauth-middleware)
* [中间件使用协程](https://github.com/gin-gonic/gin#goroutines-inside-a-middleware)



## 三. 不同场景的鉴权实现

### 1. api key

对于`api key`的方式需要设置白名单，对白名单外的请求进行`token`检测。此中间件在处理请求被处理之前对请求进行拦截，验证token，因此可在此处利用`gin.Context`来设置上下文，如请求所属用户的用户信息等。

```go
package middleware

import (
	"fmt"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

// 白名单
func whiteList() map[string]string {
	return map[string]string{
		"/ping": "GET",
	}
}

// 检测是否在白名单中
func withinWhiteList(url *url.URL, method string) bool {
	target := whiteList()
	queryUrl := strings.Split(fmt.Sprint(url), "?")[0]
	if _, ok := target[queryUrl]; ok {
		if target[queryUrl] == method {
			return true
		}
		return false
	}
	return false
}

func Authorize() gin.HandlerFunc {
	return func(c *gin.Context) {

		type QueryToken struct {
			Token string `binding:"required,len=3" form:"token"`
		}

		// 当路由不在白名单内时进行token检测
		if !withinWhiteList(c.Request.URL, c.Request.Method) {
			var queryToken QueryToken
			if c.ShouldBindQuery(&queryToken) != nil {
				c.AbortWithStatusJSON(200, gin.H{
					"code": 40001,
				})
				return
			}
      
      // 为了下个场景(路由权限)设置用户角色
      // c.Set("role", "admin")
      
		}

		c.Next()
	}
}
```



### 2. 路由权限

#### 1）说明

对于请求的处理，需要去验证是否对其请求的路径拥有访问权限。

首先看一下`gin`的路由设置：

```go
func (group *RouterGroup) POST(relativePath string, handlers ...HandlerFunc) IRoutes
```

其参数为`...HandlerFunc`，其解释为：

```go
type HandlerFunc func(*Context)
HandlerFunc defines the handler used by gin middleware as return value.
```

所以此处可以通过定制中间件的方式实现一个路由权限处理。

当然此处的权限处理比较简单，使用角色直接去判断权限。如分为两个角色，管理员`admin`和普通用户`user`。

不过此处实现有个前提条件，就是如何拿到用户的角色呢？此处需要在上一步（`api key`）的实现中加上利用`gin.Context`设置角色：

```go
c.Set("role", "admin") // 可见上一步的代码，当然此处只是为了演示设置固定值
```

然后在中间件中拿到角色并进行判断。



#### 2）路由权限中间件

```go
package middleware

import (
	"errors"
	"fmt"

	"github.com/gin-gonic/gin"
)

func Permissions(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {

		permissionsErr := func() error {

			// 获取上下文中的用户角色
			roleValue, exists := c.Get("role")
			if !exists {
				return errors.New("获取用户信息失败")
			}
			role := fmt.Sprint(roleValue)

			// 判断请求的用户的角色是否属于设定角色
			noAccess := true
			for i := 0; i < len(roles); i++ {
				if role == roles[i] {
					noAccess = false
				}
			}
			if noAccess {
				return errors.New("权限不够")
			}

			return nil

		}()
		if permissionsErr != nil {
			c.AbortWithStatusJSON(200, gin.H{
				"code": 40001,
			})
			return
		}

		c.Next()
	}
}
```



#### 3）使用

在设置路由时候，添加该中间件，并设置白名单。

```go
r.POST("/todo", middleware.Permissions([]string{"admin"}), views.AddTodo) // 添加中间件将会验证角色
r.PUT("/todo", views.ModifyTodo) // 未添加中间件则不会验证角色
```

