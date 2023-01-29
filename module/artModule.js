const mongoose = require('mongoose')
const user = require('../module/userModule') 
var artSchema = mongoose.Schema({

    artImages: String,
    artTitle: String,
    artContent: String,
    author: {type:mongoose.SchemaTypes.ObjectId, ref: 'user'},
    date: String
})

var model = mongoose.model('article', artSchema)

module.exports = model