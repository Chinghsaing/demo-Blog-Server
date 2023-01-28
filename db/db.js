const mongoose = require('mongoose')

function connect() {
    mongoose.connect('mongodb://localhost:27017/user', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('成功连接User数据库!')
        })
        .catch(() => console.log('连接User数据库出错！'))
}

module.exports = connect