//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        userText: '',
        todos: [],
        current: '', //用户的当前在输入的todo
        motto: 'Hello World',
        userInfo: {}
    },
    bindkeyInput: function(e) {
        this.data.current = e.detail.value
    },
    addItem: function(e) {
        console.log(this.data.current);
        if (this.data.current !== '') {
            // 应用程序级别的逻辑
            // 当前页面的逻辑
            app.addItem(this.data.current)
                // 添加完了，将input 清空一下
            this.setData({
                current: ''
            })
        }
        // 将用户输入的todo 拿到
        // 传统的js   
        // document.querySelector(input).value
        // 用户没输入 正在输入 完成  三种状态
        // current  数据项 数据维护 
        // value = {{current}}
        // 界面和数据，模棱两可的
        // 数据绑定的界面，尽量减少dom 查找及修改
        // 交给框架小程序 vue  mvvm 
        // 界面  数据
        // 存储到野狗
    },
    deleteItem: function(e) {
        // 数据集合 collections
        // 数据表 excel  
        // row ->  child
        // column -> field 字段
        // NoSQL  js 友好   面向文档的数据库
        var key = e.target.dataset.key;
        // key:value 
        this.ref.child(key).remove();
    },
    doLogin: function() {
        var that = this;
        app.login(function(user) {
            that.setData({
                userText: JSON.stringify(user)
            })
        });
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {
        this.ref = app.getTodoRef()
        this.ref.on('child_added', function(snapshot, prKey) {
            // 事件监听， 数据从小程序去到野狗的服务器
            // 异步的过程，花时间 定义事件
            var key = snapshot.key()
            var text = snapshot.val()
                // todo json 对象 文档数据库存的就是json对象
            var newItem = { key: key, text: text }
                // 新增一条，维护好todos 
            this.data.todos.push(newItem)
                // 通知界面更新
            this.setData({
                todos: this.data.todos
            })
        }, this);
        this.ref.on('child_removed', function(snapshot) {
            var key = snapshot.key()
                // 如何在数据中删除一个存在的项？
                // 遍历比对
            var index = this.data.todos.findIndex(
                    function(item, index) {
                        if (item.key === key) return true
                        return false
                    })
                // 从某个下标位置删除多少个
            if (index >= 0) {
                this.data.todos.splice(index, 1);
                // 改数据
                // 管界面
                this.setData({
                    todos: this.data.todos
                })
            }

        }, this)
        console.log('onLoad')
        var that = this
            //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    }
})