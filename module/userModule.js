const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    uid:Number,
    username: String,
    password: String,
    nametag: String,
    avatar: String,
    follows: Number,
    like: Number,
    article: Array
})

var model = mongoose.model('user', userSchema)

module.exports = model