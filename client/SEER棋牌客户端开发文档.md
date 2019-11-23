---
SEER棋牌客户端开发文档
[Author: lynton]  [Date: 2019-11-23]
---
#第一部分: 环境部署
##1.软件安装
```
1.系统要求: Windows 7/Windows 10;
2.游戏引擎: Cocos2d-JS 3.10 + CocosStudio;
3.IDE: WebStorm.
```
##2.环境配置
```
1.Python环境: 安装Python 2.7, 配置系统变量;
2.NodeJS环境: 安装NodeJS 8.0+, 配置系统变量;
3.JDK环境: 安装JDK1.8.0_45, 配置系统变量;
4.Win32编译: VisualStudio 2013/2015;
5.Android编译: AndroidStudio 3.3.2 + sdk 22 + ndk r10e;
6.IOS编译: xcode.
```
#第二部分：开发说明
##1.项目结构
```
.
│  Preload-xxx.js
│  zq-xxx.ccs
│  
├─cocosstudio
├─frameworks
│  ├─cocos2d-x
│  └─runtime-src
│      ├─Classes
│      ├─proj.android-studio
│      ├─proj.ios_mac
│      │  └─seer.xcodeproj
│      └─proj.win32
│              qp_client.sln
│              
├─res
├─script
└─src

1: zq-xxx.ccs是UI工程文件入口，所有的资源包含在cocosstudio文件夹，工程的发布资源在res下;
2: src是游戏逻辑的脚本文件;
3: script是游戏引擎库文件;
4: frameworks是游戏引擎框架，frameworks/runtime-src/对应不同平台的编译入口;
5: Preload-xx.js是资源处理脚本.
```
##2.开发编译
```
1.UI的布局和发布依赖于cocosstudio;
2.代码书写用webstorm打开工程根目录即可;
3.代码的调试基于win32平台，需要用VS2013打开frameworks/runtime-src/proj.win32/qp_client.sln;
4.Android编译依赖于python，sdk，ndk系统变量的配置，然后执行根目录下的.bat即可;
5.IOS编译需要用xcode打开frameworks/runtime-src/proj.ios_mac/seer.xodeproj进行编译.
```
##3.库文件下载
```
1.游戏引擎frameworks下载链接: 链接：https://pan.baidu.com/s/10U-MzR1M1pNKjfb9PCfwzQ 提取码：8emg;
2.下载完成后, frameworks解压直接替换到项目的根目录;
3.sdk解压, 配置系统环境变量ANDROID_SDK_ROOT,例如: D:\cocos\tools\android_sdk;
4.ndk解压, 配置环境系统变量NDK_ROOT,例如: D:\cocos\tools\android_ndk_r10e;
5.注: 项目的路径以及Android环境路径不能包含中文或特殊字符.
```