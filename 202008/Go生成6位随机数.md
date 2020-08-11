```go
package main

import (
  "math/rand"
	"strconv"
)

func CreateVerifyCode() (verifyCode string) {
	min := 100000
	max := 999999
	verifyCode = strconv.Itoa(rand.Intn(max-min) + min)
	return
}
```

