## 一. 前言

这是个比较坑的问题，我一开始开发的是macos项目，到网上搜的方案基本都是使用`UIPasteboard`方法，但是偏偏用不了。

后来开发ios项目，用macos的就不行，发现`UIPasteboard`的可行，所以这里需要清楚的是，ios和macos的复制方法是不同的......



## 二. MacOS

### 1. 实现

```swift
func copyToClipBoard(textToCopy: String) {
  let pasteBoard = NSPasteboard.general
  pasteBoard.clearContents()
  pasteBoard.setString(textToCopy, forType: .string)
}
```

### 2. 调用

```swift
copyToClipBoard(textToCopy: "Hello,World!")
```



## 三. IOS

### 1. 实现

```swift
UIPasteboard.general.setValue(<Your-String>, forPasteboardType: kUTTypePlainText as String)
```

### 2. 调用

```swift
UIPasteboard.general.setValue("Hello,World!", forPasteboardType: kUTTypePlainText as String)
```

