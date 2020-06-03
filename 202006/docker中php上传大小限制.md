## 问题

使用`docker`运行的`wordpress`，有报错`The uploaded file exceeds the upload_max_filesize directive in php.ini`。



## 过程

按照一般的方式去修改文件`php.ini`：

```bash
upload_max_filesize = 30M
post_max_size = 30M
```

容器中有两个`php.ini`文件：

* php.ini-development
* php.ini-production

都修改之后却并不生效。



## 解决

在文件夹`conf.d`中添加文件`uploads.ini`：

```bach
file_uploads = On
memory_limit = 64M
upload_max_filesize = 64M
post_max_size = 64M
max_execution_time = 600
```

文件夹`conf.d`位置需要看具体环境：

```bash
php -i | grep php.ini
```

然后在其目录下找到文件夹`conf.d`。

也可以通过在运行容器时候直接将该文件映射进入。