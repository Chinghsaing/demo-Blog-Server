const artModule = require('../module/artModule')
const userModel = require('../module/userModule')
const artidsModule = require('../module/artidsModule')
const fs = require('fs')

exports.artPost = (req, res) => {
    async function handler() {
        const info = req.body
        const user = req.auth
        const file = req.file
        const baseURL = 'http://127.0.0.1/images/article/'
        const extname = file.mimetype.split('/')[1]
        const artidDoc = await artidsModule.findOneAndUpdate({ name: 'article' }, { $inc: { artid: 1 } }, { new: true })
        const newfilename = 'articleID' + '-' + artidDoc.artid + '-' + user.uid + '-' + user.username + '.' + extname
        const newAvatarUrl = baseURL + newfilename
        fs.renameSync('./uploads/' + file.filename, './public/images/article/' + newfilename)
        const userDoc = await userModel.findOne({ 'uid': user.uid })
        artModule.create({
            'artContent': info.articleContent, 'artId': artidDoc.artid, 'artImages': newAvatarUrl, 'artTitle': info.articleTitle, 'author': userDoc, 'date': info.articleDate
        })
        //将文章id添加到相应用户
        const userChan = await userModel.findOneAndUpdate({ 'uid': user.uid }, { $push: { 'article': artidDoc.artid } })
        res.back(300, '文章发布成功！')
    }
    handler()

}

exports.artList = (req, res) => {
    async function handler() {
        const list = await artModule.find().populate('author', { 'password': 0, '_id': 0, '__v': 0 })
        res.send(list)
    }
    handler()
}