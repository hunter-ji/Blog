## 一. 代码实现

### 1. 获取屏幕对象

```swift
var window = NSScreen.main?.visibleFrame
```

### 2. 设置大小

```swift
HStack {
  
}
.frame(width: window!.width / 2.0, height: window!.height / 1.5)
```



## 二. 汇总

```swift
struct Home: View {

	var window = NSScreen.main?.visibleFrame
  
  var body: some View {
    HStack {
      Text("Hello, World!")
    }
    .frame(width: window!.width / 2.0, height: window!.height / 1.5)
  }
}
```

