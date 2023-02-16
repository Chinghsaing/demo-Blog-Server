const mongoose = require('mongoose')

var replySchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true
    },
    toUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true
    },
    replyContent:{
        type:String,
        require:true
    },
    date:{
        type:String,
        require:true
    },
    replyComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comment',
        require:true
    }
})

var model = mongoose.model('reply', replySchema)

module.exports = model