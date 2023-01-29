const mongoose = require('mongoose')
const baseUrl = 'mongodb://localhost:27017/'

function connect() {
    mongoose.connect(baseUrl + 'blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('成功连接数据库!')
        })
        .catch(() => console.log('连接数据库出错！'))
}

module.exports = connect