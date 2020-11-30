# nodejs 游戏服务器搭建

0.1版本

1.设计需要的第三方模块

- ws模块用来使用网关和服务器之间的相互通信
- express模块，用来进行http的相关通信
- mysql模块用来操作数据库
- redis模块用来操作redis数据库的

2.模块的设计

- 3rd：常用的第三方模块
- apps：系统模块
- database：操作数据库的模块位置
- netbus：网络模块
- uitls：自己封装的模块
- bat文件主要是启动服务器的批量文件

0.11版本增加了log，还有tcp socket 二进制数据模块