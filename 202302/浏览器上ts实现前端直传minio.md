## 一. 前言

前端从后端获取到sts，然后直接minio，极大减少服务端的压力。

当然，肯定会这种疑问，为什么不在后端生成临时签名url，给前端上传/下载呢？问就是业务需要 /狗头......



## 二. 环境

* *minio*: ^7.0.32
* *typescript*: 4.9.5



## 三. 浏览器上的坑

为什么标题上要强调“浏览器”呢？

这是因为官方的minio.js，感觉当前版本并没有考虑浏览器的使用场景，无法直接在浏览器上直传。

所以这里就是推荐一个折中的方案，可以在前端直传。

当然了，如果业务允许，当前版本请直接在后端生成临时签名url吧！



## 四. minio直传代码实现

### 1. 生成client

```js
const minioClient = new Minio.Client({
  region: 'cn-north-1', // region字段，极其有必要加上！我在sts场景，不加region字段就报错权限不够/心累...
  endPoint: '192.168.1.1', // minio的地址
  port: 9000, // minio端口
  useSSL: true, // 是否使用ssl
  accessKey,
  secretKey,
  sessionToken, // 可选字段，当为sts时，加入此字段
})
```

### 2. putObject直传方案

```js
putObject(bucketName, objectName, stream)
```

官方提供的`putObject`方法，必填这三个字段，前两个很好理解，主要是第三个`stream`，需要详细看一下。

`stream`的类型是：`string | internal.Readable | Buffer`

`string`很好搞定，直接`putObject(bucketName, 'hello.txt', 'hello,world!')`这样子上传文本文件。

但是另外两个类型都是nodejs的啊...啊这...（也许是我错了，有大佬能够解决的请务必直接告诉我...）

### 3. 折中方案

那么折中的方案就是由前端生成临时签名url，再由前端进行上传 /哭。

```js
const url = await minioClient.presignedPutObject(bucketName, filename)
```

然后利用http请求url进行上传即可。虽然比较曲折，但是目前相对比较好的前端解决方案。



## 五. http请求url上传

此处介绍下http请求上传的相关操作。

### 1. 请求上传

请求上传可以有三种方案。

#### XMLHttpRequest

```js
const xhrUploadFile = (file: File, url: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true);
  xhr.send(file);
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log(`${file.name} 上传成功`);
    } else {
      console.error(`${file.name} 上传失败`);
    }
  };
}
```

#### Fetch

```js
const fetchUploadFile = (file: File, url: string) => {
  fetch(url, {
    method: 'PUT',
    body: file,
  })
    .then((response) => {
      console.log(`${file.name} 上传成功`, response);
    })
    .catch((error) => {
      console.error(`${file.name} 上传失败`, error);
    });
}
```

#### Axios

```js
const axiosUploadFile = (file: File, url: string) => {
  const instance = axios.create();
  instance
    .put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    })
    .then(function (response) {
      console.log(`${file.name} 上传成功`, response);
    })
    .catch(function (error) {
      console.error(`${file.name} 上传失败`, error);
    });
}
```

### 2. Promise

此处可以封装一下请求，叠加`promise`buff，此处以`XMLHttpRequest`为例：

```js
const uploadRequest = (file: File, url: string) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url, true)
    xhr.send(file)
    xhr.onload = () => {
      if (xhr.status === 200)
        resolve(xhr.response)
      else
        reject(xhr.status)
    }
  })
}
```

### 3. 事件响应

要完成上传，怎么能没有响应事件呢。

此处的事件包括：

* 上传进度
* 上传完成
* 上传失败

请求代码如下：

```js
const uploadRequest = async (file: File, url: string) => {
  const xhr = new XMLHttpRequest()

  xhr.upload.addEventListener('progress', (e) => {
    onUploadProgress(`${((e.loaded / e.total) * 100).toFixed(0)}`) // 更新进度，此处不保留小数点
  })

  xhr.onload = () => {
    if (xhr.status === 200) {
      try {
        onUploaded() // 响应上传完成事件
      }
      catch (error) {
        onUploadErr((error as Error).message) // 响应上传错误，此处ts处理error
      }
    }
    else { onUploadErr(`http code is ${xhr.status}`) } // 响应上传错误
  }

  xhr.open('PUT', url, true)
  xhr.send(file)
}
```

### 4. 取消上传

```js
const xhr = new XMLHttpRequest()
// ...
xhr.abort() // 取消上传
```



## 六. 性能优化

* 对于大文件，或者说需要后台运行的上传任务，可以使用web worker来跑
* 对于大文件，可以使用切片的方式提高并发，切片的方式也可以实现断点续传，只是需要注意文件切片的顺序和唯一id



