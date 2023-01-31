const fs = require('fs')
const userModel = require('../module/userModule')

exports.upload = (req, res) => {
    async function handler() {
        const file = req.file
        const fileType = file.mimetype
        const fileSize = file.size
        const userPost = req.body
        const user = await userModel.findOne({ 'username': userPost.username }, { 'uid': 1, 'avatar': 1 })
        const baseURL = 'http://127.0.0.1/images/avatar/'
        if (fileType !== 'image/jpeg') {
            return res.back(401, '头像必须为JPG格式!')
        } else if (fileSize / 1024 / 1024 / 1024 / 1024 / 1024 > 5) {
            return res.back(402, '头像大小不能超过5MB!')
        } else {
            if (userPost.username !== '' || userPost.uid !== '') {
                if (user) {
                    if (Number(userPost.uid) === user.uid) {
                        const extname = file.mimetype.split('/')[1]
                        const newfilename = 'uid' + userPost.uid + '-' + userPost.username + '.' + file.mimetype.split('/')[1]
                        const newAvatarUrl = baseURL + newfilename
                        const avatar = await userModel.findOneAndUpdate({ 'uid': user.uid }, { $set: { 'avatar': newAvatarUrl } })
                        fs.renameSync('./uploads/' + file.filename, './public/images/avatar/' + newfilename)
                        return res.back(400, '头像上传成功！')
                    } else {
                        return res.back(405, 'id与用户不匹配!')
                    }
                } else {
                    return res.back(404, '该用户不存在')
                }
            } else {
                return res.back(403, '缺少上传的用户名和id')
            }
        }
    }
    handler()
}