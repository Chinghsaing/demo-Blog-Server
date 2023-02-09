const mongoose = require('mongoose')

var articleidSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    artid: {
        type: Number,
        required: true
    },
})

var model = mongoose.model('articleid', articleidSchema)

module.exports = model