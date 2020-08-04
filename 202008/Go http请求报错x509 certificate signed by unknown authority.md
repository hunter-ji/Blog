## 报错

在Go中`POST`请求时报错

```
x509: certificate signed by unknown authority
```

即无法检验证书。

```go
package main

import (
	"net/http"
)

func Handle() {
  
  ...
  
  _, err := http.Post(
		...
  )
  
  ...
  
}
```





## 解决

跳过校验即可。此处引入`"crypto/tls"`。

```go
package main

import (
  "crypto/tls"
	"net/http"
)

func Handle() {
  
  ...
  
  tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}

	client := &http.Client{
		Timeout:   15 * time.Second,
		Transport: tr,
	}
  
  _, err := client.Post(
		...
  )
  
  ...
}
```



