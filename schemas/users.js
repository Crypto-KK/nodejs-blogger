/**
 * Created by Fakin on 2018/9/20.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    user: String,
    pwd: String,
    head: String,
    role: Number

});
module.exports = blogSchema;