###目录结构描述
├── assets                      
│   ├── common                  // 项目公用资源
│   ├── images                  // 图片资源
│   └── lib                     // 三方库资源
├── pages                       
│   ├── components              // 页面公用组件
|   ├── tabBar                  // 页面主包
|   └── {packageName}           // 页面分包，根据功能自行创建分包


##注意事项
- 新建分包时，需在app.json中配置subPackages参数
- 组件样式不使用标签，id，属性选择器（开发者工具会抛出警告）
- 使用wx:for时，加上key
- 图片资源较大时，将资源放服务器
- 尽量使用iconfont代替小图标
- 路由参数有特殊符号时，先调用decodeURIComponent方法进行参数解码