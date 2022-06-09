## socket tcp server

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



## socket tcp client

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

