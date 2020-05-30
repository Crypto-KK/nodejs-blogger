const express = require('express')
const path = require('path');
var session = require('express-session');
const adminRouter = require("./routers/admin")
const blogRouter = require("./routers/blog")
var ueditor = require("ueditor")


const app = express()

app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use("/uploads", express.static("./uploads"))


// 使用 session 中间件
app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 100, // 设置 session 的有效时间，单位毫秒
    },
}));

// 设置全局ejs变量
app.use((req, res, next) => {
    res.locals = {
        isLogin: req.session.user ? true : false,
        user: req.session.user,
        head: req.session.head,
        userId: req.session.userId
    }
    next()
})


//ueditor
// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {

    // ueditor 客户发起上传图片请求

    if(req.query.action === 'uploadimage'){

        // 这里你可以获得上传图片的信息
        var foo = req.ueditor;
        console.log(foo.filename); // exp.png
        console.log(foo.encoding); // 7bit
        console.log(foo.mimetype); // image/png

        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
        var img_url = 'article-images';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = 'article-images'; // 要展示给客户端的文件夹路径
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {

        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/ueditor/ueditor.config.json')
    }}));



//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// 路由
app.use('/admin', adminRouter)
app.use(blogRouter)

//listen
app.listen(8000, (req, res) => {
    console.log("running at http://127.0.0.1:8000")
})