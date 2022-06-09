## socket udp server

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



## socket udp client

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

