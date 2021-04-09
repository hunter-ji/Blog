## 问题

在使用axios的拦截器时候，需要在request中调用一个promise函数，因此需要等待其执行完成才能去进行下一步。

```js
function getToken() {
	return new Promise(...)
}

// Request interceptors
service.interceptors.request.use(config => {
  getToken()
  ...
})
```



## 解决

```js
function getToken() {
	return new Promise(...)
}

// Request interceptors
service.interceptors.request.use(async config => {
  awit getToken()
  ...
})
```

