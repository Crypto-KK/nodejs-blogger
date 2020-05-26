/**
 * Created by Fakin on 2018/9/21.
 */
var mongoose = require('mongoose');

var userSchemas = require('../schemas/users');

var User = mongoose.model('User', userSchemas);

module.exports = User;