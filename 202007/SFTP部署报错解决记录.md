## 一. 前言

部署SFTP服务器，数次遇到几个报错，特此记录



## 二. 环境

* 路径

  ```bash
  home
  └── tom
      └── uploads
  ```

* 用户为`tom`



## 三. 报错

### 报错一

```bash
permission denied
```

### 报错二

```bash
bad ownership or modes for chroot directory component "<your-path>"
```



## 四. 解决

以上两个报错，此处为统一解决。

* 创建用户组

```bash
groupadd ftp
```

* 将用户加入用户组

```
usermod -a -G ftp tom
```

* 设置权限

```bash
chown root:ftp -R /home/tom
chown tom:ftp -R /home/tom/uploads
chmod 755 -R /home
```

