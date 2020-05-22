## 一. 介绍

为了前后端传输数据的安全性，需要对数据进行加密。因此选定使用非对称加密，此处为`RSA`。

在传输数据前，后端生成公钥和私钥，将公钥给前端，前端加密之后，将密文传给后端，后端使用私钥解密即可得到原始的数据。



## 二. 环境

* **前端**使用`jsencrypt`加密
* **后端**使用`Crypto`生成密钥和解密



## 三. 后端生成密钥

```python
from Crypto.PublicKey import RSA

def generate_key():
    """
    生成公钥和私钥
    
    :return: 返回私钥和公钥
    """
    rsa = RSA.generate(1024)
    private_key = rsa.exportKey()
    publick_key = rsa.publickey().exportKey()
    return private_key.decode(), publick_key.decode()
```



## 四. 前端用公钥加密

```javascript
import { JSEncrypt } from "jsencrypt";

function rsa_en(pubkey, target_str) {
  /** 
  分段加密信息
  
  :params target_str: 需要加密的信息，此处为很长的信息
  :pubkey: 公钥
  :return: 存储密文的数组
  **/
  let encrypt = new JSEncrypt();
	encrypt.setPublicKey(pubkey);
	let result = encrypt.encrypt(JSON.stringify(target_str));
}
```



## 五. 后端使用私钥解密

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from Crypto.Hash import SHA
from Crypto import Random
from base64 import b64decode

def rsa_decrypt(private_key, message):
    """
    rsa解密函数

    :prams private_key: 私钥
    :params message: 加密后的密文
    :return: 解密后原始信息
    """
    dsize = SHA.digest_size
    sentinel = Random.new().read(1024 + dsize)
    private_key = RSA.import_key(private_key)
    cipher_rsa = PKCS1_v1_5.new(private_key)
    return cipher_rsa.decrypt(b64decode(message), sentinel)
```

* 这里使用`base64`先解密一遍是必要的，否则报错`ValueError: Ciphertext with incorrect length.`



## 六. 完整代码

### 前端

```javascript
import { JSEncrypt } from "jsencrypt";

function rsa_en(pubkey, target_str) {
  /** 
  分段加密信息
  
  :params target_str: 需要加密的信息，此处为很长的信息
  :pubkey: 公钥
  :return: 存储密文的数组
  **/
  let encrypt = new JSEncrypt();
	encrypt.setPublicKey(pubkey);
	let result = encrypt.encrypt(JSON.stringify(target_str));
}
```



### 后端

```python
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from Crypto.Hash import SHA
from Crypto import Random
from base64 import b64decode


def generate_key():
    """
    生成公钥和私钥

    :return: 返回私钥和公钥
    """
    rsa = RSA.generate(1024)
    private_key = rsa.exportKey()
    publick_key = rsa.publickey().exportKey()
    return private_key.decode(), publick_key.decode()


def rsa_encrypt(public_key, message):
    """
    rsa加密函数

    :params publick_key: 公钥
    :params message: 需要加密的信息
    :return: 加密后的密文
    """
    public_key = RSA.import_key(public_key)
    cipher_rsa = PKCS1_v1_5.new(public_key)
    return cipher_rsa.encrypt(str.encode(message))


def rsa_decrypt(private_key, message):
    """
    rsa解密函数

    :prams private_key: 私钥
    :params message: 加密后的密文
    :return: 解密后原始信息
    """
    dsize = SHA.digest_size
    sentinel = Random.new().read(1024 + dsize)
    private_key = RSA.import_key(private_key)
    cipher_rsa = PKCS1_v1_5.new(private_key)
    return cipher_rsa.decrypt(b64decode(message), sentinel)
```



## 七. 分段加密

`RSA`加密信息最长为`128`位，过长则会报错，因此，对于过长的信息需要分段加密，后端也要分段解密后拼装。

```javascript
import { JSEncrypt } from "jsencrypt";


function en_str(target_str, pubkey) {
  /** 
  分段加密信息
  
  :params target_str: 需要加密的信息，此处为很长的信息
  :pubkey: 公钥
  :return: 存储密文的数组
  **/
  let encrypt = new JSEncrypt();
	encrypt.setPublicKey(pubkey);
  let en_array = [];
	let n = 100; // 每段信息的长度
	for (let i = 0, l = target_str.length; i < l / n; i++) {
		let message = target_str.slice(n * i, n * (i + 1));
		en_array.push(encrypt.encrypt(message));
	}
  return en_array;
}
```

