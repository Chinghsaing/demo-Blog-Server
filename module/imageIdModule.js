const mongoose = require('mongoose')

var imageIdSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageId: {
        type: Number,
        required: true
    },
})

var model = mongoose.model('imageid', imageIdSchema)

module.exports = model