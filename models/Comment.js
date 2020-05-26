
var mongoose = require('mongoose');

var commentSchemas = require('../schemas/comment');

var Comment = mongoose.model('Comment', commentSchemas);

module.exports = Comment;