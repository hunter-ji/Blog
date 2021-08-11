## 报错

在`Golang`中`json`解析时报错：

```
invalid character '\\b' after top-level value
```

代码如下：

```go
json.Unmarshal([]byte(result), &response)
```



## 分析与排错

首先将`result`打印出来，发现并无异常，其标点符号也没有问题。

然后查看网上现有解决方案的帖子基本试了下，起码对于我来说并不适用，概括下方案：

1. 遍历然后过滤，最后重组；
2. 遍历，使用SetEscapeHTML(false)禁用转义符；
3. 编码；
4. ...

最后对比代码中获取到的字符产长度和手动复制所见的字符串的长度，发现确实代码中字符长度不同，其长度是80，而手动复制的字符串的长度是72。



## 解决

```go
strings.ReplaceAll(result, "\b", "")
```

就挺简单的......