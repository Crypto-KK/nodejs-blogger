
/*
 * 分类表结构
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    title: String,
    content: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: ''
    },
    readNums: {
        type: Number,
        default: 0
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
},{
        versionKey: false,
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
    });

module.exports = blogSchema;