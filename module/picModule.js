const mongoose = require('mongoose')
var picSchema = mongoose.Schema({
    pic: {
        type: String,
        required: true
    },
})

var model = mongoose.model('pic', picSchema)

module.exports = model