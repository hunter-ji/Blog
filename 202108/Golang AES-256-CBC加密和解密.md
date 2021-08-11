## 一. 前言

项目开发中遇到该问题，网上的文章太乱，为了节省下次踩坑时间，特此记录。



## 二. 加解密

### 1. 填充函数

该函数在加解密中都需要用到。

```go
func PKCS5Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(ciphertext, padText...)
}
```



### 2. 加密

```go
func Ase256Encrypt(plaintext string, key string, iv string, blockSize int) string {
	bKey := []byte(key)
	bIV := []byte(iv)
	bPlaintext := PKCS5Padding([]byte(plaintext), blockSize)
	block, _ := aes.NewCipher(bKey)
	ciphertext := make([]byte, len(bPlaintext))
	mode := cipher.NewCBCEncrypter(block, bIV)
	mode.CryptBlocks(ciphertext, bPlaintext)

	return base64.StdEncoding.EncodeToString(ciphertext)
}
```



### 3. 解密

```go
func Aes256Decrypt(cryptData, key, iv string) ([]byte, error) {
	ciphertext, err := base64.StdEncoding.DecodeString(cryptData)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return nil, err
	}

	if len(ciphertext)%aes.BlockSize != 0 {
		err = errors.New("ciphertext is not a multiple of the block size")
		return nil, err
	}

	mode := cipher.NewCBCDecrypter(block, []byte(iv))
	mode.CryptBlocks(ciphertext, ciphertext)

	return ciphertext, err
}
```



### 4. 全部代码

```go
// 填充
func PKCS5Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(ciphertext, padText...)
}

// 加密
func Ase256(plaintext string, key string, iv string, blockSize int) string {
	bKey := []byte(key)
	bIV := []byte(iv)
	bPlaintext := PKCS5Padding([]byte(plaintext), blockSize)
	block, _ := aes.NewCipher(bKey)
	ciphertext := make([]byte, len(bPlaintext))
	mode := cipher.NewCBCEncrypter(block, bIV)
	mode.CryptBlocks(ciphertext, bPlaintext)

	return base64.StdEncoding.EncodeToString(ciphertext)
}

// 解密
func Aes256Decrypt(cryptData, key, iv string) ([]byte, error) {
	ciphertext, err := base64.StdEncoding.DecodeString(cryptData)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher([]byte(key))
	if err != nil {
		return nil, err
	}

	if len(ciphertext)%aes.BlockSize != 0 {
		err = errors.New("ciphertext is not a multiple of the block size")
		return nil, err
	}

	mode := cipher.NewCBCDecrypter(block, []byte(iv))
	mode.CryptBlocks(ciphertext, ciphertext)

	return ciphertext, err
}
```



## 三. 调用

### 1. 加密

```go
result := Ase256Encrypt("<需要加密的数据>", "<key>", "<iv>", aes.BlockSize)
```



### 2. 解密

```go
result, err := Aes256Decrypt("<需要解密的数据>", "<key>", "<iv>")
```

