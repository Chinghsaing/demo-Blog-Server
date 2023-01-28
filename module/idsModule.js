const mongoose = require('mongoose')

var idSchema = mongoose.Schema({
    name:String,
    id: Number,
})

var model = mongoose.model('id', idSchema)

module.exports = model