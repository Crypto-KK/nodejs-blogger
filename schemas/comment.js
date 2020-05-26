var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    user: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    article: {
        type: String,
        default: ''
    },
    articleId: {
        type: String,
        default: ''
    },
    isReply: {
        type: Boolean,
        default: false
    },
    replyTo: {
        type: String,
        default: ''
    },
    addTime: {
        type: Date,
        default: new Date()
    }
});
module.exports = commentSchema;