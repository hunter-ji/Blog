## 问题

开始是开发`electron`时遇到的问题，使用`Interval`计时器，在窗口最小化隐藏再打开，计时器在隐藏期间并没有工作。

后来网上查询相关问题，发现更多是在浏览器tab页隐藏/切换情况下，计时器就会停止。



## 解决

> 在后台选项卡上运行的计时器方法可能会耗尽资源。在后台选项卡中以非常短的时间间隔运行回调的应用程序可能会消耗大量内存，以至于当前活动选项卡的工作可能会受到影响。在最坏的情况下，浏览器可能会崩溃，或者设备的电池会很快耗尽。

此限制是浏览器限制的。

无法突破限制，但是可以使用折中的方式，当然我也觉得此方式相较于一直计时会更优，即监听`visibilitychange`事件。

`visibilitychange`事件可以监听tab页面的激活与失活事件，因此可以：

* 在失活时，记录计时器计算的最后的值，清空计时器
* 在激活时，计算失活期间应有的值，继续使用计时器计算



### 添加事件代码如下：

```javascript
document.addEventListener('visibilitychange', function() {
    if(document.hidden) {
        // tab页失活
        
    }
    else {
        // tab页激活
        
    }
});
```



## 参考文档

* [https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event)

* [https://usefulangle.com/post/280/settimeout-setinterval-on-inactive-tab](https://usefulangle.com/post/280/settimeout-setinterval-on-inactive-tab)