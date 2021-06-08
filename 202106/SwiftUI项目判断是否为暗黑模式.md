## 一. 实现

```swift
@Environment(\.colorScheme) var colorScheme

var isLigth: Bool {
  colorScheme == .light
}
```



## 二. 调用

```swift
Text("Hello, World !")
	.foregroundColor(isLigth ? Color.red : Color.green)
```



## 三. 完整例子

```swift
import SwiftUI

struct CheckIsLight: View {
    
    @Environment(\.colorScheme) var colorScheme

    var isLigth: Bool {
      colorScheme == .light
    }
    
    var body: some View {
        Text("Hello, World !")
            .foregroundColor(isLigth ? Color.red : Color.green) // 此处使用isLght实现根据暗黑模式切换字体颜色
    }
}

struct CheckIsLight_Previews: PreviewProvider {
    static var previews: some View {
        CheckIsLight()
    }
}
```

