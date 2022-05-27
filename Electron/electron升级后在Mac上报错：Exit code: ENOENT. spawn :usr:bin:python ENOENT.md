## 报错

`electron`升级到当前最新版（13.0.0），却在mac上打包时报错，报错内容如下：

```
Exit code: ENOENT. spawn /usr/bin/python ENOENT
```



## 环境

* **macOS**: 12.3.1
* **electron**: `13.0.0`
* **electron-builder**: `23.0.3`
* **vue-cli-plugin-electron-builder**: `2.1.1`



## 解决

在`package.json`中添加如下：

```json
{
  // ...
  "resolutions": {
    "vue-cli-plugin-electron-builder/electron-builder": "^23.0.3"
  }
  // ...
}
```

 该问题是由于mac系统升级后默认`python`命令是指向`python3`的，但是`vue-cli-plugin-electron-builder`是要求`python2`的，但是`electron-builder`是支持的，所以此处指定其使用`electron-builder v23.0.3`版本。

网上还有另一种解决方案就是将`python`重新指向`python2`，这种方案对于系统来说侵入性太强。我也考虑过起一个python2的docker continer然后临时指向，但是这样每次写代码还要设置下环境就很麻烦。

总体来说，还是觉得当前这个方案最方便了。



## 参考文档

* [macOS 12.3 (21E230) Exit code: ENOENT. spawn /usr/bin/python ENOENT](https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/1701)
* [Selective dependency resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/)

