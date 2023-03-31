const { baseURL } = require('../config/config')
const picModule = require('../module/picModule')
const fs = require('fs')

exports.picPost = (req, res) => {
    async function handler() {
        const picList = req.files
        const fileUrl = baseURL + '/images/picwall/'
        picList.sort(() => Math.random() - 0.5)
        for (let i = 0; i < picList.length; i++) {
            const fileType = picList[i].mimetype
            if (fileType !== 'image/jpeg') {
                res.back(901, '图片必须为JPG格式!')
            } else {
                const extname = picList[i].mimetype.split('/')[1]
                const picUrl = fileUrl + picList[i].filename + '.' + extname
                fs.renameSync('./uploads/' + picList[i].filename, './public/images/picwall/' + picList[i].filename + '.' + extname)
                const addPic = await picModule.insertMany({ 'pic': picUrl })
            }
        }
        res.back(900, '上传图片成功!')
    }
    handler()
}

exports.picList = (req, res) => {
    async function handler() {
        const picList = await picModule.find()
        res.send(picList)
    }
    handler()
}