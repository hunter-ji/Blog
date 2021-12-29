## 一. 前言

最近在用uniapp开发小程序，需要用到canvas画海报然后再保存本地。

之前写过同样功能的[文章](https://github.com/Kuari/Blog/issues/1)，不过场景不同，之前是在web上生成海报，该场景可以使用之前文章的方法——html转canvas来实现。

但是uniapp则不同，该框架是去DOM化的，因此只能使用uniapp的官方canvas来实现。





## 二. 功能拆解

网上找到的文章，有几篇写得挺好的，展现了完整的功能。这里我把用到的几个功能拆解出来，而不用先通读整篇代码。

### 1. 创建canvas

```html
<template>
	<view>
		<canvas style="width: 300px; height: 200px;" canvas-id="firstCanvas" id="firstCanvas"></canvas>
  </view>
</template>

<script>
export default {
  onReady() {
    // 初始化
    const ctx = uni.createCanvasContext('firstCanvas')
    
    // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
    ctx.draw()
  }
}
</script>
```



### 2. 背景色

```javascript
ctx.setFillStyle('red')
ctx.fillRect(0, 0, 300, 200)
// 此处其实绘制了一个300x200的红色矩形，但是其大小跟canvas大小相同即为背景色了
```



### 3. 加载图片

#### 1）本地图片

图片直接在项目中，可以直接加载。

```javascript
ctx.drawImage("./background.png", 0, 0, 300, 200)
```

#### 2）url

此处url返回的为文件流，在uniapp中无法直接加载，需要转换成本地信息才可以使用。

有两种方式可以使用，小程序都需要添加download合法域名：

* ***uni.getImageInfo***：获取文件信息，我使用的这个方法
* ***uni.downloadFile***：下载文件

原生使用方法是这样的：

```javascript
uni.getImageInfo({
  src: url,
  success: (res) => {
    ctx.drawImage(res.path, 0, 0, 300, 200)
  }
})
```

由于js的异步问题，如果图片较大或者多个图片的情况下，会有这边还没加载完，canvas就已经绘制完了的情况，所以这里将其优化下。

```javascript
// 首先封装
const getImageInfo = (url: string): Promise<string> => {
  return new Promise((req, rej) => {
    uni.getImageInfo({
      src: url,
      success: (res) => {
        req(res.path)
      }
    })
  })
}

// 调用
const genPoster = async() => {
  const imgPath = await getImageInfo(<your-url>) // 建议所有图片在开始绘制canvas前加载好

  const ctx = uni.createCanvasContext('firstCanvas')
	ctx.drawImage(imgPath, 0, 0, 300, 200)
  ctx.draw()
}
```

#### 3）base64

如果你的图片数据是base64的，那恭喜你，依然加载不了。当然这存在的情况是，微信开发工具是没有问题的，但是上了真机之后直接无法加载了，这波是小程序的锅。

这里呢需要将图片存储然后用本地地址绘制。

原生方法：

```javascript
const fs = wx.getFileSystemManager()
let times = new Date().getTime()
let codeImg = wx.env.USER_DATA_PATH + '/' + times + '.png'
return new Promise((req, rej) => {
  fs.writeFile({
    filePath: imgPath,
    data: <your-base64-data>,
    encoding: 'base64',
    success: () => {
      ctx.drawImage(imgPath, 0, 0, 300, 200)
    }
  })
})
```

优化一波：

```javascript
// 封装
const getBase64ImageInfo = (base64Data: string): Promise<string> => {
  const fs = wx.getFileSystemManager()
  let times = new Date().getTime()
  let codeImg = wx.env.USER_DATA_PATH + '/' + times + '.png'
  return new Promise((req, rej) => {
    fs.writeFile({
      filePath: imgPath,
      data: base64Data,
      encoding: 'base64',
      success: () => {
        req(imgPath)
      }
    })
  })
}

// 调用
const genPoster = async() => {
  const imgPath = await getBase64ImageInfo(<your-base64-data>) // 建议所有图片在开始绘制canvas前加载好

  const ctx = uni.createCanvasContext('firstCanvas')
	ctx.drawImage(imgPath, 0, 0, 300, 200)
  ctx.draw()
}
```



### 4. 文字

```javascript
ctx.setFontSize(13)
ctx.font = "nomarl bold 13px Arial,sans-serif" // 加粗等功能
ctx.setFillStyle('#ffffff')
ctx.fillText("hello, world !", 16, 16)
```



### 5. 圆角矩形

想要绘制一个圆角的矩形，啊......这波就复杂了，原理就不细讲了，直接上代码，调用即可。

```javascript
const roundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
  if (width <= 0 || height <= 0) {
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    return;
  }

  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + radius, y, radius);
}

const drawRoundedRect = (strokeStyle: string, fillStyle: string, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  roundedRect(x, y, width, height, radius);
  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = fillStyle;
  ctx.stroke();
  ctx.fill();
}

// 调用
drawRoundedRect('#ffffff', '#ffffff', 16, 16, 86, 6)
```



### 6. 图片加载为圆形

基本原理是，正常加载图片，canvas画个圆给它裁剪掉，上代码！

```javascript
ctx.save()
ctx.beginPath()
ctx.arc(16, 16, 12, 0, 2 * Math.PI)
// 如果小伙伴儿调试时候感觉圆形和图片有点错位，可以开启下面两行注释代码，给圆圈加个边框
// ctx.setStrokeStyle('#AAAAAA')
// ctx.stroke()
ctx.clip()
ctx.drawImage(<your-image-path>, 16, 16, 24, 24)
ctx.restore()
```



### 7. canvas生成的海报下载

```javascript
const savePoster = () => {
  uni.showModal({
    title: '提示',
    content: '确定保存到相册吗',
    success: (response) => {
      uni.canvasToTempFilePath({
        canvasId: 'sharePoster',
        success: (response) => {
          uni.saveImageToPhotosAlbum({
            filePath: response.tempFilePath,
            success: (response) => {
              console.log(response);
              // 此处为执行成功
              // ...
            },
            fail: (response) => {
              uni.openSetting({
                success: (response) => {
                  if (!response.authSetting['scope.writePhotosAlbum']) {
                    uni.showModal({
                      title: '提示',
                      content: '获取权限成功，再次点击图片即可保存',
                      showCancel: false
                    })
                  } else {
                    uni.showModal({
                      title: '提示',
                      content: '获取权限失败，无法保存',
                      showCancel: false
                    })
                  }
                }
              })
            }
          })
        },
        fail: (response) => {
          console.log(response);
        }
      }, this);
    }
  })
}
```





## 三. 问题

### 1. 图片有时显示有时不显示

```
参照本文“二.3.加载图片”优化代码处，将加载图片全部写成同步的，在开始绘制前将图片全都加载好。
```



### 2. base64数据的图片在小程序开发工具显示，到了真机就不显示了

```
参照本文“二.3.3）base64”优化代码处，使用该方法即可。小程序canvas无法直接加载base64图片。
```



### 3. canvas整体画成圆角的

```
canvas背景是透明色，只要画个大小覆盖canvas的圆角矩形或者使用圆角背景图即可。
```

