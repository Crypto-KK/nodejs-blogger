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
