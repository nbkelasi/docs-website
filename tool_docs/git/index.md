## 一.Git配置

### 用户信息

配置个人的用户名称和电子邮件地址：

```bash
git config --global user.name 用户名
git config --global user.email 电子邮件地址
```

如果用了 **--global** 选项，那么更改的配置文件就是位于你用户主目录下的那个，以后你所有的项目都会默认使用这里配置的用户信息。

如果要在某个特定的项目中使用其他名字或者电邮，只要去掉 --global 选项重新配置即可，新的设定保存在当前项目的 .git/config 文件里。

### 修改配置文件来解决中文乱码

将git配置文件 `core.quotepath`项设置为`false`。`quotepath`表示引用路径，加上`--global`**表示全局配置**

```bash
git config --global core.quotepath false
```

## 创建仓库

### 初始化仓库

```bash
git init
```

该命令执行完后会在当前目录生成一个 .git 目录。

### 提交到暂存区

```bash
git add .  #添加文件到暂存区。
git status #查看仓库当前状态，显示有变更的文件
```

### 提交到仓库

```bash
git commit -m [message]
#git commit 命令将暂存区的内容添加到本地仓库中
#[message] 可以是一些备注信息
git log 
#显示所有提交过的版本信息，不包括已经被删除的 commit 记录和 reset 的操作
git log --pretty==oneline
#每条日志都只显示一行
```

### 代码回滚

```bash
git reset [HEAD]
#git reset 命令用于回退版本，可以指定退回某一次提交的版本
#--hard 参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交
git reset --hard HEAD~3
#回退上上上一个版本  
git reset –hard bae128
# 回退到某个版本回退点之前的所有信息。 
git reset --hard origin/master
# 将本地的状态回退到和远程的一样 
```

**HEAD 说明：**

- HEAD 表示当前版本
- HEAD^ 上一个版本
- HEAD^^ 上上一个版本
- HEAD^^^ 上上上一个版本
- 以此类推...

可以使用 ～数字表示

- HEAD~0 表示当前版本
- HEAD~1 上一个版本
- HEAD^2 上上一个版本
- HEAD^3 上上上一个版本
- 以此类推...

### 标签

如果你达到一个重要的阶段，并希望永远记住那个特别的提交快照，你可以使用 git tag 给它打上标签

```bash
git tag -a v1.0 
```

## 下载远程代码并合并

##### 为远程地址设置别名

```bash
git remote origin set-url <url>
```

##### 下载远程代码并合并

```bash
git pull <远程主机名> <远程分支名>:<本地分支名>
```

##### 上传远程代码并合并

```bash
git push <远程主机名> <本地分支名>:<远程分支名>
```

