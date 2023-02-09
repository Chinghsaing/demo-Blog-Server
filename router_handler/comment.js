const articleModule = require('../module/articleModule')
const userModule = require('../module/userModule')
const commentModule = require('../module/commentModule')
const commentIdModule = require('../module/commentIdModule')
exports.cmtList = (req, res) => {
    async function handler() {
        const artId = req.query.id
        const cmtList = await commentModule.find({ 'artId': artId }, { '_id': 0, '__v': 0 }).sort({ 'date': -1 }).populate('user', { '_id': 0, 'username': 1, 'avatar': 1, 'nickname': 1 })
        res.send(cmtList)
    }
    handler()
}

exports.cmtPost = (req, res) => {
    async function handler() {
        const uid = req.auth.uid
        const username = req.auth.username
        const content = req.body.content
        const artId = req.body.artId
        const date = req.body.date
        if (content === '') {
            return res.back(701, '评论内容不能为空!')
        } else if (!artId) {
            return res.back(702, '文章ID不能为空!')
        } else if (!date) {
            return res.back(703, '发布日期不能为空!')
        } else {
            const cmtIdDoc = await commentIdModule.findOneAndUpdate({ name: 'comment' }, { $inc: { cmtId: 1 } }, { new: true }) //id自增
            const userDoc = await userModule.findOne({ 'uid': uid })
            const artDoc = await articleModule.findOne({ 'artId': artId })
            commentModule.create({ 'content': content, 'user': userDoc, 'article': artDoc, 'cmtId': cmtIdDoc.cmtId, 'date': date, 'artId': artId })
            res.back(700, '评论发布成功!')
        }

    }
    handler()
}