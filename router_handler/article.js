const articleModule = require('../module/articleModule')
const userModule = require('../module/userModule')
const articleIdModule = require('../module/articleIdModule')
const commentModule = require('../module/commentModule')
const imageIdModule = require('../module/imageIdModule')
const { baseURL } = require('../config/config')
const fs = require('fs')

exports.artPost = (req, res) => {
    async function handler() {
        const info = req.body
        const user = req.auth
        const file = req.file
        const fileType = file.mimetype
        const fileSize = file.size
        if (info.articleTitle !== '' || articleContent !== '') {
            if (file === undefined) {
                return res.back(302, '请上传文章封面!')
            } else {
                if (fileType !== 'image/jpeg') {
                    return res.back(303, '文章封面必须为JPG格式!')
                } else if (fileSize / 1024 / 1024 / 1024 / 1024 / 1024 > 5) {
                    return res.back(304, '文章封面大小不能超过5MB!')
                } else {
                    const extname = file.mimetype.split('/')[1] //拆分后缀名
                    const artidDoc = await articleIdModule.findOneAndUpdate({ name: 'article' }, { $inc: { artid: 1 } }, { new: true }) //id自增
                    const fileUrl = baseURL + '/images/article/articleID-' + artidDoc.artid + '/'
                    const newfilename = 'article-Cover' + '.' + extname //封面命名
                    const CoverUrl = fileUrl + newfilename //封面URL
                    fs.mkdir('./public/images/article/articleID-' + artidDoc.artid + '/', () => { }) //创建文章图片文件夹
                    fs.renameSync('./uploads/' + file.filename, './public/images/article/articleID-' + artidDoc.artid + '/' + newfilename) //重命名图片
                    const userDoc = await userModule.findOne({ 'uid': user.uid }) //查询作者
                    const addArt = await articleModule.create({
                        'artContent': info.articleContent, 'artId': artidDoc.artid, 'artImages': CoverUrl, 'artTitle': info.articleTitle, 'author': userDoc, 'date': info.articleDate
                    }) //添加文章
                    const resetId = await imageIdModule.findOneAndUpdate({ name: 'image' }, { $set:{imageId: 0} }, { new: true })//reset image id
                    const userChan = await userModule.findOneAndUpdate({ 'uid': user.uid }, { $push: { 'article': artidDoc.artid } })//将文章id添加到相应用户
                    res.back(300, '文章发布成功!')
                }
            }
        } else {
            return res.back(301, '文章标题内容不能为空!')
        }
    }
    handler()

}

exports.artList = (req, res) => {
    async function handler() {
        const list = await articleModule.find().populate('author', { 'password': 0, '_id': 0, '__v': 0 })
        res.send(list)
    }
    handler()
}

exports.artDelete = (req, res) => {
    async function handler() {
        const uid = req.auth.uid
        const artId = req.body.artId
        const artidDoc = await articleIdModule.findOneAndUpdate({ name: 'article' }, { $inc: { artid: -1 } }, { new: true })
        const artDel = await articleModule.deleteOne({ 'artId': artId })
        const userArtDel = await userModule.findOneAndUpdate({ 'uid': uid }, { $pull: { 'article': Number(artId) } })
        const artCmtDel = await commentModule.deleteMany({ 'artId': artId })
        res.back(800, '删除文章成功!')
    }
    handler()
}

exports.artImg = (req, res) => {
    async function handler() {
        const files = req.files[0]
        const extname = files.mimetype.split('/')[1] //拆分后缀名
        const imageDoc = await imageIdModule.findOneAndUpdate({ name: 'image' }, { $inc: { imageId: 1 } }, { new: true })
        const newfilename = 'article-' + imageDoc.imageId + '.' + extname //封面命名
        const artidIncDoc = await articleIdModule.findOneAndUpdate({ name: 'article' }, { $inc: { artid: 1 } }, { new: true })
        const fileUrl = baseURL + '/images/article/articleID-' + artidIncDoc.artid + '/'
        const newImagesUrl = fileUrl + newfilename
        fs.mkdirSync('./public/images/article/articleID-' + artidIncDoc.artid + '/', () => { }) //创建文章图片文件夹
        fs.renameSync('./uploads/' + files.filename, './public/images/article/articleID-' + artidIncDoc.artid + '/' + newfilename) //写入图片
        const artiddecDoc = await articleIdModule.findOneAndUpdate({ name: 'article' }, { $inc: { artid: -1 } }, { new: true })
        res.send(newImagesUrl)
    }
    handler()
}