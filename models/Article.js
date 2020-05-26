
var mongoose = require('mongoose');

var articleSchemas = require('../schemas/article');

var Article = mongoose.model('Article', articleSchemas);

module.exports = Article;