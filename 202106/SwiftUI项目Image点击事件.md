## 一. 前言

swiftui中的点击可以有两种情况：

* Button
* Gestures

根据不同情况可以去不同地使用。



## 二. 单纯的按钮

此处单纯的按钮即为有按钮样式和点击事件。

```swift
Button(action: {
  ... // 点击事件触发的代码
}, label: {
	Image(systemName: "plus")
})
```



## 三. 无样式的按钮

即为没有按钮样式的按钮，方便直接展示`Image`。

```swift
Button(action: {
  ... // 点击事件触发的代码
}, label: {
	Image(systemName: "plus")
})
.buttonStyle(BorderlessButtonStyle())
```



## 四. TapGesture事件

```swift
Image(systemName: "plus")
  .onTapGesture {
    ... // 点击事件触发的代码
  }
```

