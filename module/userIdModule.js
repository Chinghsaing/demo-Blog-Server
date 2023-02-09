const mongoose = require('mongoose')

var useridSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
})

var model = mongoose.model('userid', useridSchema)

module.exports = model