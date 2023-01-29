const artModule = require('../module/artModule')
const userModel = require('../module/userModule')
const artidsModule = require('../module/artidsModule')

exports.artpost = (req, res) => {
    async function handler() {
        let artInfo = req.body
        //自增文章id
        let artidDoc = await artidsModule.findOneAndUpdate({ name: 'article' }, { $inc: { artid: 1 } }, { new: true })
        //找到文章作者
        let userDoc = await userModel.findOne({ 'username': artInfo.author })
        //数据库添加文章
        artModule.create({
            'artContent': artInfo.artContent, 'artId': artidDoc.artid, 'artImages': artInfo.artImages, 'artTitle': artInfo.artTitle, 'author': userDoc, 'date': artInfo.date
        })
        //将文章id添加到相应用户
        let userChan = await userModel.findOneAndUpdate({ 'username': artInfo.author }, { $push: { 'article': artidDoc.artid } })
    }
    handler()
    res.back(300, '文章发布成功！')
}

exports.artlist = (req, res) => {
    async function handler() {
        let a = await artModule.find().populate('author', { 'password': 0, '_id': 0, '__v': 0 })
        res.send(a)
    }
    handler()
}