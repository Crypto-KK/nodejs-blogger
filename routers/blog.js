const express = require('express')
const route = express.Router()
const moment = require('moment')
const path = require("path")
var md5=require("md5-node")

const multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '.png');
    }
})


const upload = multer({ storage: storage })//当前目录下建立文件夹uploads

var bodyParser = require('body-parser')
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})
// create application/json parser
var jsonParser = bodyParser.json()

var mongoose = require('mongoose')
mongoose.connect("mongodb://root:998219@127.0.0.1:27017/blogger?authSource=admin")


let Article = require("../models/Article")
let Comment = require("../models/Comment")
let User = require("../models/User")


route.get("/login", (req, res) => {
    res.type("html")
    res.render("login", {
        currentUser: {}
    })
})

// 用户登录
route.post('/login', urlencodedParser, function(req, res){
    let {user, pwd} = req.body
    console.log(req.body)
    User.find({user, pwd: md5(pwd)}, (err, data) => {
        if (data.length === 1) {
            // 返回一个结果
            req.session.user = data[0].user
            req.session.head = data[0].head
            req.session.userId = data[0]._id
            if (data[0].role === 1) {
                res.redirect("/admin")
            } else {
                res.redirect("/articles")
            }


        } else {
            res.json({code: 401, message: "登录失败"})
        }
    })
});

route.get("/register", (req, res) => {
    res.type("html")
    res.render("register", {
        currentUser: {}
    })
})

route.post("/register", upload.single('head'), (req, res) => {
    let {user, pwd} = req.body
    pwd = md5(pwd)
    console.log(req.file)
    User({user, pwd, head: req.file.path, role: 0}).save(err => {
        if (err) throw err;
        console.log('保存成功')
        //回到首页
        res.redirect('/login');
    })
})


route.get("/articles", (req, res) => {
    var id = null
    res.type("html")
    if (req.query.id) {
        id = req.query.id
         // 详情页
        Article.find({'_id': id}, (err, articleData) => {
            let condition = {_id: id}
            let updateCondition = {readNums: articleData[0].readNums + 1}
            Article.updateOne(condition, updateCondition, (err, results) => {
                if (err) throw err;
                console.log(results)
                Comment.find({"articleId": id, "isReply": false}, (err, commentData) => {
                    Comment.find({"articleId": id, "isReply": true}, (err, replyData) => {
                        return_comment_data = []
                        for (let i = 0; i < commentData.length; i ++) {

                            for (let j = 0; j < replyData.length; j++) {
                                if (replyData[j].replyTo === commentData[i]._id.toString()) {
                                    // 为评论的回复
                                    let temp_replys = []
                                    temp_replys.push(replyData[j])
                                    return_comment_data.push({
                                        comment: commentData[i],
                                        replys: temp_replys
                                    })
                                }
                            }
                            return_comment_data.push({
                                comment: commentData[i],
                                replys: []
                            })
                        }
                        console.log(return_comment_data)
                        res.render("article_detail", {
                            res: articleData,
                            comments: return_comment_data,
                            moment
                        })
                    })

                })
            })


        })
    } else {
        // 列表页
        Article.find({}, (err, data) => {
            res.render("index", {
                res: data,
                moment,
                currentUser: {}
            })
        })

    }
})

// 注销
route.get('/logout', function(req, res){
    req.session.user = null
    req.session.head = null
    res.redirect("/articles")
});


// 发布评论接口
route.post("/postComment", urlencodedParser, (req, res) => {
    if (req.session.user) {
        let {content, article, articleId} = req.body
        let user = req.session.user
        let userId = req.session.userId
        Comment({content, articleId, article, user, userId}).save(err => {
            if (err) throw err

            Article.find({_id: articleId}, (err2, data) =>  {
                // 评论数加1
                let condition = {_id: articleId}
                let updateCondition = {commentNums: data[0].commentNums + 1}
                Article.updateOne(condition, updateCondition, (err, results) => {
                    if (err) throw err;
                    console.log(results)
                    res.json({code: 200, message: "success"})
                })
            })


        })
    } else {
        res.redirect("/login")
    }
})


//删除评论接口
route.post("/deletePost", urlencodedParser, (req, res) => {
    let commentId = req.body.commentId
    var condition = {'_id': commentId}
    Comment.remove(condition, (err, results) => {
        if (err) throw err
        console.log(results)
        res.json({
            code: 200
        })
    })
})

// 发布评论接口
route.post("/postReply", urlencodedParser, (req, res) => {
    if (req.session.user) {
        let {content, article, articleId, replyTo} = req.body
        let user = req.session.user
        let userId = req.session.userId
        let isReply = true

        Comment({content, articleId, article, user, userId, replyTo, isReply}).save(err => {
            if (err) throw err
            Article.find({_id: articleId}, (err2, data) =>  {
                // 评论数加1
                let condition = {_id: articleId}
                let updateCondition = {commentNums: data[0].commentNums + 1}
                Article.updateOne(condition, updateCondition, (err, results) => {
                    if (err) throw err;
                    console.log(results)
                    res.json({code: 200, message: "success"})
                })
            })


        })
    } else {
        res.redirect("/login")
    }
})




module.exports = route;