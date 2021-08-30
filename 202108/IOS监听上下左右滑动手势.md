## 一. 前言

IOS监听手势使用的方法为`UISwipeGestureRecognizer`。



## 二. 添加手势监听

```swift
let gesture = UISwipeGestureRecognizer()
gesture.addTarget(self, action: #selector(yourSelector(gesture:)))
gesture.direction = .left // .left左滑 .right右滑 .up上滑 .down下滑
self.addGestureRecognizer(gesture)
```



## 三. 添加响应事件

```swift
@objc private func leftPushEvent(){
  print("响应...")
}
```



## 四. 模板

把上面的整合起来，基本可以按照这个模板来写。

```swift
@objc private func leftPushEvent(){
  print("响应...")
}

let gesture = UISwipeGestureRecognizer()
gesture.addTarget(self, action: #selector(leftPushEvent(gesture:)))
gesture.direction = .left
self.addGestureRecognizer(gesture)
```



## 五. 参考文档

* [iOS手势识别--上下左右滑动](https://www.jianshu.com/p/30104b1c872d)