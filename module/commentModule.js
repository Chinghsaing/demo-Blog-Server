const mongoose = require('mongoose')
const user = require('./userModule')
const article = require('./articleModule')
var cmtSchema = mongoose.Schema({
    artId: {
        type: Number,
        required: true
    },
    cmtId: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user:
    {
        type: mongoose.SchemaTypes.ObjectId, ref: 'user',
        required: true
    },
    article: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'article',
        required: true
    },
    date: {
        type: String,
        required: true
    },
})

var model = mongoose.model('comment', cmtSchema)

module.exports = model