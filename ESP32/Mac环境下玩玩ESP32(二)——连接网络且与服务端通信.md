## 一. 前言

ESP32本身自带Wi-Fi模块，可以连接网络。虽说其本身存在一定程度的计算能力，但是在一些特定的场景，比如移动端的数据监控和模块控制，需要将数据ESP32本身的数据采集然后传输出来，也需要接收请求来完成特定指令。再比如小车的路径规划，该场景下，ESP32本身的计算能力是不够的，需要将其数据传输到服务端，在服务端计算完成之后由ESP32接收服务端的结果来执行。

本文主要讲解如何使用ESP32连接网络，且与服务端通信。此处的通信是`socket`通信，一些复杂场景可以使用`MQTT`之类的通信，这将在后续文章继续分享。





## 二. 连接网络



### 1. 官方示例

micropython官方文档上给出了一些方法和完整实例，我们先来看看。

首先是官方给出的方法，根据这些方法可以自由处理在连接网络需要的步骤，或者获得需要获取的信息

```python
import network

wlan = network.WLAN(network.STA_IF) # 创建站界面
wlan.active(True)       # 激活界面
wlan.scan()             # 扫描接入点
wlan.isconnected()      # 检查是否连接到无线网络
wlan.connect('essid', 'password') # 连接无线网络，此处essid即为Wi-Fi名称
wlan.config('mac')      # 获取接口的MAC地址
wlan.ifconfig()         # 获取接口的 IP/网络掩码/gw/DNS 地址
```

然后是官方给出了一个连接网络的完整示例。

```python
def do_connect():
    import network
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect('essid', 'password')
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())
```



### 2. 根据实际情况连接

```python
import network


def do_connect_network(ssid: str, password: str):
    """
    连接Wi-Fi

    :param ssid: Wi-Fi名字
    :param password: Wi-Fi密码
    :return: none
    """
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect(ssid, password)
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())


if __name__ == '__main__':
    do_connect_network('your-wifi-name', 'your-wifi-password')

```

然后在Thonny上执行，可以得到如下输出结果：

```
connecting to network...
network config: ('192.168.50.145', '255.255.255.0', '192.168.50.254', '192.168.50.254')
```





## 三. 与服务端通信

> Once the network is established the `socket` module can be used to create and use TCP/UDP sockets as usual, and the `urequests` module for convenient HTTP requests.

官方文档给出了说明，一旦网络建立起来，socket 模块就可以像往常一样用于创建和使用 TCP/UDP 套接字，而 urequests 模块则可以方便地进行 HTTP 请求。

TCP和UDP不同的一点在于，UDP发包无需在意包是否被接收，而TCP是发送和响应两个环节，需要在发送后接收到响应。

此处分别列举UDP和TCP的与服务端通信的案例。



### 1. UDP

此处将udp服务端放在esp32上，而udp客户端放在服务器/pc上，若是要将服务端放在服务器上运行，将代码按需求反置即可。

#### 1）socket服务端和客户端代码

首先我们来看一下socket udp的服务端和客户端代码。

**socket udp 服务端代码**

```python
import socket


def socket_udp_server(server_ip: str = '0.0.0.0', server_port: int = 9000, buffer_size: int = 1024):
    """
    socket udp 服务端

    :param server_ip: 服务器的地址, 默认为0.0.0.0, 表示允许所有
    :param server_port: 服务器udp server接收信息的端口, 默认9000
    :param buffer_size: 套接字缓冲区大小, 默认1024
    :return: none
    """
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.bind((server_ip, server_port))
    print('服务端开始运行...\n')

    while True:
        receive_data, sender_info = udp_socket.recvfrom(buffer_size)
        print('客户端地址: {}'.format(sender_info))
        print('来自客户端的信息: {}'.format(receive_data.decode('utf-8')))


if __name__ == '__main__':
    socket_udp_server()

```

**socket udp 客户端代码**

```python
import socket


def socket_udp_client_send_message(message: str, server_ip: str, server_port: int):
    """
    socket udp 客户端发送消息

    :param message: 消息
    :param server_ip: 服务端的ip地址
    :param server_port: 服务端的端口号
    :return: none
    """
    udp_client_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    udp_client_socket.sendto(str.encode(message), (server_ip, server_port))


if __name__ == '__main__':
    socket_udp_client_send_message('hello,world!', '127.0.0.1', 9000)

```

#### 2）实际代码

接着，我们在ESP32中放入服务端代码，在电脑/服务器上放入客户端代码。代码如下：

**ESP32代码**

```python
import network
import socket


def do_connect_network(ssid: str, password: str):
    """
    连接Wi-Fi

    :param ssid: Wi-Fi名字
    :param password: Wi-Fi密码
    :return: none
    """
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect(ssid, password)
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())


def socket_udp_server(server_ip: str = '0.0.0.0', server_port: int = 9000, buffer_size: int = 1024):
    """
    socket udp 服务端

    :param server_ip: 服务器的地址, 默认为0.0.0.0, 表示允许所有
    :param server_port: 服务器udp server接收信息的端口, 默认9000
    :param buffer_size: 套接字缓冲区大小, 默认1024
    :return: none
    """
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    udp_socket.bind((server_ip, server_port))
    print('服务端开始运行...\n')

    while True:
        receive_data, sender_info = udp_socket.recvfrom(buffer_size)
        print('客户端地址: {}'.format(sender_info))
        print('来自客户端的信息: {}'.format(receive_data.decode('utf-8')))


def main():
    do_connect_network('cholik_2.4G', 'long live china')
    socket_udp_server()


if __name__ == '__main__':
    main()

```

在esp32上运行服务端代码，输入如下：

```
network config: ('192.168.50.145', '255.255.255.0', '192.168.50.254', '192.168.50.254')
服务端开始运行...
```

内容包含服务端的ip地址，我们要将该地址写入客户端代码。

**客户端代码**

```python
import socket


def socket_udp_client_send_message(message: str, server_ip: str, server_port: int):
    """
    socket udp 客户端发送消息

    :param message: 消息
    :param server_ip: 服务端的ip地址
    :param server_port: 服务端的端口号
    :return: none
    """
    udp_client_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    udp_client_socket.sendto(str.encode(message), (server_ip, server_port))


if __name__ == '__main__':
    socket_udp_client_send_message('hello,esp32!', '192.168.50.145', 9000)

```

### 3）运行

运行客户端代码，发送消息，可以看到esp32输出如下：

```
客户端地址: ('192.168.50.76', 51920)
来自客户端的信息: hello,esp32!
```



### 2. TCP

#### 1）socket服务端和客户端代码

首先我们来看一下socket tcp的服务端和客户端代码。

**socket tcp 服务端代码**

```python
import socket


def socket_tcp_server(server_ip: str = '0.0.0.0', server_port: int = 9000, buffer_size: int = 1024):
    """
    socket tcp 服务端

    :param server_ip: 服务器的地址, 默认为0.0.0.0, 表示允许所有
    :param server_port: 服务器tcp server接收信息的端口, 默认9000
    :param buffer_size: 套接字缓冲区大小, 默认1024
    :return: none
    """
    tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    tcp_socket.bind((server_ip, server_port))
    tcp_socket.listen(128)
    print('服务端开始运行...\n')

    while True:
        client, sender_info = tcp_socket.accept()
        receive_data = client.recv(buffer_size)
        print('客户端地址: {}'.format(sender_info))
        print('来自客户端的信息: {}'.format(receive_data.decode('utf-8')))

        # 返回消息
        client.send(str.encode('response...'))


if __name__ == '__main__':
    socket_tcp_server()

```

**socket tcp 客户端代码**

```python
import socket


def socket_tcp_client_send_message(message: str, server_ip: str, server_port: int, buffer_size: int = 1024):
    """
    socket tcp 客户端发送消息

    :param message: 消息
    :param server_ip: 服务端的ip地址
    :param server_port: 服务端的端口号
    :return: none
    """
    tcp_client_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_STREAM)
    tcp_client_socket.connect((server_ip, server_port))
    tcp_client_socket.send(str.encode(message))

    response = tcp_client_socket.recv(buffer_size)
    print('response : {}'.format(response.decode()))

    tcp_client_socket.close()


if __name__ == '__main__':
    socket_tcp_client_send_message('hello,world!', '127.0.0.1', 9000)

```

#### 2）实际代码

接着，我们在ESP32中放入服务端代码，在电脑/服务器上放入客户端代码。代码如下：

**ESP32代码**

```python
import network
import socket


def do_connect_network(ssid: str, password: str):
    """
    连接Wi-Fi

    :param ssid: Wi-Fi名字
    :param password: Wi-Fi密码
    :return: none
    """
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect(ssid, password)
        while not wlan.isconnected():
            pass
    print('network config:', wlan.ifconfig())


def socket_tcp_server(server_ip: str = '0.0.0.0', server_port: int = 9000, buffer_size: int = 1024):
    """
    socket tcp 服务端

    :param server_ip: 服务器的地址, 默认为0.0.0.0, 表示允许所有
    :param server_port: 服务器tcp server接收信息的端口, 默认9000
    :param buffer_size: 套接字缓冲区大小, 默认1024
    :return: none
    """
    tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    tcp_socket.bind((server_ip, server_port))
    tcp_socket.listen(128)
    print('服务端开始运行...\n')

    while True:
        client, sender_info = tcp_socket.accept()
        receive_data = client.recv(buffer_size)
        print('客户端地址: {}'.format(sender_info))
        print('来自客户端的信息: {}'.format(receive_data.decode('utf-8')))

        # 返回消息
        client.send(str.encode('response...'))


def main():
    do_connect_network('cholik_2.4G', 'long live china')
    socket_tcp_server()


if __name__ == '__main__':
    main()

```

在esp32上运行服务端代码，输入如下：

```
network config: ('192.168.50.145', '255.255.255.0', '192.168.50.254', '192.168.50.254')
服务端开始运行...
```

内容包含服务端的ip地址，我们要将该地址写入客户端代码。

**客户端代码**

```python
import socket


def socket_tcp_client_send_message(message: str, server_ip: str, server_port: int, buffer_size: int = 1024):
    """
    socket tcp 客户端发送消息

    :param message: 消息
    :param server_ip: 服务端的ip地址
    :param server_port: 服务端的端口号
    :return: none
    """
    tcp_client_socket = socket.socket(
        family=socket.AF_INET, type=socket.SOCK_STREAM)
    tcp_client_socket.connect((server_ip, server_port))
    tcp_client_socket.send(str.encode(message))

    response = tcp_client_socket.recv(buffer_size)
    print('response : {}'.format(response.decode()))

    tcp_client_socket.close()


if __name__ == '__main__':
    socket_tcp_client_send_message('hello,esp32!', '192.168.50.145', 9000)

```

### 3）运行

运行客户端代码，发送消息，可以看到esp32输出如下：

```
客户端地址: ('192.168.50.76', 51896)
来自客户端的信息: hello,esp32!
```

  而客户端输出如下：

 ```
 response : response...
 ```





## 四. 参考文档

* [micropython networking](https://docs.micropython.org/en/latest/esp32/quickref.html#networking)
