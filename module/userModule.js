const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    uid: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nametag: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    follows: {
        type: Number,
        required: true
    },
    like: {
        type: Number,
        required: true
    },
    article: {
        type: Array,
        required: true
    },
})

var model = mongoose.model('user', userSchema)

module.exports = model