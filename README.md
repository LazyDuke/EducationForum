# SEHomework

[TypeScript 中文文档](https://www.tslang.cn/docs/tutorial.html)

文件夹说明:

fe: 前端

be: 后端

docs: 文档

## 题目

设计题目：《软件工程》教学论坛  
参与者：网站管理者、老师、学生、一般浏览者等  

基本功能：  
> 学生：下载资料、上传作业、在线交流/留言等。  
> 老师：上传资料、下载作业、评分、追踪学习过程、信息发布等；  
> 管理者：系统管理、板块管理、会员管理（权限与模块）、模板管理、帖子管理、日志管理、安全管理（禁止发言/发帖、留言/私信、主题审核/加精、删除/恢复等）、公告/广告等。    

界面说明：   
> 在线学习、主题讨论、管理区（坛规、公告等）、相关主题、灌水区等。  

## 需要文档

开题报告――学生日期：2017年3月22日 老师日期：2017年3月25日  
系统规格说明书(含可行性分析报告)――日期：2017年4月6日  
软件项目计划(含：估算说明) ――日期：2017年4月13日  
软件需求规格说明书(含数据要求) ――日期：2017年4月27日  
软件设计说明书(含数据库)&软件开发规范――日期：2017年5月4日  
模块开发卷宗(源代码清单：电子版) ――日期：2017年5月18日  
软件测试计划和测试分析报告――日期：2017年6月8日  
用户（安装、操作）手册――日期：2017年6月15日  
项目开发总结报告――日期：2017年6月22日  
系统答辩及演示――日期：2017年6月27日（暂定）  
系统材料提交――日期：2017年6月29日（暂定）  

## 框架, 语言选择

前后分离, 使用 API 进行通信, 前端渲染.

### 前端

前端使用 ES2015 Stage 3(包含 await/async 特性), [Vue2](https://cn.vuejs.org/) 框架. 使用 [vue-router 2](http://router.vuejs.org/zh-cn/) 构建 SPA(单页应用).

### 后端

后端依然使用 [TypeScript](https://tslang.cn/) 语言, [koa](http://koajs.com/) 框架.

## 环境构建

直接下载安装

1. [Visual Studio Code](https://ojiju7xvu.qnssl.com/sehw/VSCodeSetup-1.10.2.exe)
2. [Nodejs v6.10](https://ojiju7xvu.qnssl.com/sehw/node-v6.10.0-x64.msi)
3. [Git for Windows](https://ojiju7xvu.qnssl.com/sehw/Git-2.12.0-64-bit.exe)

注意: 装 `Git for Windows` 的时候需要在中间某步(有红字的一步)选择第二个:
`Use Git from the Windows Command Prompt.`

安装后以上三个软件后, 需要重启(注销再登录也可以)一下使 `node`, `npm`, `git` 等的环境变量生效.

### cnpm (npm 的国内镜像)

打开一个 cmd (Win+R 输入 cmd), 执行以下命令:

```shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

然后执行 `cnpm`, 没有报错就可以进行下一步操作, 有的话再重启一下(注销再登录也可以).

### TypeScript

打开一个 cmd, 执行以下命令:

```shell
cnpm install -g typescript
```

如果没有发生错误, 则执行 `tsc` 会出现一大堆帮助, 否则可能需要百度搜一下错误内容然后解决问题.

### Visual Studio Code

安装 VSCode 扩展使其更容易使用.

在左边的5个按钮中找到扩展(最后一个), 然后搜索安装. 当搜索没反应时(连不上服务器)可以下载安装:

直接点击名字下载 vsix 文件, 在边栏右上角菜单选择 `从 VSIX 安装`.

1. [`vetur`](https://ojiju7xvu.qnssl.com/sehw/vsext/vetur.vsix) vue 单文件支持
2. [`TSLint`](https://ojiju7xvu.qnssl.com/sehw/vsext/TSLint.vsix) 用于找出常见错误.
3. [`Blade Runner`](https://ojiju7xvu.qnssl.com/sehw/vsext/BladeRunner.vsix) 自动运行 TypeScript 构建程序.

都装好后重新启动 VSCode 就可以生效.

### clone 项目

打开 `cmd`, 用cd命令切换到你想要存项目文件的文件夹下.

先把 `git clone https://yourname:password@git.coding.net/imspace/SEHomework.git` 中的yourname 和 password 换成自己 coding 的用户名和密码, 再粘贴到 cmd 里执行, 以后就不用每次都输入密码了.

## 开始开发

### 第一次需要做的准备:

1. 使用 `VS Code` 文件菜单中的`打开文件夹`打开 `be` 或者 `fe` 文件夹.
2. 按 `` Ctrl + `(~) `` 打开终端, 输入 `cnpm install` 安装依赖.
3. 重新打开 `VS Code`

这一步是安装软件所需的库, 每当 [package.json](package.json) 修改时(依赖更新后), 都需要运行一遍 `cnpm install`.

cnpm 其实是 npm 的国内镜像, 使用 `npm install` 也有同样的效果, 不过速度会慢很多.

### 同步代码

每次开始写之前注意使用 git 同步代码, 在 `VS Code` 中有集成. git 功能在左边5个图标中的第3个. 打开边栏后点击边栏右上角的 `…`, 选择 `pull`, 如果有冲突的话需要处理一下再写, 否则拖到后面会很麻烦.

每写好一部分代码(如一个文件或者一个功能)就可以 commit 一下, 方法很简单, 只要在 git 的边栏的消息里简要的写下这些文件修改了什么, 然后提交就行.

`push` 是将本地的 commit 推到服务器的过程, 也可能出现冲突. 发生冲突的话跟我说一下, 因为我也没在 `VS Code` 里处理过(逃

