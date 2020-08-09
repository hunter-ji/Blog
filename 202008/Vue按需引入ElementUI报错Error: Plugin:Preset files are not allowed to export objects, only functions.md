## 报错

按照ElementUI官方文档按需引入却报错，首先报错缺少`babel-preset-es2015`。安装该组件之后编译却报错。

```bash
Error: Plugin/Preset files are not allowed to export objects, only functions.
```



## 解决

该问题为`babel`版本冲突。

### 1. 安装插件

```bash
yarn add @babel/preset-env 
```

### 2. 编辑`.babelrc`

```javascript
{  
	"presets": [["@babel/preset-env", { "modules": false }]],
    "plugins": [
      [
        "component",
        {
          "libraryName": "element-ui",
          "styleLibraryName": "theme-chalk"
        }
      ]
    ]
}
```

