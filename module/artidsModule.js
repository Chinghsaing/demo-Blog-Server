const mongoose = require('mongoose')

var artidSchema = mongoose.Schema({
    name:String,
    artid: Number,
})

var model = mongoose.model('artid', artidSchema)

module.exports = model