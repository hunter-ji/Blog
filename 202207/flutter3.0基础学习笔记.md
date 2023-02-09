### 本地图片加载

#### 1. 创建images文件夹

在`lib`下创建文件夹`images`，然后放入图片，举例此处放入一张`test.png`图片文件。

#### 2. 修改assets配置

在`pubspec.yaml`文件中，在`flutter`下添加如下内容：

```yaml
assets:
  - lib/images/test.png
```

其实可以看到在`pubspec.yaml`文件中，`flutter`下有相关注释说明：

```yaml
# To add assets to your application, add an assets section, like this:
# assets:
#   - images/a_dot_burr.jpeg
#   - images/a_dot_ham.jpeg
```

#### 3. 代码中使用

代码有两种写法：

```dart
Image.asset('lib/images/test.png', width: 100, height: 100)

const Image.asset('lib/images/test.png', width: 100, height: 100)
```



### padding

#### 四周

四周，即上、下、左、右四个方向，统一设置内边距。

```dart
padding: const EdgeInsets.all(<数值>)
```

举例：

```dart
Container(
  padding: const EdgeInsets.all(20), // 此行设置
  child: ...
)
```



#### 上下、左右

上下数值一致，左右数值一致。

* ***vertical***: 上下
* ***horizontal***: 左右

```dart
EdgeInsets.symmetric(vertical: <数值>, horizontal: <数值>})
```

举例：

```dart
Container(
  padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
  child: ...
)
```

```dart
Container(
  padding: const EdgeInsets.symmetric(vertical: 20.5),
  child: ...
),
```



#### 上、下、左、右

单独设置上、下、左、右方向的数值。

此处分为两个方法，一个是参数个数可选，参数带默认参数`0.0`，另一个是四个参数不带默认参数，都是必要参数。

首先是可选参数方法：

```dart
EdgeInsets.only(top: <数值>, left: <数值>, right: <数值>, bottom: <数值>)
```

举例：

```dart
Container(
  padding: const EdgeInsets.only(top: 10, left: 11, right: 12, bottom: 20),
  child: ...
)
```

```dart
Container(
  padding: const EdgeInsets.only(top: 10, bottom: 20),
  child: ...
)
```

```dart
Container(
  padding: const EdgeInsets.only(top: 10),
  child: ...
)
```

其次是必选参数方法：

```dart
EdgeInsets.fromLTRB(<left数值>, <top数值>, <right数值>, <bottom数值>)
```

举例:

```dart
Container(
  padding: const EdgeInsets.fromLTRB(10, 11, 12, 13),
  child: ...
)
```

