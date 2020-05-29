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
let Comment = require("../models/Comment")
let User = require("../models/User")

route.get("/articles", (req, res) => {
    var id = null
    res.type("html")
    if (req.query.id) {
        id = req.query.id
         // 详情页
        Article.find({'_id': id}, (err, data) => {
            res.render("article_detail", {
                res: data,
                moment
            })
        })
    } else {
        // 列表页
        Article.find({}, (err, data) => {
            res.render("index", {
                res: data,
                moment
            })
        })

    }
})


module.exports = route;