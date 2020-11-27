## 一. 前言

想要写出好的 Go 程序，单元测试是很重要的一部分。 `testing` 包为提供了编写单元测试所需的工具，写好单元测试后，可以通过 `go test` 命令运行测试。



## 二. 规则

`testing` 为 Go 语言 package 提供自动化测试的支持。通过 `go test` 命令，能够自动执行如下形式的任何函数：

```go
func TestXxx(*testing.T)
```

要编写一个新的测试套件，需要创建一个名称以 _test.go 结尾的文件，该文件包含 `TestXxx` 函数，如上所述。 将该文件放在与被测试文件相同的包中。该文件将被排除在正常的程序包之外，但在运行 `go test` 命令时将被包含。



## 三. 代码结构

```
.
├── go.mod
├── intMinBasicDriven_test.go
├── intMinBasic_test.go
└── main.go
```



## 四. 第一个单元测试

### 要被测试的代码

```go
// main.go
package main

func IntMin(a, b int) int {
  // 返回a与b中的较小值
	if a < b {
		return a
	} else {
		return b
	}
}
```



### 测试代码

```go
// intMinBasic_test.go
package main

import "testing"

func TestIntMinBasic(t *testing.T) {
	ans := IntMin(2, -2)
	if ans != -2 {
    // t.Error* 会报告测试失败的信息，然后继续运行测试。
    // t.Fail* 会报告测试失败的信息，然后立即终止测试。
		t.Errorf("IntMin(2, -2) = %d; want -2", ans)
	}
}
```



### 运行测试

```bash
go test
// 输出
ok  	heihei	0.385s
```



## 五. Table-Driven Test

单元测试可以重复，所以会经常使用 *表驱动* 风格编写单元测试， 表中列出了输入数据，预期输出，使用循环，遍历并执行测试逻辑。

```go
// intMinBasicDriven_test.go
package main

import (
    "fmt"
    "testing"
)


func TestIntMinTableDriven(t *testing.T) {
    var tests = []struct {
        a, b int
        want int
    }{
        {0, 1, 0},
        {1, 0, 0},
        {2, -2, -2},
        {0, -1, -1},
        {-1, 0, -1},
    }

    // t.Run 可以运行一个 “subtests” 子测试，一个子测试对应表中一行数据。 运行 go test -v 时，他们会分开显示。
    for _, tt := range tests {

        testname := fmt.Sprintf("%d,%d", tt.a, tt.b)
        t.Run(testname, func(t *testing.T) {
            ans := IntMin(tt.a, tt.b)
            if ans != tt.want {
                t.Errorf("got %d, want %d", ans, tt.want)
            }
        })
    }
}
```



### 运行代码

```bash
go test -v
// 输出
=== RUN   TestIntMinTableDriven
=== RUN   TestIntMinTableDriven/0,1
=== RUN   TestIntMinTableDriven/1,0
=== RUN   TestIntMinTableDriven/2,-2
=== RUN   TestIntMinTableDriven/0,-1
=== RUN   TestIntMinTableDriven/-1,0
--- PASS: TestIntMinTableDriven (0.00s)
    --- PASS: TestIntMinTableDriven/0,1 (0.00s)
    --- PASS: TestIntMinTableDriven/1,0 (0.00s)
    --- PASS: TestIntMinTableDriven/2,-2 (0.00s)
    --- PASS: TestIntMinTableDriven/0,-1 (0.00s)
    --- PASS: TestIntMinTableDriven/-1,0 (0.00s)
PASS
ok  	heihei	0.566s
```



