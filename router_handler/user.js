const fs = require('fs')
const userModule = require('../module/userModule')
const articleModule = require('../module/articleModule')
const { baseURL } = require('../config/config')

exports.nicknameUpdate = (req, res) => {
    async function handler() {
        const info = req.body
        const uid = req.auth.uid
        const newNickname = info.newNickname
        const nickReg = /^[\u4E00-\u9FA5A-Za-z0-9_]{1,12}$/
        if (newNickname !== '') {
            if (!nickReg.test(newNickname)) {
                return res.back(502, '昵称不能包括特殊符号，且长度须在2至8位!')
            } else {
                const user = await userModule.findOneAndUpdate({ 'uid': uid }, { $set: { 'nickname': newNickname } })
                return res.back(500, '更改昵称成功!')
            }
        } else {
            return res.back(501, '昵称不能为空!')
        }
    }
    handler()
}
exports.tagUpdate = (req, res) => {
    async function handler() {
        const info = req.body
        const uid = req.auth.uid
        const newTag = info.newTag
        const tagReg = /^.{1,16}$/
        if (newTag !== '') {
            if (!tagReg.test(newTag)) {
                return res.back(602, '签名长度须在1到16个字符!')
            } else {
                const user = await userModule.findOneAndUpdate({ 'uid': uid }, { $set: { 'nametag': newTag } })
                return res.back(600, '更改签名成功!')
            }
        } else {
            return res.back(601, '签名不能为空!')
        }
    }
    handler()
}


exports.avatarUpdate = (req, res) => {
    async function handler() {
        const file = req.file
        const fileType = file.mimetype
        const fileSize = file.size
        const userPost = req.auth
        const user = await userModule.findOne({ 'username': userPost.username }, { 'uid': 1, 'avatar': 1 })
        const fileURL = baseURL+'/images/avatar/'
        if (fileType !== 'image/jpeg') {
            return res.back(401, '头像必须为JPG格式!')
        } else if (fileSize / 1024 / 1024 / 1024 / 1024 / 1024 > 5) {
            return res.back(402, '头像大小不能超过5MB!')
        } else {
            const extname = file.mimetype.split('/')[1]
            const newfilename = 'uid' + userPost.uid + '-' + userPost.username + '.' + extname
            const newAvatarUrl = fileURL + newfilename
            const avatar = await userModule.findOneAndUpdate({ 'uid': user.uid }, { $set: { 'avatar': newAvatarUrl } })
            fs.renameSync('./uploads/' + file.filename, './public/images/avatar/' + newfilename)
            return res.back(400, '头像上传成功!', newAvatarUrl)
        }
    }
    handler()
}

exports.getUserArticle = (req, res) => {
    async function handler() {
        const uid = req.auth.uid
        const user = await userModule.findOne({ 'uid': uid })
        const userArticle = await userModule.aggregate([{
            $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'author',
                as: 'list'
            }
        },
        {
            $match: {
                uid: Number(uid)
            }
        },
        {
            $project: {
                _id: 0,
                list: {
                    artId: 1,
                    artImages: 1,
                    artTitle: 1,
                    artContent: 1,
                    date: 1
                }
            }
        }
        ])
    res.send(userArticle[0].list)
    }
    handler()
}