## 问题

使用`Alert`时，将其用在`list`的循环视图元素中，弹出`Alert`时，一定时长不选择就会在点击后弹出第二次。

这里提一下就是之前在网上看到一个帖子说他将`Alert`放在`NavigationView`上也会出现该问题。

```swift
        VStask {
            ForEach(items, id: \.self) { item in
                ElementView(item: item) // 循环中的元素
                    .alert(isPresented: $showAlert) {
                        Alert(
                            title: Text("删除确认"),
                            message: Text("请问您确认删除该数据吗？"),
                            primaryButton: .default(
                                Text("取消"),
                                action: {
                                    showAlert = false
                                }
                            ),
                            secondaryButton: .destructive(
                                Text("删除"),
                                action: {
                                    deleteItems(offsets: [index])
                                })
                        )
                    }
            }
        }
        
```



## 解决

将`Alert`放到循环之前的元素上，比如`VStack`、`List`。



## 参考

* [参考帖子](https://www.reddit.com/r/swift/comments/oahztb/swiftui_alert_showing_twice_despite_only_setting/)



