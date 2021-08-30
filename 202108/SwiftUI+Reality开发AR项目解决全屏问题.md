## 环境

* Swift 5.4
* Xcode 12.5.1



## 问题

在使用`Swift UI`和`Realiy`开发AR项目时，发现摄像头一直是居中的，无法全屏。



## 解决

### 1. 创建`LaunchScreen.storyboard`文件

在左侧文件列表中新建文件，名为`LaunchScreen.storyboard`。

### 2. 设置`Launch Screen File`

点击左侧文件列表中你的项目文件（最顶级文件），进入文件`[your-project].xcodeproj`文件。

在`General`中，找到`App Icons and Launch Images`，在其模块中有`Launch Screen File`选项，点击选择为`LaunchScreen.storyboard`。

总结下就是：`[yourTarget] -> General -> App Icons and Launch Images`。



## 参考文档

* [How to make SwiftUI view fullscreen?](https://stackoverflow.com/questions/56733642/how-to-make-swiftui-view-fullscreen)

