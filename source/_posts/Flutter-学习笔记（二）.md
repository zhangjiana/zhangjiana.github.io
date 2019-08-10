---
title: Flutter 学习笔记（一）
copyright: true
date: 2019-07-10 22:29:43
tags:
---

# Flutter 的两个抽象类
1. `Flutter` 分为 `StatelessWidget` 和 `StatefulWidget` 两个抽象类，为我们提供自定义组件.
`StatelessWidget` 是无状态控件， 即不可变状态的控件,通过构建其他控件来描述用户界面的一部分。
`StatefulWidget` 是有状态控件，可以定义一个具有可变状态的控件。实现一个 stateful widget 至少需要两个类：
 （1）一个 `StatefulWidget` 类；
 （2）一个 `State` 类，`StatefulWidget` 类本身是不变的，但是 State 类在 widget 生命周期中始终存在。

 ## 举例说明： 

  官网的例子实现一个随机变化的英文字符串
  1. 先创建一个最简单的 state 类,然后重写build 方法，返回随机字符串
  ```code
  class RandomWordsState extends State<RandomWords> {
    @override
    Widget build(BuildContext context) {
      final wordPair = WordPair.random();
      return Text(wordPair.asPascalCase);
    }
  }
  ```
  2. 添加有状态的RandomWords widget
  ```code
  class RandomWords extends StatefulWidget {
    @override
    RandomWordsState createState() => RandomWordsState();
  }
  ```
  3. 在 `StatelessWidget` 中写界面显示
  ```code
  class MyApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
      return MaterialApp(
        title: 'Welcome to Flutter',
        home: Scaffold(
          title: Text('Welcome to Flutter'),
          body: Center(
            child: RandomWords()
          )
        )
      )
    }
  }
  ```
  4. 重启应用。应用应该像之前一样运行，每次热重载或保存应用程序时都会显示一个单词对

# Flutter 使用外部package
## 举例说明： 添加`english_words`软件包
1. 在pubspec.yaml 中，将 english_words（3.1.0或更高版本）添加到依赖项列表
```code 
  dependencies:            
  flutter:            
  sdk: flutter            
  cupertino_icons: ^0.1.2            
+ english_words: ^3.1.0
```
2. 在 Android Studio 的编辑器视图中查看 pubspec 时，单击右上角的 Packages get，这会将依赖包安装到你的项目。或者在终端输入
```shell
flutter pub get
```
3. 在`lib/main.dart`中引入,
```code 
import 'package:english_words/english_words.dart'
```
### 总结
`pubspec.yaml` 管理Flutter 应用程序的assets(资源，如图片、package等), 个人暂且理解为`package.json`, 如果不对欢迎指正。