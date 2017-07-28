//app.js// sdk wilddog 可以解决我们数据存储的问题
// 云服务器，数据库TODO 对象文档集合 mongodb
var wilddog = require('wilddog-weapp-all')


App({ //app.js

    onLaunch: function() { //wilddog配置
        //数据库
        var config = {
            syncURL: 'https://gsc001.wilddogio.com/',
            authDomain: 'gsc001.wilddog.com',
        }
        wilddog.initializeApp(config)
            //跟TODO数据表对应起来
        this.ref = wilddog.sync().ref('todo')
            //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },
    //应用级别的数据通信
    addItem: function(todo) {
        this.ref.push(todo) //TODO 数据表对象 数据对象化
    },
    getTodoRef: function() {
        return this.ref
    },
    login: function(callback) {
        console.log(callback);
        wilddog
            .auth()
            .signInWeapp()
            .then(function(user) {
                callback(user);
                // console.log(JSON.stringify(user));
                // wx.showToast({
                //     title: JSON.stringify(user)
                // });
            }).catch(function(err) {
                wx.showToast({
                    title: "登录失败"
                });
            })
    },
    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function(res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },

    globalData: {
        userInfo: null
    }
})