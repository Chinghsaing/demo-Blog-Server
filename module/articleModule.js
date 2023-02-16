const mongoose = require('mongoose')
const user = require('./userModule')
var artSchema = mongoose.Schema({
    artId: {
        type: Number,
        required: true
    },
    artImages: {
        type: String,
        required: true
    },
    artTitle: {
        type: String,
        required: true
    },
    artContent: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId, 
        ref: 'user',
        required: true
    },
    date: {
        type: String,
        required: true
    },
})

var model = mongoose.model('article', artSchema)

module.exports = model