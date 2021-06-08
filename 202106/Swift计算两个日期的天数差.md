## 一. 官方方法

### **DateComponents**

A date or time specified in terms of units (such as year, month, day, hour, and minute) to be evaluated in a calendar system and time zone.

以要在日历系统和时区中计算的单位（例如年、月、日、小时和分钟）指定的日期或时间。



## 二. 实现

### 1. 计算两个字符串形式的日期的天数差

```swift
func dateDiff() -> Int {
  // 计算两个日期差，返回相差天数
  let formatter = DateFormatter()
  let calendar = Calendar.current
  formatter.dateFormat = "yyyy-MM-dd"
  let today = Date()
  
  // 开始日期
  let startDate = formatter.date(from: "2021-06-08")
  
  // 结束日期
  let endDate = formatter.date(from: "2021-06-09")
  let diff:DateComponents = calendar.dateComponents([.day], from: startDate!, to: endDate!)
  return diff.day!
}
```



### 2. 计算当天跟某一天的天数差

```swift
func checkDiff() -> Int {
  // 计算两个日期差，返回相差天数
  let formatter = DateFormatter()
  let calendar = Calendar.current
  formatter.dateFormat = "yyyy-MM-dd"

  // 当天
  let today = Date()
  let startDate = formatter.date(from: formatter.string(from: today))
  
  // 固定日期
  let endDate = formatter.date(from: "2021-06-09")
  
  let diff:DateComponents = calendar.dateComponents([.day], from: startDate!, to: endDate!)
  return diff.day!
}
```

