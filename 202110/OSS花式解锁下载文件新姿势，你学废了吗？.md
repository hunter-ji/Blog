## 一. 简介

在上一篇文章——[前端文件花式直传OSS！后端：那我走？](https://mp.weixin.qq.com/s/qpSWVymlWtwlb5WUd_1M7Q)中聊了下文件上传的几种方案，这里我们再来聊一下文件下载的花式姿势。



## 二. 精简版

最常见的方式，莫过于后端存储文件在服务器上，然后通过后端接口传给前端，如下图所示。

![最简版](https://tva1.sinaimg.cn/large/008i3skNgy1guwoojpvg6j60lq068jrg02.jpg)

该方案对于小规模、成本较低的项目非常适用，开发也较为便捷。

而对于有性能要求的项目，可以通过砸钱加机器、分片下载等方案提升项目性能。如果可以的话，请砸钱加机器吧！

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1guwq8edesqj60hq0bc75c02.jpg" alt="截屏2021-09-28 下午9.58.10" style="zoom:33%;" />



## 三. 中庸版

相较于上一个方案，可以砸丢丢钱整个OSS，将文件存储在OSS上，毕竟OSS上行流量不收费，如下图所示。

![中庸版直传](https://tva1.sinaimg.cn/large/008i3skNgy1guwpuow9hnj60km0dc74n02.jpg)

那么问题来了，OSS的下行流量不是收费的吗？！

OK，偷偷告诉各位一个省钱小妙招/狗头，OSS内网的下行流量是不收费的！因此，可以通过后端请求OSS，获取到文件/字符串后，将其以文件流/base64数据的方式返回给前端。这样就避免了下行流量的费用。如下图所示。

![中庸版](https://tva1.sinaimg.cn/large/008i3skNgy1guwp05f04jj60r3068glu02.jpg)

不过问题又来了，这样就还是占用了后端服务器的资源，依然会是性能的一个瓶颈。

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1guwq8of8qcj6076075dft02.jpg" alt="截屏2021-09-28 下午10.12.06" style="zoom:50%;" />



## 四. 性能版

基于上一个方案，可以再升级。砸丢丢钱，拉上CDN这老哥，利用CDN流量代替OSS的下行流量，既能让前端直接请求OSS资源，不占用服务器资源，也降低了成本。如图所示。

![性能版](https://tva1.sinaimg.cn/large/008i3skNgy1guwplrnpu2j60r20dc3z102.jpg)

在优先性能的情况下，该方案是较优的。

要说缺点的话，就是CDN配置吧，需要买域名和SSL证书等，不过一次购买，后续使用体验会非常棒。CDN除了可以代替OSS的下行流量外，其优点不要太多，比如说CDN可以文件缓存、可以调度至加速节点等。

涉及到OSS的私有Bucket的话，只需要使用CDN的访问控制即可。其也只需要通过后端实现加密，生成文件访问URL给前端直接访问。

或许你会存在疑问，看上去挺麻烦的啊！但是看看CDN的价格，你肯定会有不一样的想法的。

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gux8jydxbdj608v09agly02.jpg" alt="截屏2021-09-28 下午10.37.14" style="zoom:50%;" />