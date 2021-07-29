## 问题描述

使用`electron`开发的windows桌面应用程序，在调用目标文件夹底下的exe执行文件时，开发机子上没有问题，但是其他机子使用时一直调用失败，也抓取不到日志。

```javascript
spawn(path.join(remote.app.getAppPath(), "../target.exe"), [], {
  shell: true,
  detached: false,
  windowsHide: true
});
```



## 原因

**路径存在空格。**

也是经过各种原因排查，然后一次偶然的成功才注意到了路径问题，排查之后发现确实是这问题......



## 解决

`spawn`按照如上我的代码一定条件下可以运行，其有一个参数`cwd`，用来表明运行目录。`spawn`第一个参数必须是命令的名字，不能是路径。

所以如上代码改成这样：

```javascript
spawn("target.exe", [], { // 此处直接写目标exe文件
  cwd: path.join(remote.app.getAppPath(), "../"), // 注意这里，使用了cwd参数来写运行目录
  shell: true,
  detached: false,
  windowsHide: true
});
```



## 参考文档

* [node child_process.spawn not working with spaces in path on windows](https://stackoverflow.com/questions/21356372/node-child-process-spawn-not-working-with-spaces-in-path-on-windows)