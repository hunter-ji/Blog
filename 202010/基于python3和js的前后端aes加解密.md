## 一. 简述

在特定敏感数据的场景需要加密，一开始采用`rsa`加密，但是`rsa`加密对性能要求较高，在解密时候对于数据量限制较大，导致加密传输的数据量上限较低。而采用`Base64`虽然简单明了但是解密过于简单。因此采用折中的对称加密`aes`。

而`aes`加密需要前后端加密类型相同，因此此处采用`CTR`，其对加密文本没有长度限制。



## 二. 前端实现

```javascript
let crypto = require("crypto")

export function aesEncrypted(key, text) {
  let iv = Buffer.concat([ crypto.randomBytes(12), Buffer.alloc(4, 0) ])
  let cipher = crypto.createCipheriv("aes-128-ctr", key, iv)
  return iv.toString('hex') + cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
}
```



## 三. 后端实现

```python
def aesDecryption(key_: str, de_text: str) -> str:
    """
    aes解密函数
    :param key_: aes的key
    :param de_text: aes加密的密文
    :return: 解密的文本
    """
    ct = codecs.decode(de_text.encode(), 'hex')
    counter = Counter.new(32, prefix = ct[:12], initial_value = 0)
    cipher = AES.new(key_.encode(), AES.MODE_CTR, counter = counter)
    return cipher.decrypt(ct[16:]).decode()
```



## 四. 示例代码

### 前端

```javascript
let crypto = require("crypto")

export function aesEncrypted(key, text) {
  let iv = Buffer.concat([ crypto.randomBytes(12), Buffer.alloc(4, 0) ])
  let cipher = crypto.createCipheriv("aes-128-ctr", key, iv)
  return iv.toString('hex') + cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
}
```



### 后端

```python
from base64 import b64encode
from Crypto.Cipher import AES
from Crypto.Util import Counter
from random import randint
import codecs
import hashlib


def convert_to_md5(info: str) -> str:
    """
    md5加密
    :param info: 需要加密的内容
    :return: md5加密密文
    """
    md5 = hashlib.md5()
    md5.update(info.encode('utf-8'))
    return md5.hexdigest()


def aesCreateKey() -> str:
    """
    生成aes加密的key，key的长度必须16位
    :return: 返回key的base64密文
    """
    en_key = convert_to_md5(str(randint(100000, 999999)))[8:-8]
    return b64encode(en_key.encode()).decode()


def aesDecryption(key_: str, de_text: str) -> str:
    """
    aes解密函数
    :param key_: aes的key
    :param de_text: aes加密的密文
    :return: 解密的文本
    """
    ct = codecs.decode(de_text.encode(), 'hex')
    counter = Counter.new(32, prefix = ct[:12], initial_value = 0)
    cipher = AES.new(key_.encode(), AES.MODE_CTR, counter = counter)
    return cipher.decrypt(ct[16:]).decode()
```



## 五. 参考文档

* https://stackoverflow.com/questions/44996742/encrypt-with-node-js-aes-ctr-and-decrypt-with-pycrypto