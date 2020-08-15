## 报错

```bash
an upstream response is buffered to a temporary file 
```



## 解决

`Nginx`配置加上如下配置

```bash
proxy_max_temp_file_size 0;
client_max_body_size 50m;
```

