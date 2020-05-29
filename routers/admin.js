const express = require('express')
const route = express.Router()
const moment = require('moment')

var bodyParser = require('body-parser')
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})
// create application/json parser
var jsonParser = bodyParser.json()

var mongoose = require('mongoose')
mongoose.connect("mongodb://root:998219@127.0.0.1:27017/blogger?authSource=admin")


let Article = require("../models/Article")


// let data = {
//     title: "测试文章",
//     content: "测试内容",
//     description: "说明",
//     readNums: 0,
//     commentNums: 0
// }
// Article(data).save(err => {
//     if (err) throw err
//     console.log("save success")
// })

route.get("/", (req, res) => {
    // 管理文章列表页
    Article.find({}, (err, data) => {
        if (err) throw err;
        console.log(data)
        res.type('html');
        res.render('admin_article_list', {
            res: data,
            searchName: '',
            moment
        })
    })
})

// 获取文章数据
route.get('/articles', (req, res) => {
    var id = null
    if (req.query.id) {
        id = req.query.id
        Article.find({'_id': id}, (err, data) => {
            res.json(data)
        })
    } else if (req.query.query) {
        // 模糊查找
        Article.find({name: new RegExp(req.query.query)}, (err, data) => {
            if (err) throw err
            res.json(data)
        })
    } else {
        Article.find({}, (err, data) => {
            res.json(data)
        })
    }


})

// 编辑接口
route.post('/editArticle', urlencodedParser, (req, res) => {
    let {_id, title, content, description} = req.body
    let condition = {_id}
    let updateCondition = {title, content, description}
    Article.updateOne(condition, updateCondition, (err, results) => {
        if (err) throw err;
        console.log(results)
        res.json({status: 'ok'})
    })

})

// 删除文章
route.post('/deleteArticle', urlencodedParser, (req, res) => {
    let articleId = req.body.id
    var condition = {'_id': articleId}
    Article.remove(condition, (err, results) => {
        if (err) throw err
        console.log(results)
        res.json({
            status: 'ok'
        })
    })
})


// 新增文章页面
route.get('/createArticle', (req, res) => {
    res.type('html');
    res.render("admin_article_create")
})

// 新增接口
route.post('/createArticle', urlencodedParser, (req, res) => {
    let {title, content, description} = req.body
    Article({title, content, description}).save(err => {
        if (err) throw err;
        console.log('保存成功')
        //回到首页
        res.redirect('/admin');
    })

})

module.exports = route;