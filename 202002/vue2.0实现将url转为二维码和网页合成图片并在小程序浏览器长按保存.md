## 一. url转为二维码

### 1. 需要的库

[qrcodejs2](https://www.npmjs.com/package/qrcodejs2)

### 2. 安装

```bash
npm install qrcodejs2 --save
```

### 3. 引入

```javascript
import QRCode from "qrcodejs2"
```

### 4. 实现

```vue
<template>
	<div>
    <div id="qrcode"></div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
 
export default {
  methods: {
    GenerateQRcode() {
      new QRCode("qrcode", { // 此处的qrcode为上面div的id
        text: 目标url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  },
  mounted() {
    this.GenerateQRcode();
  }
}
</script>
```



## 二. 网页保存为网页

### 1. 需要的库

[html2canvas](https://github.com/hongru/canvas2image)

### 2. 安装

```bash
npm install html2canvas --save
```

### 3. 引入

```javascript
import html2canvas from "html2canvas"
```

### 4. 实现

```vue
<template>
	<div>
  	<div id="container"></div>
	</div>
</template>

<script>
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";

export default {
  methods: {
    outputImg() {
    	const targetDom = document.getElementById("container");
    	html2canvas(targetDom).then(canvas => {
      	console.log(canvas);
      	console.log(canvas.toDataURL());
    	});
  	}
  },
  mounted() {
    this.outputImg();
  }
}
</script>
```



## 三. 整合

关于小程序内置浏览器的图片下载，需要一个用来生成图片的块，还需要一个`img`，先将其隐藏。实现步骤就是首先生成二维码，然后再将html生成图片，最后在html2canvas回调中替换`img`的`src`，并将生成图片的块隐藏，将`img`显示。

当然关于这个实现方式，我看到的技术分享文章中，还有两种不同的解决方式：

* 不需要html来写生成图片的块，而是使用js直接创建；
* 不需要替换隐藏，将生成的图片覆盖到html生成图片的块之前；

这里我只记录一下我使用的，后期会再去研究这两种实现方式。

```vue
<template>
	<div>
    <!--合成的图片，默认隐藏，合成之后显示-->
    <div v-show="imgUrl.length">
      <img :src="imgUrl" alt="生成的图片" class="image" />
  	</div>
    <!--合成图片需要的html块，默认显示，合成之后隐藏-->
  	<div id="container" v-show="!imgUrl.length">
    	<div id="qrcode"></div>
      <p>长按识别二维码</p>
  	</div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      imgUrl: ""
    }
  },
  methods: {
    outputImg() {
    	const targetDom = document.getElementById("container");
    	html2canvas(targetDom).then(canvas => {
        // 将图片src替换为canvas生成之后转换的url
      	this.imgUrl = canvas.toDataURL();
    	});
  	},
    GenerateQRcode() {
      new QRCode("qrcode", {
        text: 目标url,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  },
  mounted() {
    new Promise(resolve => {
      // 先生成二维码
      this.GenerateQRcode();
      resove();
    })
    .then(() => {
      // 再合成图片
      this.outputImg();
    })
  }
}
</script>

<style scoped>
  // 生成之后的图片有点放肆，可以设置宽度来适应手机屏幕
 .image {
    width: 100%;
 }
</style>
```

由此即可实现需要的功能了。

关于后续的优化，需要解决的图片清晰度问题、跨域图片问题等，可以参考[这篇文章](https://segmentfault.com/a/1190000011478657)，这位大佬写得很详细。

