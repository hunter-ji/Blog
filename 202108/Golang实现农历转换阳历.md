## 一. 前言

因为项目需求，需要去检测用户的农历生日。虽然后来找到了合适的库，但是首先先解释下`农历`的定义，也是去了解才知道，原来农历不是阴历。

农历属于阴阳合历，其年份分为平年和闰年。平年为十二个月，闰年为十三个月。月份分为大月和小月，大月三十天，小月二十九天，其平均历月等于一个朔望月。



## 二. 环境

* Go 1.16
* github.com/nosixtools/solarlunar 0.0.0



## 三. 库

```go
github.com/nosixtools/solarlunar
```

该库支持1900~2049年。所以项目要跑到2049年后的童鞋就要注意......

当然，该库还支持阳历转农历、节假日计算等，有兴趣大家可以自行去了解下。



## 四. 使用

### 1. 判断闰年

该库不支持闰年判断，所以需要自己去实现闰年的判断，其参数类型为`Boolean`。

```go
func IsALeapYear(year int) (result bool) {
	if year%4 == 0 && year%100 != 0 || year%400 == 0 {
		result = true
		return
	}
	return
}
```



### 2. 转换

需要转换的阳历日期格式是固定的，是`2006-01-02`。此处以农历`2021-07-17`为例。

```go
func main() {
	lunarDate := "2021-07-17"
	fmt.Println(solarlunar.LunarToSolar(lunarDate, IsALeapYear(time.Now().Year())))
}
```

输出为：

```go
2021-08-24
```



## 五. 全部代码

```go
package main

import (
	"fmt"
	"time"

	"github.com/nosixtools/solarlunar"
)

func main() {
	lunarDate := "2021-07-17"
	fmt.Println(solarlunar.LunarToSolar(lunarDate, IsALeapYear(time.Now().Year())))
}

func IsALeapYear(year int) (result bool) {
	if year%4 == 0 && year%100 != 0 || year%400 == 0 {
		result = true
		return
	}
	return
}
```



