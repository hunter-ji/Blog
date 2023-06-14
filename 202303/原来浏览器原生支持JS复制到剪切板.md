## 一. 第三方库的痛苦

在日常的前端开发中，经常需要将一些数据从网页上复制到剪切板中。而实现复制功能，第一时间想到的就是引入第三方库。

曾经过多不少第三方的剪切板的库，是真的很繁琐，又是创建对象，又是绑定DOM，头都要炸了，就个简单的复制功能，第三方库换来换去地测试......

后来看到了vueuse可以直接用，突然觉得，哇！真棒！

直到有一天，搜到了Clipboard api......



## 二. 原生支持

***官方文档***：https://developer.mozilla.org/en-US/docs/Web/API/Clipboard

不管是读，还是写，统统搞定！而且都还是异步方法。

比如复制文本到剪切板：

```js
navigator.clipboard.writeText("<empty clipboard>")
```

复制canvas到剪切板：

```js
function copyCanvasContentsToClipboard(canvas, onDone, onError) {
  canvas.toBlob((blob) => {
    let data = [new ClipboardItem({ [blob.type]: blob })];

    navigator.clipboard.write(data).then(
      () => {
        onDone();
      },
      (err) => {
        onError(err);
      }
    );
  });
}
```

读取剪切板的文本：

```js
const txt = navigator.clipboard.readText()
```





