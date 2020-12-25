## 一. 前言

为什么要用`sqlx`而不是`gorm`呢？是因为`orm`学习成本比较高，当使用`python`时候需要使用`sqlalchemy`，遇到`go`就要换成`gorm`，换成别的语言就又有其他orm。而直接使用原生`sql`可以减少学习成本，适用于所有开发语言。其次，`gorm`本身支持软删除，但是其对软删除的支持上存在缺陷，在单条查询可以过滤软删除数据，但是在多条查询时无法有效过滤，就造成了有时候要手动过滤又有时候不要手动过滤，使用体验非常差。

因此此处考虑去使用`sqlx`来直接调用原生`sql`。



## 二. 安装

```go
go get github.com/jmoiron/sqlx
```



## 三. 连接数据库

```go
package database

import (
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

func DBConnect() *sqlx.DB {
	env := os.Getenv("NODE_ENV")

	var host, port, user, password, dbname string
  // 使用环境变量来切换生产和开发环境
	if env == "production" {
		host = os.Getenv("dbHost")
		port = os.Getenv("dbPort")
		user = os.Getenv("dbUser")
		password = os.Getenv("dbPassword")
		dbname = os.Getenv("dbname")
	} else {
		host = "<your-host>"
		port = "<your-port>"
		user = "<your-user>"
		password = "<your-password>"
		dbname = "<your-db-name>"
	}

	dbConfig := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, host, port, dbname)
	db, err := sqlx.Connect("mysql", dbConfig)
	if err != nil {
		fmt.Println(err)
		panic("failed to connect database")
	}

	return db
}
```



## 四. 创建表和调用

### 1. 创建表

```sql
create table if not exists test_gin.todo
(
    todo_id    int auto_increment
        primary key,
    title      varchar(20)                          not null comment 'todo标题',
    content    varchar(200)                         null comment '内容',
    user_id    int                                  not null comment '用户id',
    created_at timestamp  default CURRENT_TIMESTAMP null comment '创建时间戳',
    updated_at timestamp  default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP comment '更新时间戳',
    is_deleted tinyint(1) default 0                 not null comment '是否被删除,0:未删,1:已删'
);
```

### 2. 创建struct

```go
type Todo struct {
	TodoID    int    `db:"todo_id" json:"todo_id,omitempty"`
	Title     string `db:"title" json:"title,omitempty"`
	Content   string `db:"content" json:"content,omitempty"`
	UserID    int    `db:"user_id" json:"user_id,omitempty"`
	CreatedAt string `db:"created_at" json:"created_at,omitempty"`
	UpdatedAt string `db:"updated_at" json:"updated_at,omitempty"`
	IsDeleted bool   `db:"is_deleted" json:"is_deleted,omitempty"`
}
```

### 3. 封装方法

此处以增删为例。封装常用方法是为了复用，封装时候使用害羞的代码。不需要为了封装而封装。

```go
// 新增Todo
func (t *Todo) Add() (todoID int, err error) {

	// 连接数据库
	db := database.DBConnect()
	defer db.Close()

	// 执行添加sql
	tx := db.MustBegin()
	result := tx.MustExec("insert into todo (title, content, user_id) value (?, ?, ?)",
		t.Title, t.Content, t.UserID)
	lastTodoID, err := result.LastInsertId()
	if err != nil {
		return
	}
	_ = tx.Commit()

	todoID = int(lastTodoID)
	return
}

// 删除Todo
func (t *Todo) Del() {

	db := database.DBConnect()
	defer db.Close()

	tx := db.MustBegin()
	tx.MustExec("update todo set is_deleted = 0 where is_deleted = 0 and todo_id = ?", t.TodoID)
	_ = tx.Commit()
}
```



## 五. 视图中使用

此处以新增接口为例。

### 1. 调用封装的方法

```go
package views

import (
	"github.com/gin-gonic/gin"
	"testGin/models"
)

// addTodo.go -- post

func AddTodo(c *gin.Context) {

	// {"title": "hello", "content": "world"}
	var requestBody struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}

	if c.ShouldBind(&requestBody) != nil {
		c.JSON(200, gin.H{
			"code":    40000,
			"message": "参数有误",
		})
		return
	}

	todo := models.Todo{
		Title:   requestBody.Title,
		Content: requestBody.Content,
		UserID:  1, // 此处的1为假数据，此处应当从上下文获取请求用户的user_id
	}
	todoID, err := todo.Add()
	if err != nil {
		c.JSON(200, gin.H{
			"code": 20001,
		})
		return
	}

	c.JSON(200, gin.H{
		"code":    20000,
		"todo_id": todoID,
	})
}
```

### 2. 直接使用

```go
package views

import (
	"github.com/gin-gonic/gin"
	"testGin/database"
)

// addTodo.go -- post

func AddTodo(c *gin.Context) {

	// {"title": "hello", "content": "world"}
	var requestBody struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}

	if c.ShouldBind(&requestBody) != nil {
		c.JSON(200, gin.H{
			"code":    40000,
			"message": "参数有误",
		})
		return
	}

	// 连接数据库
	db := database.DBConnect()
	defer db.Close()

	// 执行添加sql
	tx := db.MustBegin()
	result := tx.MustExec("insert into todo (title, content, user_id) value (?, ?, ?)",
		requestBody.Title, requestBody.Content, 1)
	lastTodoID, err := result.LastInsertId()
	if err != nil {
		c.JSON(200, gin.H{
			"code": 20001,
		})
		return
	}
	_ = tx.Commit()

	c.JSON(200, gin.H{
		"code":    20000,
		"todo_id": int(lastTodoID),
	})
}
```



