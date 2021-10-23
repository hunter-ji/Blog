## 一. 简介

关于测试工程师，有一个笑话，是这样的：

```
一个测试工程师走进一家酒吧，要了一杯啤酒
一个测试工程师走进一家酒吧，要了一杯咖啡
一个测试工程师走进一家酒吧，要了0.7杯啤酒
一个测试工程师走进一家酒吧，要了-1杯啤酒
一个测试工程师走进一家酒吧，要了2^32杯啤酒
一个测试工程师走进一家酒吧，要了一杯洗脚水
一个测试工程师走进一家酒吧，要了一杯蜥蜴
一个测试工程师走进一家酒吧，要了一份asdfQwer@24dg!&*(@
一个测试工程师走进一家酒吧，什么也没要
一个测试工程师走进家酒吧，又走出去又从窗户进来又从后门出去从下水道钻进来
一个测试工程师走进家酒吧，又走出去又进来又出去又进来又出去，最后在外面把老板打了一顿
一个测试工程师走进一
一个测试工程师走进一家酒吧，要了一杯烫烫烫的锟斤拷
一个测试工程师走进一家酒吧，要了NaN杯Null
1T测试工程师冲进一家酒吧，要了500T啤酒咖啡洗脚水野猫狼牙棒奶茶
1T测试工程师把酒吧拆了
一个测试工程师化装成老板走进一家酒吧，要了500杯啤酒，并且不付钱
一万个测试工程师在酒吧外呼啸而过
一个测试工程师走进一家酒吧，要了一杯啤酒‘;DROPTABLE酒吧
测试工程师们满意地离开了酒吧
```

这个笑话估计也只有开发才明白其中的笑点与心酸吧。

对于一些刚入门的开发来说，这简直就是噩梦。当初刚入门的时候我的代码也是很多毛病，经不起这样的测试，后来渐渐地经验多了后，代码的健壮性逐渐提升，也明白其中比较重要的就是参数的校验。

参数的使用有通过协议的接口调用（如http、rpc......）、函数调用、库调用等等方式。

其实对于http api的请求来说，现在很多web框架都已经自带了参数校验的功能，基本用起来都挺爽的，也无需多讲。

而对于函数调用这样的常见方式，很多是要靠开发自己去校验参数的。如果仅仅是靠注释，在团队开发过程中，难免会有问题产生。起码我觉得，永远不要相信传过来的参数！

OK，那么来讲讲这次的题目，就是Golang中的参数校验库——validator。

用过Gin的小伙伴儿应该知道其`binding`参数验证器非常好用，其就是调用了validator。此处呢我们来介绍下validator的基础用法，和在一般场景下的应用案例。



## 二. 基础用法

### 1. 介绍

`validator`包源码在[github.com/go-playground/validator](https://github.com/go-playground/validator)。其基于标记实现结构和单个字段的值验证，包含如下关键功能：

* 使用验证标记或自定义验证程序进行跨字段和跨结构验证
* Slice、Array和Map都可以允许验证多维字段的任何或者所有级别
* 能够深入查看映射键和值以进行验证
* 通过在验证之前确定类型接口的基础类型来处理类型接口
* 处理自定义字段类型
* 允许将多个验证映射到单个标记，以便在结构上更轻松地定义验证
* 提取自定义定义的字段名，例如，可以指定在验证时提取JSON名称，并使其在结果FieldError中可用
* 可定制的i18n错误消息
* gin web框架的默认验证器



### 2. 安装

```bash
go get github.com/go-playground/validator/v10
```



### 3. 导入

```go
import "github.com/go-playground/validator/v10"
```



### 4. 验证规则

此处从官方列举的各个类别中挑选部分举例说明。

#### 1）比较

* **eq**：相等
* **gt**：大于
* **gte**：大于等于
* **lt**：小于
* **lte**：小于等于
* **ne**：不等于

#### 2）字段

此处的字段大部分可以理解为上面的比较的tag跟`field`拼接而成，而中间有`cs`的tag为跨struct比较。

* **eqfield**(=Field)：必须等于Field的值
* **nefield**(=Field)：必须不等于Field的值
* **gtfield**(=Field)：必须大于Field的值
* **eqcsfield**(=Other.Field)：必须等于struct Other中的Field的值

#### 3）网络

* **ip**：网络协议地址IP
* **ip4_addr**：网络协议地址IPv4
* **mac**：mac地址
* **url**：url

#### 4）字符

* **ascii**：ASCII
* **boolean**：Boolean
* **endswith**： 以...结尾
* **contains**：包含
* **uppercase**：大写

#### 5）格式

* **base64**：Base64字符串
* **base64url**：Base64url字符串
* **email**：邮箱字符串
* **json**：JSON
* **jwt**：JSON Web Token
* **latitude**：纬度

#### 6）其它

* **len**：长度
* **max**：最大值
* **min**：最小值
* **required**：字段为必须，不可空

#### 7）别名

* **iscolor**：hexcolor|rgb|rgba|hsl|hsla
* **country_code**：iso3166_1_alpha2|iso3166_1_alpha3|iso3166_1_alpha_numeric



## 三. 案例

### 1. 简单验证

```go
package main

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type User struct {
	Name           string  `validate:"required,lte=10"`                         // 姓名 非空，长度小于等于10
	Age            int     `validate:"required,gte=18,lte=50"`                  // 年龄 非空，数字大于等于18，小于等于50
	Email          string  `validate:"required,email"`                          // 邮箱 非空，格式为email
	FavouriteColor string  `validate:"iscolor"`                                 // 喜欢的颜色 hexcolor|rgb|rgba|hsl|hsla的别名
	Password       string  `validate:"required,gte=16,lte=22"`                  // 密码 非空，长度大于等于16，小于等于22
	RePassword     string  `validate:"required,gte=16,lte=22,eqfield=Password"` // 确认密码 非空，长度大于等于16，小于等于22，必须和字段Password相同
	Hobbies        []Hobby `validate:"lte=5"`                                   // 多个爱好 长度小于等于5
}

type Hobby struct {
	Name string `validate:"lte=50"` // 爱好名称 长度小于等于50
}

var validate *validator.Validate

func main() {

	validate = validator.New()

	// 该函数验证struct
	// 不会报错
	validateStruct()

	// 该函数单度验证字段
	// 会报错
	validateVariable()

}

func validateStruct() {

	hobby := Hobby{
		Name: "划水",
	}

	user := User{
		Name:           "张三",
		Age:            48,
		Email:          "kuari@justmylife.cc",
		FavouriteColor: "#ffffff",
		Password:       "1234567890123456",
		RePassword:     "1234567890123456",
		Hobbies:        []Hobby{hobby},
	}

	err := validate.Struct(user)
	if err != nil {
		fmt.Println(err)
	}

}

func validateVariable() {

	email := "kuari.justmylife.cc" // 此处邮箱地址格式写的是错误的，会导致报错
	err := validate.Var(email, "required,email")
	if err != nil {
		fmt.Println(err)
	}

}
```

### 2. 自定义验证

自定义验证可以自己创建一个校验的函数：

```go
// 注册校验函数
func ValidateMyVal(fl validator.FieldLevel) bool {
	return fl.Field().String() == "hello,world!"
}
```

然后将其注册到validate上即可：

```go
validate = validator.New()
validate.RegisterValidation("is-hello", ValidateMyVal)

s := "hello,kuari" // 跟校验函数中的字符串不同，因此此处会报错
err := validate.Var(s, "is-hello")
if err != nil {
  fmt.Println(err)
}
```

自定义校验可以满足开发过程中的特殊场景，通过制定规范的校验标准，可以推进团队的协作和开发效率。



## 四. 最后

至此便是对于`validator`的介绍了。本文篇幅较短，管中窥豹而已，基本可以满足简单场景的使用。以及本文的案例也是基于官方的案例改的，让其稍微接地气点。若有兴趣的小伙伴还是建议去完整看一下官方的文档和案例，多样的用法可以满足多样的场景，在满足代码的健壮性的同时也能确保代码的优美。



## 五. 参考文档

* [go-playground/validator](https://github.com/go-playground/validator)