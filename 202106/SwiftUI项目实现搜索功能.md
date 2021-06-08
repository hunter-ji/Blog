## 一. 实现

### 1. 创建变量

```swift
@State var search: String = ""
```

### 2. 过滤

此处过滤条件为判断元素是否包含搜索的文本。

```swift
<Your-Array>.filter({"\($0)".contains(search.lowercased()) || search.isEmpty})
```



## 二. 汇总

```swift
struct DataList: View {

  @State var search: String = ""
  @Binding var dataList: [Item]

  var dataSearchFilterList: [Item] {
    dataList.filter({"\($0)".contains(search.lowercased()) || search.isEmpty})
  }

  var body: some View {
    if dataSearchFilterList.isEmpty {
      Text("搜索不到...")
    } else {
      ... // 展示搜索结果
    }
  }
  
}
```



