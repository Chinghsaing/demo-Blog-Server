const articleModule = require('../module/articleModule')
const userModule = require('../module/userModule')
const commentModule = require('../module/commentModule')
const commentIdModule = require('../module/commentIdModule')
const replyModule = require('../module/replyModule')
exports.cmtList = (req, res) => {
    async function handler() {
        const artId = req.query.id
        const noCmtList = await commentModule.find({ 'artId': artId }, { '_id': 0, '__v': 0 }).sort({ 'date': -1 }).populate('user', { '_id': 0, 'username': 1, 'avatar': 1, 'nickname': 1 })
        if (noCmtList.length === 0) {
            res.send(noCmtList)
        } else {
            const cmtList = await commentModule.aggregate([
                {
                    $lookup: {
                        from: 'replies',
                        localField: '_id',
                        foreignField: 'replyComment',
                        as: 'replycmt'
                    }
                },
                {
                    $match: {
                        'artId': Number(artId)
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        "__v": 0
                    }
                },
            ])
            for (let j = 0; j < cmtList.length; j++) {
                for (let i = 0; i < cmtList[j].replycmt.length; i++) {
                    const replyUserDoc = await userModule.findOne({ '_id': cmtList[j].replycmt[i].user }, { 'uid': 1, 'username': 1, 'nickname': 1, 'avatar': 1, '_id': 0 })
                    const toUserDoc = await userModule.findOne({ '_id': cmtList[j].replycmt[i].toUser }, { 'uid': 1, 'username': 1, 'nickname': 1, 'avatar': 1, '_id': 0 })
                    cmtList[j].replycmt[i].user = replyUserDoc
                    cmtList[j].replycmt[i].toUser = toUserDoc
                }
            }

            for (let i = 0; i < cmtList.length; i++) {
                const userDoc = await userModule.findOne({ '_id': cmtList[i].user }, { 'uid': 1, 'username': 1, 'nickname': 1, 'avatar': 1, '_id': 0 })
                cmtList[i].user = userDoc
            }
            res.send(cmtList)
        }
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

exports.cmtReply = (req, res) => {
    async function handler() {
        const userId = req.auth.uid
        const replyContent = req.body.replyContent
        const toUserId = req.body.toUserId
        const date = req.body.date
        const cmtId = req.body.cmtId
        if (replyContent === '') {
            return res.back(701, '评论内容不能为空!')
        } else {
            const userDoc = await userModule.findOne({ 'uid': userId })
            const toUserDoc = await userModule.findOne({ 'uid': toUserId })
            const cmtDoc = await commentModule.findOne({ 'cmtId': cmtId })
            const addReplyComment = replyModule.create({ 'user': userDoc, 'toUser': toUserDoc, 'replyContent': replyContent, 'date': date, 'replyComment': cmtDoc })
            return res.back(700, '评论发布成功!')
        }
    }
    handler()
}