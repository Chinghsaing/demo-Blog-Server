const mongoose = require('mongoose')

var commentidSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cmtId: {
        type: Number,
        required: true
    },
})

var model = mongoose.model('commentid', commentidSchema)

module.exports = model