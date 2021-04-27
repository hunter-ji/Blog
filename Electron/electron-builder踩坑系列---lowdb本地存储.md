## 简述

`electron`应用在开发中，需要存储数据到本地，经历了两个版本，其方案都不太一样。

一开始考虑使用cookie，在开发过程中没有任何问题，但是编译之后去使用，发现无法操作cookie。原来在开发中直接js操作的的浏览器的cookie，而在electron中需要交由底层的nodejs去操作本地的cookie，[官方](https://www.electronjs.org/docs/api/cookies)说法是通过`Session`的`cookies`属性来访问`Cookies`的实例。但是我在实践过程中确实没有成功，然后随着需求变化，数据量变大，就直接放弃了这个方案。

当时用的`electron`版本是`9.0.0`，之后才用的方案是直接文件存储，即直接`fs`读与写，毫无问题。就是注意配置文件的存放位置。

现在再去使用`electron`，版本已经到了`11.0.0`。当我去使用`fs`读写时直接给我报错`fs.writeFile is not a function`，经过一天多的排错和查找，最终放弃该方案，当然我并没有找到原因和解决方案。最后决定使用`lowdb`去实现存储。



## 官方文档

### Github仓库

[https://github.com/typicode/lowdb](https://github.com/typicode/lowdb)

### 官方介绍

Small JSON database for Node, Electron and the browser. Powered by Lodash. ⚡



## 实现

### 安装

```bash
npm install lowdb
```

### 增删改查实例

```javascript
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// 默认初始化配置文件中
db.defaults({ posts: [], user: {}, count: 0 })
  .write()

// 增
db.get('posts')
  .push({ id: 1, title: 'lowdb is awesome'})
  .write()

// 删
db.get('posts')
  .remove({ title: 'low!' })
  .write()

// 改
db.set('user.name', 'typicode')
  .write()

// 查
db.get('posts[0].title')
  .value()
```

### 加密

比较重要的是，`lowdb`本身支持对于配置文件的加密，但是需要自己去实现写加解密的函数。

```javascript
const adapter = new FileSync('db.json', {
  serialize: (data) => encrypt(JSON.stringify(data)),
  deserialize: (data) => JSON.parse(decrypt(data))
})
```

如下加解密方式可以参考下：

```javascript
const algorithm = "aes-256-ctr";
const ENCRYPTION_KEY = "<ENCRYPTION_KEY>"

const IV_LENGTH = 16;

// 加密
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// 解密
function decrypt(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

